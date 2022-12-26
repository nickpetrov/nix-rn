// utils
import React, {useEffect} from 'react';

// components
import {SafeAreaView, ActivityIndicator} from 'react-native';

// hooks
import {useDispatch, useSelector} from 'hooks';

// constants
import {Routes} from 'navigation/Routes';

// actions
import {getUserDataFromAPI} from 'store/auth/auth.actions';
import {
  initGroceyAgentInfo,
  updateReviewCheckAfterComeBack,
  updateSentryContext,
} from 'store/base/base.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
      navigation.replace(Routes.LoginScreens);
      updateSentryContext();
    } else {
      navigation.replace(Routes.LoggedIn);
      dispatch(getUserDataFromAPI());
      dispatch(updateReviewCheckAfterComeBack());
      dispatch(initGroceyAgentInfo());
    }
  }, [dispatch, navigation, userJWT]);

  return (
    <SafeAreaView
      style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};
