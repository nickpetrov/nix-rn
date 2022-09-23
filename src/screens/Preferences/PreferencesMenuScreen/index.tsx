// utils
import React from 'react';

// components
import {View, Text, TouchableWithoutFeedback, SafeAreaView} from 'react-native';

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
  return (
    <SafeAreaView>
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
        <View style={styles.menuItem}>
          <Text>Daily Calorie Preferences</Text>
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
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.GroceryAgentSettings);
        }}>
        <View style={styles.menuItem}>
          <Text>Grocery Agent Preferences</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(Routes.DeveloperSettings);
        }}>
        <View style={styles.menuItem}>
          <Text>Developer settings</Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
