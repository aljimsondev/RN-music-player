import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Divider from '../Components/Divider';
import {MainProps} from '../lib/Types/types';

const {height} = Dimensions.get('screen');

export default function SongModalOption(props: MainProps) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#128A42'} />
      <ScrollView style={styles.body}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.button_text}>Add to Playlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.button_text}>Add to Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.button_text}>Delete Song</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.goBack()}>
          <Text style={styles.button_text}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 99,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  body: {
    paddingBottom: height * 0.1,
    backgroundColor: '#F5F3F3',
    padding: 10,
    height: height * 0.5,
    maxHeight: height * 0.5,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  button_text: {
    fontSize: 17,
  },
});
