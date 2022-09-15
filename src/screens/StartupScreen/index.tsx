// utils
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import {SafeAreaView, ActivityIndicator} from 'react-native';

// hooks
import {useDispatch} from 'hooks';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// actions
import {getUserDataFromAPI, setUserJwt} from 'store/auth/auth.actions';
import {mergeBasket} from 'store/basket/basket.actions';
import {BasketState} from 'store/basket/basket.types';

interface StartupScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authenticate = async () => {
      const authData = await AsyncStorage.getItem('authData');
      if (!authData) {
        navigation.navigate(Routes.LoginScreens);
      } else {
        const {userJWT} = JSON.parse(authData);
        if (!userJWT) {
          navigation.navigate(Routes.LoginScreens);
        } else {
          await dispatch(setUserJwt(userJWT));
          await dispatch(getUserDataFromAPI());

          //get basekt from storage

          const getBasketFromStorage = async () => {
            let basket = await AsyncStorage.getItem('basket');
            if (!basket) {
              return;
            } else {
              const newBasket: BasketState = JSON.parse(basket);
              console.log(newBasket);
              dispatch(mergeBasket(newBasket));
            }
          };
          getBasketFromStorage();

          navigation.navigate(Routes.LoggedIn);
        }
      }
    };
    authenticate();
  }, [dispatch, navigation]);

  return (
    <SafeAreaView
      style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};
