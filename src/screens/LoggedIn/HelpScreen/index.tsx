// utils
import React from 'react';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import useStateWithCallback from 'hooks/useStateWithCallback';

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
  const [walkPopup, setWalkPopup] = useStateWithCallback(false);

  const isIos = Platform.OS === 'ios';

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
        setWalkPopup(false);
      }),
    [navigation, walkPopup, setWalkPopup],
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
            setWalkPopup(false, () => {
              navigation.goBack();
            });
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
              setWalkPopup(true);
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
                title: isIos ? 'FAQ' : undefined
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
                  title: isIos ? 'Terms and Conditions' : undefined
                });
              }}>
              <Text style={styles.text}>Terms and Conditions</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate(Routes.WebView, {
                  url: 'https://www.nutritionix.com/privacy',
                  title: isIos ? 'Privacy Policy' : undefined
                });
              }}>
              <Text style={{...styles.text}}>Privacy Policy</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
