// utils
import React, {useEffect} from 'react';

// components
import {SafeAreaView, ActivityIndicator} from 'react-native';

// hooks
import {useDispatch, useSelector} from 'hooks';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getUserDataFromAPI} from 'store/auth/auth.actions';

// actions
import {updateReviewCheckAfterComeBack} from 'store/base/base.actions';

// types
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface StartupScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Startup
  >;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const userJWT = useSelector(state => state.auth.userJWT);

  useEffect(() => {
    if (!userJWT) {
      navigation.navigate(Routes.LoginScreens);
    } else {
      navigation.navigate(Routes.LoggedIn);
      dispatch(getUserDataFromAPI());
      dispatch(updateReviewCheckAfterComeBack());
    }
  }, [dispatch, navigation, userJWT]);

  return (
    <SafeAreaView
      style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};
