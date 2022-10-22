import React from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Swiper from '../Swiper';
import IconButton from '../IconButton';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import SampleImg from '../../Assets/3.jpg';

import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Context} from '../../lib/Store';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import AudioPlayer, {defaultOptions} from '../../lib/Audio/controller';
import TrackProgress from '../Progress/TrackProgress';
import {useNavigation} from '@react-navigation/native';

interface SongPlayingProps {
  open: SharedValue<boolean>;
  togglePlayingModal: (isOpen?: boolean) => void;
  animatedHeight: SharedValue<number>;
  containerScreen: SharedValue<number>;
  queueHandler: {
    close: () => void;
    open: () => void;
  };
}
const {width, height} = Dimensions.get('screen');

interface TrackInfoType {
  title?: string;
  artist?: string;
}

export default function SongPlaying(props: SongPlayingProps) {
  const {
    togglePlayingModal,
    animatedHeight,
    open,
    containerScreen,
    queueHandler,
  } = props;
  const [playing, setPlaying] = React.useState(false);
  const [clearTrackProgress, setClearTrackProgress] = React.useState(false);
  const [trackInfo, setTrackInfo] = React.useState<TrackInfoType>({
    title: '',
    artist: '',
  });
  const {playlist, queue} = React.useContext(Context);
  const [duration, setDuration] = React.useState<number | undefined>(0);
  const audioplayer = new AudioPlayer(defaultOptions);
  const color = '#0fc035';

  //=====================================================
  //=================ICONS================================
  const playIcon = <FaIcon name="play" size={18} color={color} />;
  const pauseIcon = <FaIcon name="pause" size={18} color={color} />;
  const nextIcon = <FaIcon name="step-forward" size={18} color={color} />;
  const prevIcon = <FaIcon name="step-backward" size={18} color={color} />;
  const shuffleIcon = <FaIcon name="random" size={18} color={color} />;
  const listIcon = <FaIcon name="list-ul" size={18} color={color} />;
  //=====================================================
  //=====================================================
  const translationFooter = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const modalColor = useSharedValue('#F5F3F3');
  const footerScale = interpolate(
    translationFooter.value,
    [0, width],
    [1, 0],
    'clamp',
  );
  const backgroundPlayingAnimation = useAnimatedStyle(() => {
    let style = {};
    if (!open.value) {
      //modal is close
      //hide the background play
      style = {
        transform: [
          {
            translateX: withTiming(0, {
              duration: 200,
            }),
          },
        ],
        opacity: withTiming(1, {
          duration: 500,
        }),
      };
    } else {
      //modal is open
      //show the background play
      style = {
        transform: [
          {
            translateX: withTiming(-width, {
              duration: 200,
            }),
          },
        ],
        opacity: withTiming(0, {
          duration: 500,
        }),
      };
    }
    return style;
  });
  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedHeight.value,
        [containerScreen.value * 0.12, containerScreen.value],
        [0, 1],
      ),
    };
  });
  const animatedContainer = useAnimatedStyle(() => {
    return {
      backgroundColor: open.value ? modalColor.value : '#302832',
      height: animatedHeight.value,
      minHeight: animatedHeight.value,
      maxHeight: animatedHeight.value,
    };
  });
  const animatedFooter = useAnimatedStyle(() => {
    let translation;
    if (open.value) {
      translation = {
        transform: [
          {
            translateY: withTiming(0, {
              duration: 500,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
          },
          {
            scale: footerScale,
          },
        ],
        opacity: 1,
      };
    } else {
      translation = {
        transform: [
          {
            translateY: withTiming(width, {
              duration: 500,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
          },
          {
            scale: footerScale,
          },
        ],
        opacity: withTiming(0, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      };
    }
    return translation;
  });

  const swipeGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      console.log('Swipe started');
    },
    onActive: (e, ctx) => {
      let scrolly = e.translationY;
      scrollY.value = scrolly;
      let remainingHeight = containerScreen.value - scrolly;
      animatedHeight.value = remainingHeight;
    },
    onEnd: () => {
      if (scrollY.value > height * 0.5) {
        //scrolled position is greater that the half of screen
        togglePlayingModal(false);
      } else {
        togglePlayingModal(true);
      }
    },
  });

  const openQueueList = () => {
    queueHandler.open();
    // animatedHeight.value = containerScreen.value;
    // queueContainerHeight.value = withTiming(containerScreen.value, {
    //   duration: 500,
    // });
  };
  const closeQueueList = () => {
    queueHandler.close();
  };
  //=========================================================================================
  //=========================================================================================
  //=========================================================================================
  //=========================================================================================
  const gettingAudioStatus = async () => {
    const playing = await audioplayer.isPlaying();
    if (playing) {
      setPlaying(true);
    }
  };
  const handleToggle = () => {
    if (playing) {
      //paused functionality
      audioplayer.pause();
      setPlaying(false);
    } else {
      //play functionality
      audioplayer.play();
      setPlaying(true);
    }
  };
  const getQueue = async () => {
    await audioplayer.getKey('songs').then(data => {
      if (data) {
        // console.log(data);
        audioplayer.add(JSON.parse(data));
        audioplayer.play();
      }
    });
  };
  React.useEffect(() => {
    getQueue();
  }, []);
  React.useEffect(() => {
    return () => {
      //clean up
      setClearTrackProgress(false);
    };
  }, [clearTrackProgress]);

  const clearTrackProgressOnChangeTrack = React.useCallback(() => {
    setClearTrackProgress(true);
  }, [clearTrackProgress]);

  React.useEffect(() => {
    gettingAudioStatus();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      //found next audio in track
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const duration = await TrackPlayer.getDuration();
      const {title, artist} = track || {title: '', artist: ''};
      setTrackInfo({
        title: title,
        artist: artist,
      });
      setDuration(duration);
    }
  });
  useTrackPlayerEvents([Event.PlaybackState], async event => {
    const stateOnPlay = ['Playing', 'Buffering'];
    const duration = await TrackPlayer.getDuration();
    const track = await TrackPlayer.getCurrentTrack();
    const currentQueue = await TrackPlayer.getQueue();
    if (stateOnPlay.some(x => x === State[event.state])) {
      setPlaying(true);
      const currentTrack = currentQueue[track] || {title: '', artist: ''};
      setTrackInfo({
        title: currentTrack.title,
        artist: currentTrack.artist,
      });
      setDuration(duration);
    } else {
      setPlaying(false);
    }
  });

  const handlePrev = () => {
    audioplayer.prev();
    clearTrackProgressOnChangeTrack();
  };
  const handleNext = () => {
    audioplayer.next();
    clearTrackProgressOnChangeTrack();
  };

  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={swipeGestureHandler}>
          <Animated.View style={[styles.header]}>
            <Swiper onPress={() => togglePlayingModal()} />
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
      <Animated.View style={[styles.body, animatedOpacity]}>
        {/*=========================content====================*/}
        <View style={styles.playerImg_wrapper}>
          <Image style={styles.playerImg} source={SampleImg} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {trackInfo.title}
          </Text>
          <Text>{trackInfo.artist}</Text>
          <View style={styles.progressWrapper}>
            <TrackProgress
              duration={duration}
              clearProgress={clearTrackProgress}
            />
          </View>
          <View style={styles.additionalOptions}>
            <View
              style={[styles.optionsButton, styles.centered, styles.hidden]}>
              <IconButton icon={playIcon} onPress={() => handleToggle()} />
            </View>
            <View
              style={[styles.optionsButton, styles.centered, styles.hidden]}>
              <IconButton icon={playIcon} onPress={() => handleToggle()} />
            </View>
            <View
              style={[styles.optionsButton, styles.centered, styles.hidden]}>
              <IconButton icon={playIcon} onPress={() => handleToggle()} />
            </View>
          </View>
        </View>
        {/*=========================end========================*/}
      </Animated.View>
      {/*==============================================================*/}
      <Animated.View
        style={[styles.backgroundPlayingWrapper, backgroundPlayingAnimation]}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.backgroundPlayingPressableWrapper}
            onPress={() => togglePlayingModal()}>
            <View style={styles.backgroundPlaying_img_wrapper}>
              <Image source={SampleImg} style={styles.backgroundPlaying_img} />
            </View>
            <View style={styles.backgroundPlayingPressableTitle}>
              <Text
                style={[styles.backgroundPlaying_text, {color: '#F2F2F2'}]}
                numberOfLines={1}>
                {trackInfo.title}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.backgroundPlayingButtonWrapper}>
            <IconButton
              icon={
                playing ? (
                  <FaIcon name="pause" size={14} color={color} />
                ) : (
                  <FaIcon name="play" size={14} color={color} />
                )
              }
              onPress={() => handleToggle()}
            />
          </View>
          <View style={styles.backgroundPlayingButtonWrapper}>
            <IconButton icon={listIcon} onPress={openQueueList} />
          </View>
        </View>
        <TrackProgress
          hidden
          duration={duration}
          style={{
            borderRadius: 0,
            height: 3,
          }}
          containerStyle={{
            borderRadius: 0,
            height: 3,
          }}
          clearProgress={clearTrackProgress}
        />
      </Animated.View>
      {/*====================================================================*/}
      <Animated.View style={[styles.footer, animatedFooter]}>
        <View
          style={[styles.shuffleBtnWrapper, styles.centered, styles.hidden]}>
          <IconButton icon={shuffleIcon} onPress={() => {}} />
        </View>
        <View style={[styles.prevBtnWrapper, styles.centered, styles.hidden]}>
          <IconButton icon={prevIcon} onPress={handlePrev} />
        </View>
        {playing ? (
          <View style={[styles.playBtnWrapper, styles.centered, styles.hidden]}>
            <IconButton icon={pauseIcon} onPress={handleToggle} />
          </View>
        ) : (
          <View style={[styles.playBtnWrapper, styles.centered, styles.hidden]}>
            <IconButton icon={playIcon} onPress={handleToggle} />
          </View>
        )}
        <View style={[styles.nextBtnWrapper, styles.centered, styles.hidden]}>
          <IconButton icon={nextIcon} onPress={handleNext} />
        </View>
        <View style={[styles.listBtnWrapper, styles.centered, styles.hidden]}>
          <IconButton icon={listIcon} onPress={openQueueList} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  body: {
    flex: 1,
    overflow: 'hidden',
    padding: 10,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: '5%',
  },
  toggleModalButton: {
    padding: 10,
    margin: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    maxWidth: '90%',
    minWidth: '90%',
    textAlign: 'center',
    lineHeight: 30,
  },
  optionsButton: {
    height: 50,
    width: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 80,
  },
  footer: {
    height: height * 0.09, //9 percent of the screen
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#302832',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleBtnWrapper: {
    padding: 10,
    flex: 1,
    backgroundColor: '#302832',
    borderTopLeftRadius: 30,
  },
  prevBtnWrapper: {
    padding: 10,
    flex: 1,
    backgroundColor: '#302832',
  },
  hidden: {
    overflow: 'hidden',
  },
  playBtnWrapper: {
    position: 'relative',
    padding: 10,
    height: 80,
    maxWidth: 80,
    minWidth: 80,
    flex: 1,
    backgroundColor: '#302832',
    transform: [{translateY: -10}],
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  nextBtnWrapper: {
    padding: 10,
    flex: 1,
    backgroundColor: '#302832',
  },
  listBtnWrapper: {
    padding: 10,
    flex: 1,
    backgroundColor: '#302832',
    borderTopRightRadius: 30,
  },
  playerImg_wrapper: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 20,
  },
  playerImg: {
    height: 250,
    width: 250,
    borderRadius: 30,
    // borderWidth: 1,
    // borderColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 30,
  },
  additionalOptions: {
    flexDirection: 'row',
    minWidth: '100%',
    maxWidth: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressWrapper: {
    width: '100%',
    marginTop: 10,
  },
  backgroundPlayingWrapper: {
    height: height * 0.1,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // padding: 10,
  },
  backgroundPlayingPressableWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
  },
  backgroundPlayingPressableTitle: {
    flex: 1,
  },
  backgroundPlayingButtonWrapper: {
    height: height * 0.05,
    width: height * 0.05,
    marginRight: 10,
    marginTop: 10,
  },
  backgroundPlaying_img_wrapper: {
    height: 40,
    width: 40,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 10,
  },
  backgroundPlaying_img: {
    height: '100%',
    width: '100%',
  },
  backgroundPlaying_text: {
    fontSize: 16,
  },
});
