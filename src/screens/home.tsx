import {Button, SectionList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../models/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Timer} from '../models/timer';

const Home = () => {
  const navigation = useNavigation<NavigationProps>();
  const [timers, setTimers] = React.useState<Timer[]>([]);

  useEffect(() => {
    const getTimers = async () => {
      const storedTimers = await AsyncStorage.getItem('timers');
      setTimers(storedTimers ? JSON.parse(storedTimers) : []);
    };

    getTimers();
  }, []);

  const groupedTimers = useMemo(() => {
    const obj = timers.reduce((acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }

      acc[timer.category].push(timer);
      return acc;
    }, {} as Record<string, Timer[]>);

    return Object.entries(obj).map(([key, value]) => ({
      title: key,
      data: value,
    }));
  }, [timers]);

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedTimers}
        renderItem={({item}) => (
          <Text style={styles.timerName}>{item.name}</Text>
        )}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        keyExtractor={item => item.id}
      />
      <Button
        title="Add Timer"
        onPress={() => navigation.navigate('add-timer')}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    padding: 8,
  },
  timerName: {
    fontSize: 18,
    padding: 8,
  },
});
