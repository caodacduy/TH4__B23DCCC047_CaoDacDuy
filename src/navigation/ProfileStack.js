import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import GradeListScreen from '../screens/profile/GradeListScreen';
import GradeDetailScreen from '../screens/profile/GradeDetailScreen';
import { ROUTES } from './routes';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} options={{ title: 'Cá nhân' }} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} options={{ title: 'Chỉnh sửa thông tin' }} />
      <Stack.Screen name={ROUTES.GRADE_LIST} component={GradeListScreen} options={{ title: 'Kết quả học tập' }} />
      <Stack.Screen name={ROUTES.GRADE_DETAIL} component={GradeDetailScreen} options={{ title: 'Chi tiết kết quả' }} />
    </Stack.Navigator>
  );
}

