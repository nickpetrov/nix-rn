// utils
import React, {useCallback} from 'react';
import InAppReview from 'react-native-in-app-review';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {getVersion} from 'react-native-device-info';

// components
import {
  View,
  SafeAreaView,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Share,
  Linking,
  ScrollView,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixButton} from 'components/NixButton';

// hooks
import {useSelector} from 'hooks/useRedux';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './SideMenu.styles';

// types
import {DrawerNavigationProp} from '@react-navigation/drawer';

export const SideMenu: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const coach = useSelector(state => state.auth.userData.coach);
  const userGroceyAgentInfo = useSelector(
    state => state.base.userGroceyAgentInfo,
  );
  const appVersion = getVersion();

  let menuItems: Array<{
    icon: string;
    title: string;
    to: string;
    disabled?: boolean;
    hide?: boolean;
  }> = [
    {
      icon: 'home',
      title: 'Home',
      to: Routes.Dashboard,
    },
    {
      icon: 'list',
      title: 'My Recipes',
      to: Routes.Recipes,
    },
    {
      icon: 'cutlery',
      title: 'Custom Foods',
      to: Routes.CustomFoods,
    },
    {
      icon: 'gear',
      title: 'Preferences',
      to: Routes.Preferences,
    },
    {
      icon: 'bullseye',
      title: 'Daily Goals',
      to: Routes.DailyGoals,
    },
    {
      icon: 'thumbs-o-up',
      title: 'My Coach',
      to: Routes.MyCoach,
    },
    {
      icon: 'play',
      title: 'Coach Portal',
      to: Routes.CoachPortal,
      hide: !coach || !coach.is_active,
    },
    {
      icon: 'question',
      title: 'Help',
      to: Routes.Help,
    },
    {
      icon: 'camera',
      title: 'Grocery Agent Mode',
      to: Routes.GroceryAgentMode,
      hide: !userGroceyAgentInfo.grocery_agent,
    },
  ];

  const rateAppHandler = useCallback(() => {
    // Give you result if version of device supported to rate app or not!
    InAppReview.isAvailable();

    // trigger UI InAppreview
    InAppReview.RequestInAppReview()
      .then(hasFlowFinishedSuccessfully => {
        // when return true in android it means user finished or close review flow
        console.log('InAppReview in android', hasFlowFinishedSuccessfully);

        // when return true in ios it means review flow lanuched to user.
        console.log(
          'InAppReview in ios has launched successfully',
          hasFlowFinishedSuccessfully,
        );

        // 1- you have option to do something ex: (navigate Home page) (in android).
        // 2- you have option to do something,
        // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

        // 3- another option:
        if (hasFlowFinishedSuccessfully) {
          // do something for ios
          // do something for android
        }

        // for android:
        // The flow has finished. The API does not indicate whether the user
        // reviewed or not, or even whether the review dialog was shown. Thus, no
        // matter the result, we continue our app flow.

        // for ios
        // the flow lanuched successfully, The API does not indicate whether the user
        // reviewed or not, or he/she closed flow yet as android, Thus, no
        // matter the result, we continue our app flow.
      })
      .catch(error => {
        //we continue our app flow.
        // we have some error could happen while lanuching InAppReview,
        // Check table for errors and code number that can return in catch.
        console.log(error);
      });
  }, []);

  const shareAppHandler = useCallback(async () => {
    try {
      const result = await Share.share({
        url:
          Platform.OS === 'ios'
            ? 'https://appsto.re/us/o_bs_.i'
            : 'https://play.google.com/store/apps/details?id=com.nutritionix.nixtrack&hl=en',
        title: 'Nutritionix Track App - Calorie Counter and Food Tracker',
        message:
          Platform.OS === 'ios'
            ? "Try out this cool food tracking app I have been using, it's called Nutritionix Track: https://appsto.re/us/o_bs_.i"
            : "Try out this cool food tracking app I have been using, it's called Nutritionix Track: https://play.google.com/store/apps/details?id=com.nutritionix.nixtrack&hl=en",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      const message = error?.message;
      if (message) {
        console.log(message);
      }
    }
  }, []);

  const openFbHandler = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    let fbAppUrl = '';

    if (Platform.OS === 'ios') {
      fbAppUrl = 'fb://profile/110659912291888';
    } else {
      fbAppUrl = 'fb://page/110659912291888';
    }

    const supported = await Linking.canOpenURL(fbAppUrl);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(fbAppUrl);
    } else {
      await Linking.openURL('https://www.facebook.com/nutritionix');
      // Alert.alert(`Don't know how to open this URL: ${fbAppUrl}`);
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.track}>
        <Text style={styles.trackText}>Track {appVersion}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Need to manually add items to the sidedrawer */}
        {menuItems.map((item, index) => {
          if (item.hide) {
            return;
          }
          return (
            <TouchableWithoutFeedback
              key={`${index}-${item.title}`}
              style={styles.menuItemWrapper}
              disabled={item.disabled}
              onPress={() => navigation.navigate(item.to)}>
              <View style={styles.menuItemWrapper}>
                <View style={styles.iconWrapper}>
                  <FontAwesome
                    name={item.icon}
                    size={25}
                    style={{marginRight: 10}}
                  />
                </View>
                <Text style={{flex: 1}}>{item.title}</Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate(Routes.Logout);
          }}>
          <View style={styles.menuItemWrapper}>
            <View style={styles.iconWrapper}>
              <FontAwesome
                name="sign-out"
                size={25}
                style={{marginRight: 10}}
              />
            </View>
            <Text>Signout</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{padding: 20, flex: 10, justifyContent: 'flex-end'}}>
          {/*TODO - add redirects for each button*/}
          <Text>Like this app?</Text>
          {/*TODO - conditionally show Google Play or App Store*/}
          <NixButton
            type="primary"
            iconName="star"
            iconStyles={styles.iconStyle}
            title={
              Platform.OS === 'ios'
                ? 'Rate us on App Store'
                : 'Rate us on Google Play'
            }
            onPress={rateAppHandler}
            style={{marginTop: 10}}
          />
          <NixButton
            type="primary"
            iconName="share-square-o"
            iconStyles={styles.iconStyle}
            title="Send Track to a friend"
            onPress={() => shareAppHandler()}
            style={{marginTop: 10}}
          />
          <NixButton
            type="primary"
            iconName="thumbs-up"
            iconStyles={styles.iconStyle}
            title="Like us on Facebook"
            onPress={() => openFbHandler()}
            style={{marginTop: 10}}
          />
          <TouchableWithoutFeedback
            style={{marginTop: 10}}
            onPress={() => Linking.openURL('https://www.nutritionix.com')}>
            <View>
              <WithLocalSvg
                style={{alignSelf: 'center', marginTop: 20}}
                asset={require('assets/images/logo2.svg')}
                width="180"
                height="40"
                viewBox="0 0 1000 219"
                preserveAspectRatio="none"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
