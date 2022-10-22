import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import {MainProps} from '../../lib/Types/types';

interface NavbarNavigationProps extends MainProps {}

export default function NavbarNavigation(props: NavbarNavigationProps) {
  const {colors} = useTheme();
  const {navigation, route} = props;
  const Links = [
    {name: 'Songs', route: 'SongList'},
    {name: 'Artists', route: 'SongArtist'},
    {name: 'Albums', route: 'SongAlbum'},
    {name: 'Playlists', route: 'SongPlaylist'},
  ];

  return (
    <View style={[styles.container, {backgroundColor: colors.notification}]}>
      {Links.map((link, index) => {
        return (
          <TouchableNativeFeedback
            key={link.route + index}
            onPress={() => navigation.navigate(link.route)}
            background={TouchableNativeFeedback.Ripple(
              'rgba(0,0,0,0.2)',
              true,
              50,
            )}>
            <View style={styles.button}>
              <Text
                style={[
                  styles.text,
                  route.name === link.route ? styles.active : {},
                ]}>
                {link.name}
              </Text>
            </View>
          </TouchableNativeFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: '8%',
    minHeight: '8%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 100,
    borderRadius: 100,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  text: {
    padding: 5,
    fontWeight: 'bold',
  },
  active: {
    //active state
    borderBottomWidth: 2,
    borderBottomColor: '#302832',
  },
});
