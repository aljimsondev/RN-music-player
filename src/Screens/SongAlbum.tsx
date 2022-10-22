import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavbarAction from '../Components/Navbar/NavbarAction';
import NavbarNavigation from '../Components/Navbar/NavbarNavigation';
import {MainProps} from '../lib/Types/types';

export default function SongAlbum(props: MainProps) {
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
    backgroundColor: 'red',
  },
});
