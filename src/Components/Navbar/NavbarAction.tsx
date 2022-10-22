import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';

export default function NavbarAction(props: any) {
  const {colors} = useTheme();
  return (
    <View
      style={[styles.navbarContainer, {backgroundColor: colors.notification}]}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(
          'rgba(0,0,0,0.2)',
          true,
          30,
        )}>
        <View style={styles.button}>
          <FIcon name="search" size={24} />
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(
          'rgba(0,0,0,0.2)',
          true,
          30,
        )}>
        <View style={styles.button}>
          <FIcon name="cogs" size={24} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    maxHeight: '8%',
    minHeight: '8%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
