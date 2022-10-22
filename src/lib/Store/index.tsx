import React from 'react';
import {ContextProps, ContextStoreProps, PlaylistTypes} from '../Types/types';
import {ReadDirItem} from 'react-native-fs';
import {SearchDirectory} from '../Addons/directorySearch';
import {shuffle} from '../Addons/Shuffle';
import AudioPlayer, {defaultOptions} from '../Audio/controller';

const audioplayer = new AudioPlayer(defaultOptions);

export const Context = React.createContext<ContextProps>({
  playlist: [],
  favorites: [],
  setFavorites: () => {},
  setPlaylist: () => {},
  isLoaded: false,
  setLoadedStatus: () => {},
  files: [],
  setFiles: () => {},
  loading: false,
  setLoading: () => {},
  queue: [],
  setQueue: () => {},
});

export default function Store(props: ContextStoreProps) {
  const {children} = props;
  const [loading, setLoading] = React.useState(true);
  const [files, setFiles] = React.useState<ReadDirItem[]>([]);
  const [songQueue, setQueue] = React.useState<PlaylistTypes[]>([]);
  const [playlist, setPlaylist] = React.useState<PlaylistTypes[]>([]);
  const [favorites, setFavorites] = React.useState([]);
  const [isLoaded, setLoadedStatus] = React.useState(false);

  async function SearchSongs() {
    return await SearchDirectory('audio', 'main');
  }

  React.useEffect(() => {
    console.log('Loaded from the Store');
    SearchSongs().then(data => {
      const shuffledSongs = shuffle(data);
      // //setting the Queue of Playlist
      const this_queue: PlaylistTypes[] = shuffledSongs.map(d => {
        return {
          id: Date.now(),
          url: `file://${d.path}`,
          title: d.name,
          artist: 'Unknown',
          artwork: 'none',
          size: d.size,
        };
      });

      setQueue(this_queue);
      //storing song to the files state
      setFiles(data);
      audioplayer.saveFile('songs', JSON.stringify(this_queue)).then(() => {
        console.log('data is saved');
      });
    });
    return () => {
      //clean up
      setFiles([]);
    };
  }, []);

  return (
    <Context.Provider
      value={{
        //passed global context value here
        favorites: favorites,
        playlist: playlist,
        isLoaded: isLoaded,
        setFavorites: setFavorites,
        setPlaylist: setPlaylist,
        setLoadedStatus: setLoadedStatus,
        files: files,
        setFiles: setFiles,
        setLoading: setLoading,
        loading: loading,
        setQueue: setQueue,
        queue: songQueue,
      }}>
      {children}
    </Context.Provider>
  );
}
