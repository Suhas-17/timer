import {Button, SectionList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../models/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Timer} from '../models/timer';
import {CATEGORIES} from '../constants/constants';

const Divider = () => <View style={styles.divider} />;

const Home = () => {
  const navigation = useNavigation<NavigationProps>();
  const [timers, setTimers] = useState<Timer[]>([]);
  const [hidden, setHidden] = useState<
    Partial<Record<keyof typeof CATEGORIES, boolean>>
  >({});

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
      title: key as keyof typeof CATEGORIES,
      data: value,
    }));
  }, [timers]);

  const hideSection = (category: keyof typeof CATEGORIES) => {
    setHidden(prev => ({...prev, [category]: !prev[category]}));
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedTimers}
        renderItem={({item, section}) =>
          hidden[section.title] ? null : (
            <View style={styles.timerContainer}>
              <Text style={styles.timerName}>{item.name}</Text>
              <Text style={styles.timerDetail}>{item.duration}</Text>
            </View>
          )
        }
        ItemSeparatorComponent={Divider}
        renderSectionHeader={({section}) => (
          <Text
            onPress={() => hideSection(section.title)}
            style={styles.sectionTitle}>
            {section.title}
          </Text>
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
  timerContainer: {
    marginLeft: 16,
    padding: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  timerDetail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  divider: {height: 1, backgroundColor: '#ccc'},
});
