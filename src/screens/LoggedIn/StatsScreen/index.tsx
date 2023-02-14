// utils
import React from 'react';

// componetns
import {View, ScrollView} from 'react-native';
import Footer from 'components/Footer';
import NixDietGraph from 'components/NixDietGraph';
import {WeightGraph} from 'components/WeightGraph';

// hooks
import {useSelector} from 'hooks/useRedux';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './StatsScreen.styles';
import {RouteProp} from '@react-navigation/native';

interface StatsScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Stats>;
  route: RouteProp<StackNavigatorParamList, Routes.Stats>;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  navigation,
  route,
}) => {
  const daily_kcal = useSelector(state => state.auth.userData.daily_kcal);
  const selectedDate = route.params.selectedDate;

  return (
    <>
      <ScrollView style={styles.layout}>
        <View style={styles.flex1}>
          <NixDietGraph
            title="Food Logging Calendar"
            target={daily_kcal || 0}
            initialDisplayDate={selectedDate}
            navigation={navigation}
          />

          <WeightGraph />
        </View>
      </ScrollView>
      <Footer hide={false} navigation={navigation} />
    </>
  );
};
