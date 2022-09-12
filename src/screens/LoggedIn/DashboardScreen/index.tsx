import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'hooks/useRedux';

export const DashboardScreen: React.FC = () => {
  const userData = useSelector(state => state.auth.userData);
  console.log(userData);
  return (
    <View>
      <Text>Dashboard Screen</Text>
    </View>
  );
};
