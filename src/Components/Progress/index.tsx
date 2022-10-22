import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  SharedValue,
  withDelay,
} from 'react-native-reanimated';

interface BarProps {
  delay?: number;
  color?: string;
  height: number;
  target: number;
  duration?: number;
  style?: {};
}
function Bar(props: BarProps) {
  const {delay = 10, target, color, height, duration, style = 1000} = props;
  const animatedValue = useSharedValue(height);
  const AnimatedView = Animated.createAnimatedComponent(View);

  animatedValue.value = withDelay(
    delay,
    withRepeat(withTiming(target, {duration: duration}), -1, true),
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedValue.value,
    };
  });
  return <AnimatedView style={[styles.bar, animatedStyle, style]} />;
}
interface LoaderProps {
  count: number;
  style?: {height: number; width: number};
  target?: number;
}

export default function Loader(props: LoaderProps) {
  const {count = 11, style = {height: 60}, target = 10} = props;
  const delay = 100;
  const functionRenderBar = () => {
    return new Array(count).fill(10).map((d, index) => {
      return (
        <Bar
          style={style}
          key={index}
          height={style.height + index * 2}
          target={target}
          delay={delay * index + 1}
        />
      );
    });
  };
  return (
    <Animated.View style={styles.container}>
      {functionRenderBar()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  bar: {
    width: 10,
    borderRadius: 10,
    margin: 3,
    backgroundColor: '#403A3A',
  },
});
