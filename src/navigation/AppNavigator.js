import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { ROUTES } from './routes';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { unfinishedAssignmentsCount } = useAppData();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name={ROUTES.TAB_HOME}
        component={HomeStack}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
          tabBarAccessibilityLabel: 'Tab Tổng quan',
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_COURSES}
        component={CourseStack}
        options={{
          tabBarLabel: 'Môn học',
          tabBarIcon: ({ color, size }) => <Feather name="book-open" color={color} size={size} />,
          tabBarAccessibilityLabel: 'Tab Môn học',
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_SCHEDULE}
        component={ScheduleStack}
        options={{
          tabBarLabel: 'Thời khóa biểu',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} />,
          tabBarAccessibilityLabel: 'Tab Thời khóa biểu',
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_ASSIGNMENTS}
        component={AssignmentStack}
        options={{
          tabBarLabel: 'Bài tập',
          tabBarIcon: ({ color, size }) => <Feather name="edit-3" color={color} size={size} />,
          tabBarBadge: unfinishedAssignmentsCount > 0 ? unfinishedAssignmentsCount : undefined,
          tabBarAccessibilityLabel: 'Tab Bài tập',
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_PROFILE}
        component={ProfileStack}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
          tabBarAccessibilityLabel: 'Tab Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}

