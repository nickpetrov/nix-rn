// utils
import React, {useEffect} from 'react';

// componetns
import {View, ScrollView} from 'react-native';
import Footer from 'components/Footer';
import NixDietGraph from 'components/NixDietGraph';
import {WeightGraph} from 'components/WeightGraph';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {clearStats} from 'store/stats/stats.actions';

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
  const dispatch = useDispatch();
  const daily_kcal = useSelector(state => state.auth.userData.daily_kcal);
  const selectedDate = route.params.selectedDate;

  useEffect(() => {
    return () => {
      dispatch(clearStats());
    };
  }, [dispatch]);

  return (
    <>
      <ScrollView style={styles.layout} overScrollMode="never">
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
