import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {StackHeaderProps} from '@react-navigation/stack';
import {SCREEN_HEADERS} from '../../constants/constants';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';

const Header = (props: StackHeaderProps) => {
  const canGoBack = !!props.back?.href;
  return (
    <View style={styles.container}>
      {canGoBack && (
        <TouchableOpacity
          style={styles.leftIcon}
          onPress={props.navigation.goBack}>
          <Icon name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>
        {SCREEN_HEADERS[props.route.name as keyof typeof SCREEN_HEADERS]}
      </Text>
      {props.route.name === 'home' && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => props.navigation.navigate('history')}>
          <FIcon name="history" size={24} color="#444" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    width: 24,
    height: 24,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
    width: 24,
    height: 24,
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
