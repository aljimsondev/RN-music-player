import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

interface TrackProgressProps {
  clearProgress: boolean;
  duration: number | undefined;
  hidden?: boolean;
  style?: {};
  containerStyle?: {};
}

export default function TrackProgress(props: TrackProgressProps) {
  const {
    clearProgress,
    duration,
    hidden,
    style = {height: 8, borderRadius: 10},
    containerStyle = {height: 8, borderRadius: 10},
  } = props;
  const [seekToggled, setSeekToggled] = React.useState(false);
  const [seekDuration, setSeekDuration] = React.useState(0);
  const {position} = useProgress();
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [hour, setHour] = React.useState(0);
  const progress = useSharedValue(1);
  const dragToSeekValue = useSharedValue(1);
  const [songDuration, setSongDuration] = React.useState({
    seconds: 0,
    minutes: 0,
    hour: 0,
  });
  const trackerPosition = useSharedValue(position ? position : 1);
  const widthOfProgressWrapper = useSharedValue(0);
  const animate = () => {
    trackerPosition.value = withTiming(position);
  };
  function FormatSongDuration(time: number) {
    let formattedSeconds = Math.floor(time % 60);
    let formattedMinutes = Math.floor((time % (1000 * 60 * 60)) / 60);
    let formattedHour = Math.floor((time % (1000 * 60 * 60 * 24)) / (60 * 60));
    if (formattedMinutes >= 60) {
      formattedMinutes = formattedMinutes - 60;
    }
    return {
      formattedSeconds,
      formattedMinutes,
      formattedHour,
    };
  }
  const GetFormattedDuration = () => {
    if (!duration) return;
    const {formattedHour, formattedSeconds, formattedMinutes} =
      FormatSongDuration(duration);
    setSongDuration({
      seconds: formattedSeconds,
      minutes: formattedMinutes,
      hour: formattedHour,
    });
    return () => {
      //clean up
      setSongDuration({
        seconds: 0,
        minutes: 0,
        hour: 0,
      });
    };
  };

  React.useEffect(() => {
    //getting the song duration
    GetFormattedDuration();
  }, [clearProgress, duration]);
  async function Seek() {
    await TrackPlayer.seekTo(seekDuration)
      .then(data => {
        console.log(data + ' is the data');
      })
      .catch(e => {
        console.log(e);
      });
  }
  React.useEffect(() => {
    if (seekToggled) {
      console.log('Seek goes here');
      Seek();
    }
    return () => {
      //clean up
      setSeekToggled(false);
    };
  }, [seekToggled]);

  React.useEffect(() => {
    animate();
    const {formattedHour, formattedMinutes, formattedSeconds} =
      FormatSongDuration(position);
    setSeconds(formattedSeconds);
    setMinutes(formattedMinutes);
    setHour(formattedHour);
    return () => {
      //clean up
      setSeconds(0);
      setMinutes(0);
      setHour(0);
    };
  }, [position, clearProgress]);

  const animatedDragSeek = useAnimatedStyle(() => {
    //manages the drag of seeking of music duration

    return {
      minWidth: `${dragToSeekValue.value}%`,
      width: `${dragToSeekValue.value}%`,
      backgroundColor: 'red',
    };
  });
  const animatedWidth = useAnimatedStyle(() => {
    //manages the display animation of progress
    const fullWidth = duration || 0;
    let widthPercentage = Math.ceil((trackerPosition.value / fullWidth) * 100);
    if (widthPercentage > 0) {
      if (widthPercentage > 100) {
        progress.value = 100;
      } else {
        progress.value = widthPercentage;
      }
    } else {
      progress.value = 1;
    }
    return {
      minWidth: `${progress.value}%`,
      width: `${progress.value}%`,
      backgroundColor: '#1EC560',
    };
  });
  const handleSeek = async (timeToSeek: string) => {
    const parsedTime = parseInt(timeToSeek);
    setSeekDuration(parsedTime);
    setSeekToggled(true);
  };
  //=============================================================
  //==================================Seek Duration Handler============

  const seekDurationHandler = useAnimatedGestureHandler({
    onStart: event => {
      const startingPoint = event.x;
      const percentageScrolled = Math.ceil(
        (startingPoint / widthOfProgressWrapper.value) * 100,
      );
      dragToSeekValue.value = percentageScrolled;
    },
    onFinish: () => {
      let currentDuration;
      if (!duration) {
        currentDuration = 0;
      } else {
        currentDuration = duration;
      }
      const timeToSeek = ((progress.value / 100) * currentDuration).toFixed(0);
      console.log(timeToSeek);
      runOnJS(handleSeek)(timeToSeek);
    },
    onActive: (e, ctx) => {
      const scrolled = e.x;
      const percentageScrolled = Math.ceil(
        (scrolled / widthOfProgressWrapper.value) * 100,
      );

      if (percentageScrolled <= 0) {
        dragToSeekValue.value = 1;
      } else if (percentageScrolled >= 100) {
        dragToSeekValue.value = 100;
      } else {
        dragToSeekValue.value = percentageScrolled;
      }
    },
  });

  return (
    <Animated.View style={[styles.container]}>
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={seekDurationHandler}>
          <Animated.View
            style={[styles.progressWrapper, containerStyle]}
            onLayout={e => {
              widthOfProgressWrapper.value = e.nativeEvent.layout.width;
            }}>
            <Animated.View style={[styles.progress, animatedWidth, style]} />
            <Animated.View style={[styles.seekToProgress, animatedDragSeek]} />
            {!hidden && <View style={styles.tracker} />}
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
      {!hidden && (
        <View style={styles.timeDuration}>
          <Text>
            {hour > 9 ? hour : '0' + hour}:
            {minutes > 9 ? minutes : '0' + minutes}:
            {seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0)}
          </Text>
          <Text>
            {songDuration.hour < 10
              ? '0' + songDuration.hour
              : songDuration.hour}
            :
            {songDuration.minutes < 10
              ? '0' + songDuration.minutes
              : songDuration.minutes}
            :
            {songDuration.seconds < 10
              ? '0' + songDuration.seconds
              : songDuration.seconds}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  progressWrapper: {
    // borderRadius: 10,
    width: '100%',
    backgroundColor: '#000',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    // borderRadius: 10,
    zIndex: 5,
    maxWidth: `100%`,
  },
  seekToProgress: {
    backgroundColor: 'red',
    height: '100%',
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    position: 'absolute',
    zIndex: 2,
  },
  tracker: {
    height: 12,
    width: 12,
    backgroundColor: '#1EC560',
    borderRadius: 10,
    right: 0,
    transform: [{translateX: -10}],
    zIndex: 5,
  },
  timeDuration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
