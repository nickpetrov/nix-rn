// utils
import React from 'react';
import {getVersion, getBuildNumber} from 'react-native-device-info';

// components
import {View, Text, TouchableWithoutFeedback, SafeAreaView} from 'react-native';

// hooks
import {useSelector} from 'hooks/useRedux';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// contants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './PreferencesMenuScreen.styles';

interface PreferencesMenuScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Preferences
  >;
}

export const PreferencesMenuScreen: React.FC<PreferencesMenuScreenProps> = ({
  navigation,
}) => {
  const daily_kcal = useSelector(state => state.auth.userData.daily_kcal);
  const userGroceyAgentInfo = useSelector(
    state => state.base.userGroceyAgentInfo,
  );
  const appVersion = getVersion();
  const buildNumber = getBuildNumber();
  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.Profile);
        }}>
        <View style={styles.menuItem}>
          <Text>My Profile</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.DailyCalories);
        }}>
        <View style={[styles.menuItem, styles.menuItemRow]}>
          <Text>Daily Calorie Preferences</Text>
          {!!daily_kcal && <Text style={styles.cal}>{daily_kcal}</Text>}
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.ConnectedApps);
        }}>
        <View style={styles.menuItem}>
          <Text>Connected Apps</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.Notifications);
        }}>
        <View style={styles.menuItem}>
          <Text>Notifications</Text>
        </View>
      </TouchableWithoutFeedback>
      {userGroceyAgentInfo.grocery_agent && (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate(Routes.GroceryAgentSettings);
          }}>
          <View style={styles.menuItem}>
            <Text>Grocery Agent Preferences</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.DeveloperSettings);
        }}>
        <View style={styles.menuItem}>
          <Text>Developer settings</Text>
        </View>
      </TouchableWithoutFeedback> */}
      <Text style={styles.version}>
        Version: {appVersion}({buildNumber})
      </Text>
    </SafeAreaView>
  );
};
