import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

interface IconButtonProps {
  icon: Element;
  onPress: () => void;
}

export default function IconButton(props: IconButtonProps) {
  const {icon, onPress} = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: '100%',
    minWidth: '100%',
    borderStartColor: 'red',
    flexGrow: 1,
    borderRadius: 50,
  },
});
