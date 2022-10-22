import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import NavbarAction from '../Components/Navbar/NavbarAction';
import NavbarNavigation from '../Components/Navbar/NavbarNavigation';
import {MainProps} from '../lib/Types/types';

export default function SongPlaylist(props: MainProps) {
  return (
    <View style={styles.container}>
      <NavbarAction />
      <NavbarNavigation {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
