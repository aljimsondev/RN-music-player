import RNFS, {ReadDirItem} from 'react-native-fs';
import Storage from './Storage';

async function SaveFiles(file: ReadDirItem) {
  const storage = new Storage();
  let files: ReadDirItem[] = [];
  if (!file) return;
  try {
    // storage.deleteKey('files').then(() => {
    //   console.log('removed key');
    // });
    storage.getKey('files').then(data => {
      if (data) {
        //merge files
        const parsedData: ReadDirItem[] = JSON.parse(data);
        // console.log(parsedData.length + ' is the size of the last array');
        const ifexisted = parsedData.find(d => {
          d.name === file.name;
        });
        if (ifexisted) {
          return;
        } else {
          //add to array
          parsedData.push(file);
          storage.setKey('files', JSON.stringify(parsedData));
        }
      } else {
        //add key
        // console.log('no key found');
        const array = [{...file}];
        storage.setKey('files', JSON.stringify(array));
      }
    });
  } catch (e) {
    console.log('Error in this block');
  }
}
/**
 *
 * @param fileType -file type to be filtered
 * @param file -file name
 * @returns
 */
function checkFileType(fileType: 'audio' | 'video' | 'photos', file: string) {
  const mimeTypes = {
    audio: ['mp3', 'm4a', 'ogg'],
    video: ['mp4', 'wav'],
    image: ['jpg', 'png'],
  };
  let status = false;
  if (fileType === 'audio') {
    const mime = file.split('.');
    mime.map(d => {
      if (mimeTypes.audio.some(x => x === d)) {
        status = true;
      }
    });
  }
  return status;
}
function checkHiddenDirectory(array: ReadDirItem[]) {
  const excludedFolder = ['Android'];
  const final: ReadDirItem[] = array.filter(
    d => !excludedFolder.includes(d.name),
  );
  const filteredFolders: ReadDirItem[] = final.filter(
    i => (i.name[0] === '.') === false,
  );
  return filteredFolders;
}

interface LoopSearchDir {
  type: {
    audio: 'mp3' | 'm4a';
    video: 'mp4' | 'wav';
    photos: 'jpg' | 'png';
  };
  parentDir: string;
}
/**
 *  Searches every Directory given starting from the parentDirectory to the child Directory and returns the filetype what user wants
 * @param fileType - `audio`, `video`, `photos` the files you want to be return
 * @param parentDir - a path or directory to be search
 */

export async function SearchDirectory(
  fileType: 'audio' | 'video' | 'photos',
  parentDir: LoopSearchDir['parentDir'] | 'main',
) {
  let dir;
  let files: ReadDirItem[] = [];
  try {
    //identfying directory
    if (parentDir === 'main') {
      dir = RNFS.ExternalStorageDirectoryPath;
    } else {
      dir = parentDir;
    }

    //reading directory
    if (dir) {
      const data = await RNFS.readDir(dir);
      const filteredDir = checkHiddenDirectory(data);

      for (const file of filteredDir) {
        //type cheking
        if (checkFileType(fileType, file.name)) {
          files.push(file);
          continue;
        }
        //checking if sub directories found
        if (file.isDirectory()) {
          //recursive call to the subdirectories
          const subfiles = await SearchDirectory(fileType, file.path);
          if (subfiles) {
            if (subfiles.length > 0) {
              //mapping all the subfiles that consist of audio
              subfiles.map(file => {
                files.push(file);
              });
            }
          }
        }
      }
    }
    return files;
  } catch (e) {
    console.log(e);
  }
}
