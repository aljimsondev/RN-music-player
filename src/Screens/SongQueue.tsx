import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import SongList from '../Components/Card/SongList';
import ModalHeader from '../Components/Navbar/ModalHeader';
import {Context} from '../lib/Store';

interface QueuePropsTypes {
  queueHandler: {
    open: () => void;
    close: () => void;
  };
  animatedHeader: {
    opacity: number;
  };
}

export default function Queue(props: QueuePropsTypes) {
  const {queue} = React.useContext(Context);
  const {queueHandler, animatedHeader} = props;

  const renderQueue = () => {
    return queue.map((q, index) => {
      return <SongList hideOption key={index} song={q} />;
    });
  };
  return (
    <View style={styles.container}>
      <ModalHeader
        queueHandler={queueHandler}
        animatedHeader={animatedHeader}
      />
      <View style={styles.body}>
        <ScrollView style={{flex: 1}}>{renderQueue()}</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D353F',
    zIndex: 20,
    overflow: 'hidden',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  body: {
    flex: 1,
    overflow: 'hidden',
  },
});
