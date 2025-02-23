import {StackNavigationProp} from '@react-navigation/stack';

export type RouteParams = {
  home: undefined;
  history: undefined;
  'add-timer': undefined;
};

export type NavigationProps = StackNavigationProp<RouteParams>;
