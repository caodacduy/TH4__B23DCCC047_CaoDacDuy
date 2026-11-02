import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';
import { ROUTES } from './routes';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AssignmentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name={ROUTES.ASSIGNMENT_LIST} component={AssignmentListScreen} options={{ title: 'Bài tập' }} />
      <Stack.Screen name={ROUTES.ASSIGNMENT_DETAIL} component={AssignmentDetailScreen} options={{ title: 'Chi tiết bài tập' }} />
      <Stack.Screen name={ROUTES.ASSIGNMENT_FORM} component={AssignmentFormScreen} options={{ title: 'Thêm bài tập' }} />
    </Stack.Navigator>
  );
}

