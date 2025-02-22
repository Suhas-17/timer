import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import ButtonElement from '../components/ui/buttonElement';
import FormElements from '../components/ui/formElements';
import {Timer} from '../models/timer';
import {CATEGORIES} from '../constants/constants';

const TimerScreen = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    duration: '',
    category: '',
  });

  const handleChange = (key: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({...prev, [key]: value}));
  };

  const saveTimer = async () => {
    const {name, duration, category} = formValues;

    if (!name || !duration || !category) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const newTimer: Timer = {
      id: Date.now().toPrecision(),
      name,
      duration: Number(duration),
      category,
      remainingDuration: Number(duration),
      startTime: null,
    };

    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const timers: Timer[] = storedTimers ? JSON.parse(storedTimers) : [];
      await AsyncStorage.setItem(
        'timers',
        JSON.stringify([...timers, newTimer]),
      );

      setFormValues({name: '', duration: '', category: ''});
      Alert.alert('Success', 'Timer saved!');
    } catch (error) {
      console.error('Failed to save timer:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FormElements.Text
        label="Timer name"
        placeholder="Enter timer name"
        value={formValues.name}
        onChangeText={text => handleChange('name', text)}
      />
      <FormElements.Text
        label="Duration (seconds)"
        placeholder="Enter duration in seconds"
        value={formValues.duration}
        keyboardType="number-pad"
        onChangeText={text => handleChange('duration', text)}
      />
      <FormElements.ChipGroup
        label="Category"
        selected={formValues.category}
        options={Object.entries(CATEGORIES).map(([key, value]) => ({
          label: value,
          value: key,
        }))}
        onChange={text => handleChange('category', text)}
      />

      <ButtonElement title="Save Timer" onPress={saveTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, gap: 16},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default TimerScreen;
