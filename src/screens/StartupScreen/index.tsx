// utils
import React, {useEffect} from 'react';

// components
import {SafeAreaView, ActivityIndicator, Platform} from 'react-native';

// hooks
import {useDispatch, useSelector} from 'hooks';

// constants
import {Routes} from 'navigation/Routes';

// actions
import {getUserDataFromAPI} from 'store/auth/auth.actions';
import {
  initGroceyAgentInfo,
  updateReviewCheckAfterComeBack,
} from 'store/base/base.actions';
import {
  pullExerciseFromHK,
  pullWeightsFromHK,
} from 'store/connectedApps/connectedApps.actions';

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
  const hkSyncOptions = useSelector(state => state.connectedApps.hkSyncOptions);

  useEffect(() => {
    if (!userJWT) {
      navigation.replace(Routes.LoginScreens);
    } else {
      navigation.replace(Routes.LoggedIn);
      dispatch(getUserDataFromAPI());
      dispatch(updateReviewCheckAfterComeBack());
      dispatch(initGroceyAgentInfo());
      if (Platform.OS === 'ios') {
        if (hkSyncOptions.weight === 'pull') {
          dispatch(pullWeightsFromHK());
        }
        if (hkSyncOptions.exercise === 'pull') {
          dispatch(pullExerciseFromHK());
        }
      }
    }
  }, [
    dispatch,
    navigation,
    userJWT,
    hkSyncOptions.exercise,
    hkSyncOptions.weight,
  ]);

  return (
    <SafeAreaView
      style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};
