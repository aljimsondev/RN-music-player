import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {
  StyleSheet,
  View,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import MainScreen from './src/lib/Routes/routes';
import GlobalContext, {Context} from './src/lib/Store';
import AudioPlayer, {defaultOptions} from './src/lib/Audio/controller';
import {SearchDirectory} from './src/lib/Addons/directorySearch';
import {shuffle} from './src/lib/Addons/Shuffle';
import {PlaylistTypes} from './src/lib/Types/types';
import FS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';

//TODO
//loads all the resources including the song queue if playback is not ready then render loading screen

export default function App(props: any) {
  const {} = props;
  const {loading, queue, setQueue, setLoading, setFiles} =
    React.useContext(Context);
  const scheme = useColorScheme();
  const audioplayer = new AudioPlayer(defaultOptions);
  //default color of bottom navigation bar
  const bottomNavigationBarColor = '#302832';

  //=========System navigation Bar color Styling============
  SystemNavigationBar.setNavigationColor(bottomNavigationBarColor);
  //todo here
  //identify if view playing page is open if open then change the status bar color else apply none
  //when first time loading splash screen must be displayed to load data
  //load the first song in first time open otherwise resume last song played and its duration
  //==========================================================
  //=========Animation values============
  async function SearchSongs() {
    return await SearchDirectory('audio', 'main');
  }
  const CheckPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      const readGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      const writeGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!readGranted || !writeGranted) {
        console.warn('Permission is not granted, now ask for it bitch!');
      } else {
        console.log('granted');
        //called in first render of the App
        //first search if the songs was registered then add it to the queue
        //if its the first time to use the app then search the songs the n save it for the next render
        //during playback allow search of the songs to render new added songs
        await audioplayer.checkFile('songs').then(data => {
          if (data) {
            console.log(data);
            // SplashScreen.hide();
          }
        });
        SearchSongs().then(data => {
          const shuffledSongs = shuffle(data);
          // //setting the Queue of Playlist
          const this_queue: PlaylistTypes[] = shuffledSongs.map((d, index) => {
            return {
              id: Math.floor(Math.random() * Date.now()) + index,
              url: `file://${d.path}`,
              title: d.name,
              artist: 'Unknown',
              artwork: 'none',
              size: d.size,
            };
          });

          setQueue(this_queue);
          console.log(this_queue);
          //storing song to the files state
          SplashScreen.hide();
          setFiles(data);
          audioplayer.saveFile('songs', JSON.stringify(this_queue)).then(() => {
            console.log('data is saved');
            TrackPlayer.add(this_queue);
            TrackPlayer.play();
          });
        });
      }
    } catch (e) {
      console.log('Error in splash');
    }
  };

  React.useEffect(() => {
    console.log('Loaded from the App');
    CheckPermission();
  }, []);
  return (
    <GlobalContext>
      <View style={styles.container}>
        <StatusBar
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={'#1EC560'}
        />
        <MainScreen />
      </View>
    </GlobalContext>
  );
}
//when playing is enabled the animatedHeight should be 10 percent otherwise 100
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
