import {RouteParams} from '../models/routes';

export const SCREEN_HEADERS: Record<keyof RouteParams, string> = {
  home: 'Timers',
  history: 'History',
  'add-timer': 'Create Timer',
};

export const CATEGORIES = {
  WORK: 'Work',
  BREAK: 'Break',
  EXERCISE: 'Exercise',
  STUDY: 'Study',
  MEDITATE: 'Meditate',
  OTHERS: 'Others',
};
