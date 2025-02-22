import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonElement from '../components/ui/buttonElement';
import {CATEGORIES} from '../constants/constants';
import {NavigationProps} from '../models/routes';
import {Timer} from '../models/timer';

const Divider = () => <View style={styles.divider} />;

const RenderTimer = ({
  item,
  updateTimers,
}: {
  item: Timer;
  updateTimers: React.Dispatch<React.SetStateAction<Timer[]>>;
}) => {
  const screenWidth = Dimensions.get('window').width;
  const actualRemainingTime = item.paused
    ? item.remainingDuration
    : new Date(item.startTime).getSeconds() +
      item.remainingDuration -
      new Date().getSeconds();
  const [time, setTime] = useState(
    actualRemainingTime > 0 ? actualRemainingTime : 0,
  );
  const [pause, setPause] = useState(item.paused);

  useEffect(() => {
    if (!pause) {
      const intId = setInterval(() => {
        setTime(prev => {
          if (prev <= 0) {
            clearInterval(intId);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);

      return () => clearInterval(intId);
    }
  }, [pause]);
  // let status ="";
  // if (!item.paused && new Date()) status =
  // if(item.remainingDuration !== item.duration)

  const resumeTimer = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const timers: Timer[] = storedTimers ? JSON.parse(storedTimers) : [];

      const index = timers.findIndex(timer => timer.id === item.id);

      timers[index] = {
        ...item,
        paused: !item.paused,
        startTime: new Date(),
        remainingDuration: time,
      };
      setPause(!pause);
      updateTimers(timers);

      await AsyncStorage.setItem('timers', JSON.stringify(timers));
    } catch (error) {
      console.error('Failed to save timer:', error);
    }
  };

  const reset = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const timers: Timer[] = storedTimers ? JSON.parse(storedTimers) : [];

      const index = timers.findIndex(timer => timer.id === item.id);

      timers[index] = {
        ...item,
        paused: true,
        startTime: new Date(),
        remainingDuration: item.duration,
      };
      updateTimers(timers);
      setPause(true);
      setTime(item.duration);
      await AsyncStorage.setItem('timers', JSON.stringify(timers));
    } catch (error) {
      console.error('Failed to save timer:', error);
    }
  };

  return (
    <View style={styles.timerContainer}>
      {time !== item.duration && (
        <View
          style={[
            styles.progress,
            {width: (screenWidth * time) / item.duration},
          ]}
        />
      )}
      <View style={styles.timerDetails}>
        <Text style={styles.timerName}>{item.name}</Text>
        <Text style={styles.timerText}>{item.duration}s</Text>
        <Text style={styles.timerText}>{item.paused}</Text>
      </View>
      <View style={styles.timerActions}>
        {time > 0 && (
          <Text style={styles.timerText} onPress={resumeTimer}>
            {pause ? 'Play' : 'Pause'}
          </Text>
        )}
        {(pause || time <= 0) && (
          <Text style={styles.timerText} onPress={reset}>
            Reset
          </Text>
        )}
      </View>
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation<NavigationProps>();
  const [timers, setTimers] = useState<Timer[]>([]);
  const [hidden, setHidden] = useState<
    Partial<Record<keyof typeof CATEGORIES, boolean>>
  >({});

  useFocusEffect(
    React.useCallback(() => {
      const getTimers = async () => {
        const storedTimers = await AsyncStorage.getItem('timers');
        setTimers(storedTimers ? JSON.parse(storedTimers) : []);
      };

      getTimers();
    }, []),
  );

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
            <RenderTimer item={item} updateTimers={setTimers} />
          )
        }
        ItemSeparatorComponent={Divider}
        SectionSeparatorComponent={Divider}
        renderSectionHeader={({section}) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => hideSection(section.title)}
            style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Icon
              name={hidden[section.title] ? 'chevron-down' : 'chevron-up'}
              size={16}
              color="#333"
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <ScrollView>
        <Text>{JSON.stringify(timers[2])}</Text>
      </ScrollView>
      <View style={styles.btn}>
        <ButtonElement
          title="Add Timer"
          onPress={() => navigation.navigate('add-timer')}
        />
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  timerDetails: {
    flex: 1,
  },
  timerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progress: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#007BFF',
    opacity: 0.2,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  divider: {height: 1, backgroundColor: '#ccc'},
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
  },
  btn: {padding: 16},
});
