import React, {useEffect} from 'react';
import {Text, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Routes} from 'navigation/Routes';
import {getUserDataFromAPI, setUserJwt} from 'store/auth/auth.actions';
import {useDispatch} from 'hooks';

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
          dispatch(getUserDataFromAPI());

          navigation.navigate(Routes.LoggedIn);
        }
      }
    };
    authenticate();
  }, [dispatch, navigation]);

  return (
    <SafeAreaView>
      <Text>authenticating</Text>
    </SafeAreaView>
  );
};
