// utils
import React, {useEffect} from 'react';
import moment from 'moment-timezone';

// componetns
import {View, ScrollView} from 'react-native';
import Footer from 'components/Footer';
import NixDietGraph from 'components/NixDietGraph';
import {WeightGraph} from 'components/WeightGraph';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './StatsScreen.styles';
import {getDayTotals} from 'store/stats/stats.actions';

interface StatsScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Stats>;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);
  const {selectedDate} = useSelector(state => state.userLog);

  useEffect(() => {
    return () => {
      dispatch(
        getDayTotals(
          moment(selectedDate).startOf('month').format('YYYY-MM-DD'),
          moment(selectedDate).endOf('month').format('YYYY-MM-DD'),
        ),
      );
    };
  }, [selectedDate, dispatch]);

  return (
    <>
      <ScrollView style={styles.layout}>
        <View style={styles.flex1}>
          <NixDietGraph
            title="Food Logging Calendar"
            target={userData.daily_kcal || 0}
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
