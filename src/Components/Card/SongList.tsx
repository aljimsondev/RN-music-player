import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MainProps, PlaylistTypes} from '../../lib/Types/types';
import IconButton from '../IconButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import PlayingIndicator from '../Progress/PlayingIndicator';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
} from 'react-native-track-player';

interface SongListProp extends MainProps {
  song: PlaylistTypes;
  hideOption?: boolean;
}

export default function SongList(props: SongListProp) {
  const {song, hideOption = false} = props;
  const [playing, setPlaying] = React.useState(false);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      //found next audio in track
      const track = await TrackPlayer.getTrack(event.nextTrack);

      const {title, artist} = track || {title: '', artist: ''};
      if (title === song.title) {
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
  });
  useTrackPlayerEvents([Event.PlaybackState], async event => {
    const stateOnPlay = ['Playing', 'Buffering'];
    const track = await TrackPlayer.getCurrentTrack();
    const currentQueue = await TrackPlayer.getQueue();
    if (stateOnPlay.some(x => x === State[event.state])) {
      const currentTrack = currentQueue[track] || {title: '', artist: ''};
      if (currentTrack.title === song.title) {
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
  });

  const handlePlayBySelect = async () => {
    const queue = await TrackPlayer.getQueue();
    const myIndex = queue.findIndex(d => d.title === song.title);

    TrackPlayer.skip(myIndex);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{flex: 1}} onPress={() => handlePlayBySelect()}>
        <Text numberOfLines={1} style={styles.title}>
          {song.title}
        </Text>
        <Text style={styles.sub}>{song.artist}</Text>
      </TouchableOpacity>
      {playing && (
        <View style={styles.playing_indicator_wrapper}>
          <PlayingIndicator />
        </View>
      )}
      {!hideOption && (
        <TouchableOpacity
          style={styles.option}
          onPress={() => Alert.alert(JSON.stringify(song.id))}>
          <IconButton
            icon={
              <View>
                <Icon name="circle-o" size={7} color="#0fc035" />
                <Icon name="circle-o" size={7} color="#0fc035" />
              </View>
            }
            onPress={() => {
              props.navigation.navigate('SongModalOption');
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    // backgroundColor: '#302832',
    alignItems: 'center',
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 17,
    color: '#C2B7B7',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  sub: {
    color: '#C2B7B7',
  },
  option: {
    height: 40,
    width: 40,
    // backgroundColor: 'rgba(255,255,255,0.01)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginLeft: 10,
  },
  playing_indicator_wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
