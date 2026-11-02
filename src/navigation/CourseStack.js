import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import { ROUTES } from './routes';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function CourseStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name={ROUTES.COURSE_LIST} component={CourseListScreen} options={{ title: 'Môn học' }} />
      <Stack.Screen name={ROUTES.COURSE_DETAIL} component={CourseDetailScreen} options={{ title: 'Chi tiết môn học' }} />
      <Stack.Screen name={ROUTES.SESSION_DETAIL} component={SessionDetailScreen} options={{ title: 'Chi tiết buổi học' }} />
      <Stack.Screen name={ROUTES.ASSIGNMENT_DETAIL} component={AssignmentDetailScreen} options={{ title: 'Chi tiết bài tập' }} />
    </Stack.Navigator>
  );
}

