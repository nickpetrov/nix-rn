// utils
import React, {useState} from 'react';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from 'react-native';
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
  const [walkPopup, setwalkPopup] = useState(false);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!walkPopup) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Prompt the user before leaving the screen
        setwalkPopup(false);
      }),
    [navigation, walkPopup],
  );

  React.useLayoutEffect(() => {
    if (walkPopup) {
      navigation.setOptions({
        headerShown: false,
      });
    } else {
      navigation.setOptions({
        headerShown: true,
      });
    }
  }, [navigation, walkPopup]);

  return (
    <SafeAreaView style={styles.root}>
      {walkPopup ? (
        <TouchableWithoutFeedback
          onPress={() => {
            setwalkPopup(false);
          }}>
          <View style={styles.walk}>
            <Image
              style={styles.walkImage}
              source={require('assets/images/instruction/instruction-1.jpg')}
              resizeMode="stretch"
            />
            <View style={styles.walkBtn}>
              <Text style={styles.walkText}>Start Logging Now</Text>
              <FontAwesome name="arrow-right" color="#fff" size={20} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              setwalkPopup(true);
            }}>
            <View style={styles.menuItem}>
              <View style={styles.icon}>
                <FontAwesome name="mobile" size={30} />
              </View>
              <Text style={styles.menuItemText}>Walkthrough</Text>
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
      )}
    </SafeAreaView>
  );
};
