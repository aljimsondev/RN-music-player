import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Dimensions, Text, useColorScheme} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SongPlaylist from '../../Screens/SongPlaylist';
import SongList from '../../Screens/SongList';
import SongArtists from '../../Screens/SongArtists';
import SongAlbum from '../../Screens/SongAlbum';
import SongQueue from '../../Screens/SongQueue';
import ViewAlbum from '../../Screens/ViewAlbum';
import SongSearch from '../../Screens/SongSearch';
import {MainScreenProps} from '../Types/types';
import {LightTheme, CustomTheme} from '../../Components/Theme';
import {View, StyleSheet} from 'react-native';
import Queue from '../../Screens/SongQueue';
import SongPlaying from '../../Components/BackgroundPlaying/SongPlaying';
import CustomSplashScreen from '../../Screens/Splash';
import {Context} from '../Store';
import SongModalOption from '../../Screens/SongModalOption';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AudioPlayer, {defaultOptions} from '../Audio/controller';

const Stack = createNativeStackNavigator();
const {height, width} = Dimensions.get('screen');

export default function MainScreen(props: MainScreenProps) {
  const scheme = useColorScheme();
  const {queue, loading} = React.useContext(Context);
  const containerScreen = useSharedValue(100);
  const animatedHeight = useSharedValue(height);
  const open = useSharedValue(false);
  const queueContainerHeight = useSharedValue(0);
  const translateHeader = useSharedValue(0);
  const audioplayer = new AudioPlayer(defaultOptions);
  const animate = () => {
    //first time open
    animatedHeight.value = 100;
  };

  const togglePlayingModal = (isOpen?: boolean) => {
    'worklet';
    if (isOpen === true) {
      animatedHeight.value = containerScreen.value; //100 percent of the screen
      open.value = true;
    } else if (isOpen === false) {
      animatedHeight.value = containerScreen.value * 0.12; //12 percent of the screen
      open.value = false;
    } else {
      //undefined
      if (open.value) {
        animatedHeight.value = containerScreen.value * 0.12;
        open.value = false;
      } else {
        animatedHeight.value = containerScreen.value;
        open.value = true;
      }
    }
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      minHeight: animatedHeight.value,
      height: animatedHeight.value,
      maxHeight: animatedHeight.value,
    };
  });
  const animatedHeader = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        queueContainerHeight.value,
        [0, 50, 90, 100],
        [0, 0, 0, 1],
      ),
      // transform: [
      //   {
      //     translateX: withTiming(translateHeader.value, {duration: 1000}),
      //   },
      // ],
    };
  });
  const queueHandler = {
    close: () => {
      queueContainerHeight.value = -width;
      translateHeader.value = 0;
    },
    open: () => {
      translateHeader.value = 0;
      queueContainerHeight.value = 100;
    },
  };
  const animateQueueWrapper = useAnimatedStyle(() => {
    return {
      backgroundColor: 'red',
      // backgroundColor: open.value ? modalColor.value : '#302832',
      height: withTiming(`${queueContainerHeight.value}%`, {duration: 500}),
    };
  });

  return (
    <NavigationContainer theme={scheme === 'light' ? LightTheme : CustomTheme}>
      <View
        style={styles.container}
        onLayout={e => {
          const {height} = e.nativeEvent.layout;
          //set the initial screen value
          containerScreen.value = height;
          animatedHeight.value = height * 0.12;
        }}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={CustomSplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SongPlaylist"
            component={SongPlaylist}
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="SongList"
            component={SongList}
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="SongModalOption"
            component={SongModalOption}
            options={{
              headerShown: false,
              animation: 'slide_from_bottom',
              presentation: 'transparentModal',
            }}
          />
          <Stack.Screen
            name="SongArtist"
            component={SongArtists}
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="SongAlbum"
            component={SongAlbum}
            options={{
              headerShown: false,
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="SongQueue"
            component={SongQueue}
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="ViewAlbum" component={ViewAlbum} />
          <Stack.Screen name="SongSearch" component={SongSearch} />
        </Stack.Navigator>
        <Animated.View style={[styles.abs_wrapper, animatedStyle]}>
          <SongPlaying
            animatedHeight={animatedHeight}
            containerScreen={containerScreen}
            open={open}
            queueHandler={queueHandler}
            togglePlayingModal={togglePlayingModal}
          />
        </Animated.View>
        {/*====================SONG QUEUE===================================*/}
        <Animated.View style={[styles.queue_wrapper, animateQueueWrapper]}>
          <Queue queueHandler={queueHandler} animatedHeader={animatedHeader} />
        </Animated.View>
        {/*====================end of SONG QUEUE===================================*/}
      </View>
    </NavigationContainer>
  );
}

//when playing is enabled the animatedHeight should be 10 percent otherwise 100
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  //absolute player page wrapper
  abs_wrapper: {
    right: 0,
    flex: 1,
    bottom: 0,
    width: '100%',
    position: 'absolute',
    overflow: 'hidden',
    height: '100%',
  },
  //queue wrapper
  queue_wrapper: {
    backgroundColor: 'red',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    zIndex: 30,
  },
});
