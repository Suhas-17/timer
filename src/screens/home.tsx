import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Dimensions,
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

const updateHistory = async (item: Timer) => {
  const history = await AsyncStorage.getItem('history');
  const timers: Timer[] = history ? JSON.parse(history) : [];
  await AsyncStorage.setItem('history', JSON.stringify([...timers, item]));
};

export const RenderTimer = ({
  item,
  updateTimers,
}: {
  item: Timer;
  updateTimers: React.Dispatch<React.SetStateAction<Timer[]>>;
}) => {
  const screenWidth = Dimensions.get('window').width;
  const actualRemainingTime = item.paused
    ? item.remainingDuration
    : new Date(item.startTime).getTime() -
      new Date().getTime() +
      item.remainingDuration;

  const [time, setTime] = useState(
    actualRemainingTime > 0 ? actualRemainingTime : 0,
  );
  const [pause, setPause] = useState(item.paused);

  useEffect(() => {
    if (!pause && actualRemainingTime > 0) {
      const intId = setInterval(() => {
        setTime(prev => {
          if (prev <= 0) {
            clearInterval(intId);
            updateHistory(item);
            Alert.alert(`${item.name} completed successfully`);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(intId);
    }
  }, [pause]);
  let status = 'Completed';
  if (pause && time > 0) {
    status = 'Paused';
  } else if (time > 0) {
    status = 'Running';
  }

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
            {
              width: (screenWidth * (item.duration - time)) / item.duration,
            },
          ]}
        />
      )}
      <View style={styles.timerDetails}>
        <Text style={styles.timerName}>{item.name}</Text>
        <Text style={styles.timerText}>{Math.ceil(time / 1000)}s</Text>
        <Text style={styles.timerText}>{status}</Text>
      </View>
      <View style={styles.timerActions}>
        {time > 0 && (
          <Text style={styles.timerText} onPress={resumeTimer}>
            {pause ? 'Play' : 'Pause'}
          </Text>
        )}
        {(pause || time <= 0) && time !== item.duration && (
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
  const [action, setAction] = useState(0);
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

  const updateAll = async (type: 'run' | 'pause' | 'reset') => {
    try {
      const newTimers = timers?.map(timer => {
        if (type === 'run') {
          if (!timer.paused) return timer;
          return {
            ...timer,
            paused: false,
            startTime: new Date(),
          };
        } else if (type === 'pause') {
          if (timer.paused) return timer;
          return {
            ...timer,
            paused: true,
            remainingDuration: Math.max(
              new Date(timer.startTime).getTime() -
                new Date().getTime() +
                timer.remainingDuration,
              0,
            ),
          };
        }
        return {
          ...timer,
          paused: true,
          startTime: new Date(),
          remainingDuration: timer.duration,
        };
      });
      setTimers(newTimers);
      setAction(prev => prev + 1);
      await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
    } catch (error) {
      console.error('Failed to save timer:', error);
    }
  };

  if (timers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-o" size={48} color="#007BFF" />
          <Text style={styles.emptyText}>No timers found</Text>
        </View>
        <View style={styles.btn}>
          <ButtonElement
            title="Add Timer"
            onPress={() => navigation.navigate('add-timer')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {timers.length && (
        <View style={[styles.timerActions, styles.actions]}>
          <ButtonElement title="Run All" onPress={() => updateAll('run')} />
          <ButtonElement title="Pause All" onPress={() => updateAll('pause')} />
          <ButtonElement title="Reset All" onPress={() => updateAll('reset')} />
        </View>
      )}
      <SectionList
        key={action}
        sections={groupedTimers}
        renderItem={({item, section}) =>
          hidden[section.title] ? null : (
            <RenderTimer item={item} updateTimers={setTimers} />
          )
        }
        renderSectionHeader={({section}) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => hideSection(section.title)}
            style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {CATEGORIES[section.title] || section.title}
            </Text>
            <Icon
              name={hidden[section.title] ? 'chevron-down' : 'chevron-up'}
              size={16}
              color="#333"
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  actions: {padding: 16, flexWrap: 'wrap'},
  progress: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
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
    paddingVertical: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  btn: {padding: 16},
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
