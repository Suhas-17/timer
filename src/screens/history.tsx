import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Timer} from '../models/timer';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonElement from '../components/ui/buttonElement';

const History = () => {
  const [timers, setTimers] = useState<Timer[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const getTimers = async () => {
        const storedTimers = await AsyncStorage.getItem('history');
        setTimers(storedTimers ? JSON.parse(storedTimers) : []);
      };

      getTimers();
    }, []),
  );

  if (timers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-o" size={48} color="#007BFF" />
          <Text style={styles.emptyText}>No timers found</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={timers}
        renderItem={({item}) => (
          <View style={styles.timerContainer}>
            <View style={styles.timerDetails}>
              <Text style={styles.timerName}>{item.name}</Text>
              <Text style={styles.timerText}>
                {Math.ceil(item.duration / 1000)}s
              </Text>
            </View>
            <Text style={styles.timerText}>Completed</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  timerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  timerDetails: {
    flex: 1,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
  },
});
