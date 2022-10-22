import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import FooterBG from '../Assets/mountain.png';
import SplashImg from '../Assets/splash.png';
import Plane from '../Assets/plane.png';
import Cloud from '../Assets/cloud.png';
import Loader from '../Components/Progress';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import {MainProps} from '../lib/Types/types';
import {Context} from '../lib/Store';
const {width, height} = Dimensions.get('screen');

export default function SplashScreen(props: MainProps) {
  const AnimatedView = Animated.createAnimatedComponent(View);
  const translation = useSharedValue(-50);
  const translateSplash = useSharedValue(0);
  const {queue, loading} = React.useContext(Context);

  const animatePlane = () => {
    translation.value = withTiming(width * 2, {
      duration: 5000,
    });
  };
  const SplashScreenOut = () => {
    translateSplash.value = withTiming(-width, {
      duration: 500,
    });
  };
  const planeAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(translation.value, {
            duration: 3000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });
  const moonAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withTiming(translation.value / 3, {
              duration: 40000,
            }),
            -1,
            true,
          ),
        },
      ],
    };
  });
  const cloudAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withTiming(translation.value / 5, {
              duration: 20000,
            }),
            -1,
            true,
          ),
        },
      ],
    };
  });
  const bigCloudAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withTiming(translation.value / 5, {
              duration: 20000,
            }),
            -1,
            true,
          ),
        },
      ],
    };
  });
  const translationSplash = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withDelay(
            2000,
            withTiming(translateSplash.value, {
              duration: 1000,
            }),
          ),
        },
      ],
      //   opacity: interpolate(translateSplash.value, [0, -width], [1, 1]),
    };
  });

  React.useEffect(() => {
    animatePlane();
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log('Focuses in spash screen');
    });
    return props.navigation.navigate('SongList');
    return () => {
      unsubscribe;
    };
  }, [loading]);
  return (
    <Animated.View style={[styles.container, translationSplash]}>
      <View style={styles.base}>
        <Image source={SplashImg} style={styles.img} />
        <View style={styles.loadingWrapper}>
          <View style={styles.loader}>
            <Loader />
          </View>
        </View>
        <AnimatedView style={[styles.plane, planeAnimation]}>
          <Image source={Plane} style={{height: '100%', width: '100%'}} />
        </AnimatedView>
        <AnimatedView style={[styles.cloud, cloudAnimation]}>
          <Image source={Cloud} style={{height: '100%', width: '100%'}} />
        </AnimatedView>
        <AnimatedView style={[styles.cloud_big, bigCloudAnimation]}>
          <Image source={Cloud} style={{height: '100%', width: '100%'}} />
        </AnimatedView>
        <Image source={FooterBG} style={styles.footerBG} />
        <AnimatedView style={[styles.moon, moonAnimation]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1EC560',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 11,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  base: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  img: {
    height: 200,
    width: 200,
  },
  footerBG: {
    position: 'absolute',
    bottom: 0,
    zIndex: 11,
  },
  loadingWrapper: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  loader: {
    flex: 1,
    height: 100,
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  plane: {
    height: 20,
    width: 100,
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    top: height * 0.6, // 3/4 of the screen
    zIndex: 14,
  },
  cloud: {
    height: 50,
    width: 100,
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    top: height * 0.75, // 3/4 of the screen
    zIndex: 12,
  },
  cloud_big: {
    height: 80,
    width: 200,
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    top: height * 0.65, // 3/4 of the screen
    zIndex: 12,
  },
  moon: {
    height: 80,
    width: 80,
    position: 'absolute',
    left: 20,
    top: height * 0.6, // 3/4 of the screen
    zIndex: 10,
    backgroundColor: 'lightgray',
    borderRadius: 50,
  },
});
