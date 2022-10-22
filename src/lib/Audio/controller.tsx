import TrackPlayer, {State, Track} from 'react-native-track-player';
import Storage from '../Addons/Storage';

interface AudioPlayer {
  capability: {
    capabilityPlay?: boolean;
    capabilityPlayFromId?: boolean;
    capabilityPlayFromSearch?: boolean;
    capabilityPause?: boolean;
    capabilityStop?: boolean;
    capabilitySeekTo?: boolean;
    capabilitySkip?: boolean;
    capabilitySkipToNext?: boolean;
    capabilitySkipToPrevious?: boolean;
    capabilitySetRating?: boolean;
    capabilityJumpForward?: boolean;
    capabilityJumpBackward?: boolean;
  };
  state: {
    stateNone?: boolean;
    StateReady?: boolean;
    StatePlaying?: boolean;
    StatePaused?: boolean;
    StateStopped?: boolean;
    StateBuffering?: boolean;
    StateConnecting?: boolean;
  };
  repeatMode: {
    repeatModeOff?: boolean;
    repeatModeTrack?: boolean;
    repeatModeQueue?: boolean;
  };
  options?: {
    /**
     * Minimun buffer
     */
    minBuffer?: number;
    maxBuffer?: number;
    playBuffer?: number;
    backBuffer?: number;
    maxCacheSize?: number;
    waitForBuffer?: boolean;
    autoUpdateMetadata?: boolean;
  };
}

class AudioPlayer extends Storage {
  constructor(options: AudioPlayer['options'] = {}) {
    super();
    this.options = options;
  }
  /**
   *
   * @param tracks - Array or single track
   * @param insertBeforeIndex - The index of the track that will be located immediately after the inserted tracks. Set it to null to add it at the end of the queue
   */
  async add(tracks: Track | Track[], insertBeforeIndex?: number) {
    await TrackPlayer.add(tracks, insertBeforeIndex);
  }
  /**
   * Return the last played tracked or an empty object if no data found
   */
  async getLastPlayedTrack() {
    //get track that was last played
    await this.getKey('last-played-track').then(data => {
      return {
        data: JSON.parse(data ? data : '{}'),
      };
    });
  }
  /**
   *
   * @param state - an identifier state if the queue was loadeded
   * @returns Status if the queue was ready
   */
  async getQueue(state: boolean = false) {
    //get the queued songs and return it
    if (!state) {
      return false;
    }
    return true;
  }
  async ready() {
    let status = false;
  }
  async play() {
    await TrackPlayer.play();
  }
  async pause() {
    await TrackPlayer.pause();
  }
  async isPlaying() {
    const status = await TrackPlayer.getState();
    if (status === 3) {
      return true;
    }
    return false;
  }
  async checkFile(key: string) {
    return await this.getKey(key);
  }
  async saveFile(key: string, value: string) {
    return await this.setKey(key, value);
  }
  async next() {
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      console.log(e);
    }
  }
  async prev() {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (e) {
      console.log(e);
    }
  }
  async isPaused() {
    const status = await TrackPlayer.getState();
    if (status === 2) {
      return true;
    }
    return false;
  }
}

export const defaultOptions = {
  //default configutarions
  waitForBuffer: false,
  autoUpdateMetadata: false,
  minBuffer: 15,
  maxBuffer: 50,
  playBuffer: 2.5,
  backBuffer: 0,
  maxCacheSize: 0,
};
export default AudioPlayer;
