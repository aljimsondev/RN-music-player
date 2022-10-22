import {ReadDirItem} from 'react-native-fs';

export interface MainProps {
  route: {
    key: string;
    name: string;
    params?: {};
  };
  navigation: {
    addListener: (
      type: 'blur' | 'focus' | 'beforeRemove' | 'state',
      callback: () => void,
    ) => void;
    canGoBack: () => boolean;
    goBack: () => void;
    isFocused: () => boolean;
    navigate: (routeName: string, params?: {}) => void;
    pop: () => void;
    popToTop: () => void;
    push: () => void;
    removeListener: (
      type: 'blur' | 'focus' | 'beforeRemove' | 'state',
      callback: () => void,
    ) => void;
    replace: () => void;
    reset: (state: any) => void;
    setOptions: (options: {}) => void;
    setParams: (params: never) => void;
  };
}
export interface ContextStoreProps {
  children: JSX.Element;
}

export interface PlaylistTypes {
  id: number;
  url: any;
  title: string;
  artist: string;
  artwork: string;
  size?: string;
}

export interface ContextProps {
  playlist: PlaylistTypes[];
  favorites: never[];
  isLoaded: boolean;
  setPlaylist: React.Dispatch<React.SetStateAction<PlaylistTypes[]>>;
  setFavorites: React.Dispatch<React.SetStateAction<never[]>>;
  setLoadedStatus: React.Dispatch<React.SetStateAction<boolean>>;
  files: ReadDirItem[];
  setFiles: React.Dispatch<React.SetStateAction<ReadDirItem[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  queue: PlaylistTypes[];
  setQueue: React.Dispatch<React.SetStateAction<PlaylistTypes[]>>;
}

export interface MainScreenProps {}
