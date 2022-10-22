import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import IconButton from '../IconButton';
import Icon from 'react-native-vector-icons/AntDesign';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface ModalPropTypes {
  queueHandler: {
    open: () => void;
    close: () => void;
  };
  animatedHeader: {
    opacity: number;
  };
}

const {width, height} = Dimensions.get('screen');

export default function ModalHeader(props: ModalPropTypes) {
  const {queueHandler, animatedHeader} = props;
  const translation = useSharedValue(0);

  const handleClose = () => {
    translation.value = withTiming(0, {duration: 1000});
    queueHandler.close();
  };

  return (
    <Animated.View
      style={[styles.container, animatedHeader]}
      onLayout={() => {
        console.log('Called in open');
        translation.value = withTiming(50, {duration: 1000});
      }}>
      <View style={styles.button}>
        <IconButton
          icon={<Icon name="arrowleft" size={24} />}
          onPress={handleClose}
        />
      </View>
      <Text style={styles.title}>Current Playlist</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height * 0.08,
    minHeight: height * 0.08,
    maxHeight: height * 0.08,
    width: '100%',
    backgroundColor: '#1EC560',
    elevation: 1,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    // position: 'absolute',
    // top: 0,
    // left: 0,
  },
  button: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
  },
});
