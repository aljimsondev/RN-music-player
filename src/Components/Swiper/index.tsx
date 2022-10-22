import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

interface SwiperProps {
  onPress:
    | (((event: GestureResponderEvent) => void) & (() => void))
    | undefined;
}

function Bar(props: any) {
  const {width, marginTop} = props;
  return <View style={[styles.bar, {width: width, marginTop: marginTop}]} />;
}

export default function Swiper(props: SwiperProps) {
  const {onPress} = props;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}>
      <Bar width={'80%'} marginTop={0} />
      <Bar width={'70%'} marginTop={2} />
      <Bar width={'65%'} marginTop={2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#E9E9E9',
    width: 100,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    padding: 3,
    zIndex: 10,
  },
  bar: {
    borderRadius: 10,
    backgroundColor: '#C4C4C4',
    height: 3,
  },
});
