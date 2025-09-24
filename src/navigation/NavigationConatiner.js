import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddEditTask from '../screens/AddEditTask';
import TaskList from '../screens/TaskList';
import navigationConstants from './RouteConstants';

const Stack = createNativeStackNavigator();

const NavigationContainerComponent = () => {
  return (
      <Stack.Navigator initialRouteName={navigationConstants.TASK_LIST}>
        <Stack.Screen name={navigationConstants.TASK_LIST} component={TaskList} options={{ title: 'Task List' }} />
        <Stack.Screen name={navigationConstants.ADD_EDIT_TASK} component={AddEditTask} options={{ title: 'Add/Edit Task' }} />
      </Stack.Navigator>
  );
};

export default NavigationContainerComponent;