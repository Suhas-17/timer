import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {StackHeaderProps} from '@react-navigation/stack';
import {SCREEN_HEADERS} from '../../constants/screenHeaders';

const Header = (props: StackHeaderProps) => {
  const canGoBack = !!props.back?.href;
  return (
    <View style={styles.container}>
      {canGoBack && (
        <TouchableOpacity
          style={styles.leftIcon}
          onPress={props.navigation.goBack}>
          <Text>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>
        {SCREEN_HEADERS[props.route.name as keyof typeof SCREEN_HEADERS]}
      </Text>
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
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
