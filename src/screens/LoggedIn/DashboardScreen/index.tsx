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

// actinos
import {changeSelectedDay} from 'store/userLog/userLog.actions';

// constant
import {Routes} from 'navigation/Routes';

// helpers
import {scheduleNotifications} from 'helpers/notificationsHelper';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

// styles
import {styles} from './DashboardScreen.styles';

interface DashboardScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
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
          onPress={() => navigation.navigate(Routes.Basket)}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    //TODO - move notificationss init to Context.
    scheduleNotifications(
      userData.weekday_reminders_enabled,
      userData.weekend_reminders_enabled,
    );
  }, [userData]);

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
