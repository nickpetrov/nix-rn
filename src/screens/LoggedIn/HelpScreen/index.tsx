// utils
import React, {useCallback} from 'react';

// components
import {View, Text, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// styles
import {styles} from './HelpScreen.styles';

// constats
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface HelpScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Help>;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({navigation}) => {
  const showWalkthrough = useCallback(() => {
    console.log('walkthrough unavailable');
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            showWalkthrough();
          }}>
          <View style={styles.menuItem}>
            <View style={styles.icon}>
              <FontAwesome name="mobile" size={30} />
            </View>
            <Text style={styles.menuItemText}>
              Walkthrough (temporary unavailable)
            </Text>
            {/*TODO - create walkthrough*/}
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate(Routes.WebView, {
              url: 'https://nutritionix.helpsite.com/',
            });
          }}>
          <View style={styles.menuItem}>
            <View style={styles.icon}>
              <FontAwesome name="question-circle" size={30} />
            </View>
            <Text style={styles.menuItemText}>FAQ</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.terms}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(Routes.WebView, {
                url: 'https://www.nutritionix.com/terms',
              });
            }}>
            <Text style={styles.text}>Terms and Conditions</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(Routes.WebView, {
                url: 'https://www.nutritionix.com/privacy',
              });
            }}>
            <Text style={styles.text}>Privacy Policy</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
};
