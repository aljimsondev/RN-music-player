import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function PlayingIndicator() {
  const maxHeight = useSharedValue(1);
  const animatedBar1 = useAnimatedStyle(() => {
    return {
      height: withRepeat(
        withTiming(maxHeight.value, {
          duration: 800,
        }),
        -1,
        true,
      ),
    };
  });
  const animatedBar2 = useAnimatedStyle(() => {
    return {
      height: withDelay(
        300,
        withRepeat(
          withTiming(maxHeight.value, {
            duration: 500,
          }),
          -1,
          true,
        ),
      ),
    };
  });
  const animatedBar3 = useAnimatedStyle(() => {
    return {
      height: withDelay(
        500,
        withRepeat(
          withTiming(maxHeight.value, {
            duration: 500,
          }),
          -1,
          true,
        ),
      ),
    };
  });
  const animatedBar4 = useAnimatedStyle(() => {
    return {
      height: withDelay(
        300,
        withRepeat(
          withTiming(maxHeight.value, {
            duration: 1000,
          }),
          -1,
          true,
        ),
      ),
    };
  });

  function animate() {
    maxHeight.value = 15;
  }
  React.useEffect(() => {
    animate();
  }, []);

  return (
    <View
      style={styles.container}
      onLayout={() => {
        maxHeight.value = Math.floor(Math.random() * maxHeight.value);
      }}>
      <Animated.View style={[styles.bar, animatedBar1]} />
      <Animated.View style={[styles.bar, animatedBar2]} />
      <Animated.View style={[styles.bar, animatedBar3]} />
      <Animated.View style={[styles.bar, animatedBar4]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    width: 3,
    backgroundColor: '#3AED81',
    marginRight: 2,
  },
});
