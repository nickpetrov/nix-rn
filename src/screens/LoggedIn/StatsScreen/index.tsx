// utils
import React from 'react';

// componetns
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import Footer from 'components/Footer';
import NixDietGraph from 'components/NixDietGraph';
import {WeightGraph} from 'components/WeightGraph';

// hooks
import {useSelector} from 'hooks/useRedux';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// styles
import {styles} from './StatsScreen.styles';

interface StatsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({navigation}) => {
  const {userData} = useSelector(state => state.auth);
  const {selectedDate} = useSelector(state => state.userLog);

  return (
    <TouchableWithoutFeedback
      style={styles.layout}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <>
        <ScrollView style={styles.layout}>
          <View style={{flex: 1}}>
            <NixDietGraph
              title="Food Logging Calendar"
              target={userData.daily_kcal}
              initialDisplayDate={selectedDate}
              navigation={navigation}
            />

            <WeightGraph />
          </View>
        </ScrollView>
        <Footer hide={false} navigation={navigation} />
      </>
    </TouchableWithoutFeedback>
  );
};
