import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import { ROUTES } from './routes';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name={ROUTES.SCHEDULE} component={ScheduleScreen} options={{ title: 'Thời khóa biểu' }} />
      <Stack.Screen name={ROUTES.SESSION_DETAIL} component={SessionDetailScreen} options={{ title: 'Chi tiết buổi học' }} />
    </Stack.Navigator>
  );
}

