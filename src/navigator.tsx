import {createStackNavigator} from '@react-navigation/stack';
import AddTimer from './screens/addTimer';
import Home from './screens/home';
import {RouteParams} from './models/routes';
import Header from './components/ui/header';

const Stack = createStackNavigator<RouteParams>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header,
      }}
      initialRouteName="home">
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="add-timer" component={AddTimer} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
