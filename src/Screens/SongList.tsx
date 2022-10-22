import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import NavbarAction from '../Components/Navbar/NavbarAction';
import NavbarNavigation from '../Components/Navbar/NavbarNavigation';
import {Context} from '../lib/Store';
import {MainProps} from '../lib/Types/types';
import {ScrollView} from 'react-native-gesture-handler';
import SongListCard from '../Components/Card/SongList';
import {useTheme} from '@react-navigation/native';

const {height} = Dimensions.get('screen');

export default function SongList(props: MainProps) {
  const {queue} = React.useContext(Context);

  React.useEffect(() => {
    // console.log(props);
    console.log(queue);
  }, []);

  const renderQueue = () => {
    return queue.map((q, index) => {
      return <SongListCard {...props} key={index} song={q} />;
    });
  };
  return (
    <View style={[styles.container]}>
      <NavbarAction />
      <NavbarNavigation {...props} />
      <ScrollView style={{flex: 1, marginBottom: height * 0.11}}>
        {renderQueue()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
