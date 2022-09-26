// utils
import React, {useState, useEffect, useLayoutEffect} from 'react';
import moment from 'moment-timezone';

// components
import {
  Dimensions,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import BasketButton from 'components/BasketButton';
import {Header} from 'components/Header';
import FoodLog from 'components/FoodLog';
import Footer from 'components/Footer';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import useLocalNotification from 'hooks/useLocalNotification';

// actinos
import {changeSelectedDay} from 'store/userLog/userLog.actions';

// constant
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

// styles
import {styles} from './DashboardScreen.styles';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface DashboardScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Dashboard
  >;
  route: RouteProp<StackNavigatorParamList, Routes.Dashboard>;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
  useLocalNotification({
    weekday: userData.weekday_reminders_enabled,
    weekend: userData.weekend_reminders_enabled,
  });
  const {selectedDate} = useSelector(state => state.userLog);
  const [showPhotoUploadMessage, setShowPhotoUploadMessage] = useState(false);
  const infoMessage = route.params?.infoMessage;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackButtonMenuEnabled: false,
      headerTitle: (props: {
        children: string;
        tintColor?: string | undefined;
      }) => (
        <View style={{width: Dimensions.get('window').width - 110}}>
          <Header {...props} navigation={navigation} />
        </View>
      ),
      headerRight: () => (
        <BasketButton
          icon="shopping-basket"
          withCount
          onPress={() => navigation.navigate(Routes.Basket)}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (infoMessage === 'success') {
      setShowPhotoUploadMessage(true);
    }
    if (!selectedDate) {
      const newDate = moment().format('YYYY-MM-DD');
      dispatch(changeSelectedDay(newDate));
      return;
    }
  }, [selectedDate, infoMessage, dispatch]);

  setTimeout(() => {
    setShowPhotoUploadMessage(false);
  }, 3000);

  return (
    <TouchableWithoutFeedback
      style={styles.layout}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.layout}>
        {showPhotoUploadMessage ? (
          <View style={styles.photoMessageContainer}>
            <Text style={styles.photoMessageTitle}>Thank you!</Text>
            <View style={styles.photoMessageTextContainer}>
              <Text style={styles.photoMessageText}>
                {' '}
                Soon this food will be updated in our database.
              </Text>
            </View>
          </View>
        ) : null}
        <FoodLog />
        <Footer hide={false} navigation={navigation} />
      </View>
    </TouchableWithoutFeedback>
  );
};
