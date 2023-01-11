// utils
import React, {useState} from 'react';

// components
import {
  Text,
  View,
  ScrollView,
  Platform,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {NixButton} from 'components/NixButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import {useSelector} from 'hooks/useRedux';

// styles
import {styles} from './SubscribeScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface SubscribeScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Subscribe
  >;
}

const SubscribeScreen: React.FC<SubscribeScreenProps> = ({navigation}) => {
  const {premium_user, grocery_agent} = useSelector(
    state => state.auth.userData,
  );
  const [showTrial, setShowTrial] = useState(true);

  const purchaseSubscription = (product: string) => {
    console.log(product);
  };
  const restorePurchases = () => {};
  const openTOS = () => {
    Linking.openURL('https://www.nutritionix.com/terms');
  };
  const openPrivacy = () => {
    Linking.openURL('https://www.nutritionix.com/privacy');
  };
  const unsubscribeFromPro = () => {};
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>Track Pro</Text>
      <Text style={styles.intro}>
        Subscribe to Pro and begin sharing with your coach today!
      </Text>
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <View style={styles.itemPrice}>
            <View style={styles.itemPriceHeader}>
              <Text style={styles.itemPriceSup}>$</Text>
              <Text style={styles.itemPriceText}>5.99</Text>
            </View>
            <Text style={styles.itemPriceSub}>/mo</Text>
          </View>
          <View>
            <Text style={styles.itemTerm}>Monthly Subscription</Text>
            <Text style={styles.itemInfo}>
              1/10 the cost of gym membership!
            </Text>
          </View>
        </View>
        <NixButton
          style={styles.itemBtn}
          btnTextStyles={{fontWeight: '700'}}
          type="blue"
          title="Subscribe"
          onPress={() => purchaseSubscription('Track_Pro_Automatic_Renewal')}
        />
        {showTrial && (
          <Text>Start your 2 month free trial, then $5.99/month</Text>
        )}
      </View>
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <View style={styles.itemPrice}>
            <View style={styles.itemPriceHeader}>
              <Text style={styles.itemPriceSup}>$</Text>
              <Text style={styles.itemPriceText}>29</Text>
            </View>
            <Text style={styles.itemPriceSub}>/year</Text>
          </View>
          <View>
            <Text style={styles.itemTerm}>Annual Subscription</Text>
            <Text style={styles.itemInfo}>Discounted rate of $29/year</Text>
          </View>
        </View>
        <NixButton
          style={styles.itemBtn}
          btnTextStyles={{fontWeight: '700'}}
          type="blue"
          title="Subscribe"
          onPress={() => purchaseSubscription('Track_Pro_Automatic_Renewal')}
        />
        {showTrial && <Text>Start your 2 month free trial, then $29/year</Text>}
      </View>
      <View style={{paddingHorizontal: 10}}>
        <NixButton
          style={styles.restoreBtn}
          btnTextStyles={styles.restoreBtnText}
          title="Restore previous purchase"
          onPress={restorePurchases}
        />
        <Text style={styles.subscribeDescriptionTitle}>
          Subscription Details
        </Text>
        <Text style={styles.subscribeDescriptionText}>
          {Platform.OS === 'ios'
            ? 'If you choose to purchase a subscription, payment will be charged to your iTunes account, and your account will be charged within 24-hours prior to the end of the 2-month trial period. Auto-renewal may be turned off at any time by going to your settings in the iTunes store after purchase.'
            : 'If you choose to purchase a subscription, payment will be charged to your Google Play account, and your account will be charged within 24-hours prior to the end of the 2-month trial period. Auto-renewal may be turned off at any time by going to your subscription settings in the Google Play Store app. '}{' '}
          For more information, please visit our{' '}
          <Text style={styles.subscribeDescriptionLink} onPress={openTOS}>
            terms of service
          </Text>{' '}
          and{' '}
          <Text style={styles.subscribeDescriptionLink} onPress={openPrivacy}>
            {' '}
            Privacy Policy{' '}
          </Text>
        </Text>
        <Text style={styles.note}>
          Need help? Email{' '}
          <Text
            style={styles.noteLink}
            onPress={() => Linking.openURL('mailto:support@nutritionix.com')}>
            support@nutritionix.com
          </Text>
        </Text>
      </View>
      {premium_user && (
        <View>
          <Text style={styles.welcome}>
            You're a <Text style={styles.dark}>Track</Text>{' '}
            <Text style={styles.pro}>Pro</Text> user!
          </Text>
          <Text style={styles.intro}>
            Ready to track like a pro? You have now access to awesome features
            like:
          </Text>
          <TouchableHighlight
            style={styles.proItem}
            underlayColor="#31b0d5"
            onPress={() => navigation.navigate(Routes.MyCoach)}>
            <>
              <View style={styles.proItemContent}>
                <Text style={styles.proItemText}>Coach Portal</Text>
                <Text style={styles.proItemSup}>
                  Share your log with a coach now!
                </Text>
              </View>
              <FontAwesome name="chevron-right" color="#fff" size={16} />
            </>
          </TouchableHighlight>
          {grocery_agent && (
            <TouchableOpacity
              style={styles.unsubscribeBtn}
              onPress={unsubscribeFromPro}>
              <Text style={styles.unsubscribeBtnText}>
                Unsubscribe from Pro
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default SubscribeScreen;
