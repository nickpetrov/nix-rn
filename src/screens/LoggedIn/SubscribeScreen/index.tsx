// utils
import React, {useState, useEffect, useCallback} from 'react';

// helpers
import {SQLexecute} from 'helpers/sqlite';
import {analyticTrackEvent} from 'helpers/analytics.ts';

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
import {
  initConnection,
  endConnection,
  getAvailablePurchases,
  flushFailedPurchasesCachedAsPendingAndroid,
  requestSubscription,
  getSubscriptions,
  Subscription,
  SubscriptionAndroid,
  setup,
  clearProductsIOS,
  clearTransactionIOS,
  SubscriptionPurchase,
  ProductPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
  finishTransaction,
  getReceiptIOS,
} from 'react-native-iap';
import LoadIndicator from 'components/LoadIndicator';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// services
import coachService from 'api/coachService';

// actions
import {setInfoMessage} from 'store/base/base.actions';
import {updateUserData, getUserDataFromAPI} from 'store/auth/auth.actions';

// styles
import {styles} from './SubscribeScreen.styles';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

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
  const dispatch = useDispatch();
  const db = useSelector(state => state.base.db);
  const {premium_user, grocery_agent} = useSelector(
    state => state.auth.userData,
  );
  const [showTrial, setShowTrial] = useState(true);
  const [initLoading, setInitLoading] = useState(false);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subscriptions, setsubscriptions] = useState<Subscription[]>([]);

  const validatePurchase = useCallback(
    (
      receiptString: string,
      androidSignature: string,
      purchase?: ProductPurchase | SubscriptionPurchase,
    ) => {
      if (!receiptString) {
        console.log('empty reciept');
        return;
      }
      coachService
        .validatePurchase(receiptString, androidSignature)
        .then((res: any) => {
          analyticTrackEvent('validate_subscribe_success', Platform.OS);
          const receipt = res.data.latest_receipt;
          if (purchase && Platform.OS === 'ios') {
            try {
              finishTransaction({purchase, isConsumable: false});
            } catch (error) {
              console.log('finishTransaction error', error);
            }
          }
          SQLexecute({
            db,
            query:
              'INSERT INTO iap_receipts (receipt, signature) VALUES (?, ?)',
            params: [JSON.stringify(receipt), androidSignature],
          })
            .then(function () {
              dispatch(getUserDataFromAPI());
              navigation.navigate(Routes.MyCoach);
            })
            .catch(function (err: any) {
              console.log('there was error adding receipt data to db', err);
            });
        })
        .catch(function (err: any) {
          analyticTrackEvent('validate_subscribe_fail', Platform.OS);
          console.log(err);
        });
    },
    [db, navigation, dispatch],
  );

  const initIAP = useCallback(async (): Promise<void> => {
    setInitLoading(true);
    try {
      const result = await initConnection();
      if (Platform.OS === 'android') {
        try {
          await flushFailedPurchasesCachedAsPendingAndroid();
        } catch (error) {
          console.log('err flushFailedPurchasesCachedAsPendingAndroid', error);
        }
      } else {
        try {
          await clearProductsIOS();
        } catch (error) {
          console.log('err clearProductsIOS', error);
        }
        try {
          await clearTransactionIOS();
        } catch (error) {
          console.log('err clearTransactionIOS', error);
        }
      }
      if (result === false) {
        console.log("couldn't get in-app-purchase information");
        return;
      }
    } catch (err) {
      console.error('fail to get in-app-purchase information', err);
    }

    const ids =
      Platform.OS === 'ios'
        ? ['Track_Pro_Automatic_Renewal', 'Track_Pro_Renewal_Yearly']
        : ['track_pro_automatic_renewal', 'track_pro_renewal_yearly'];
    try {
      const purchases = await getAvailablePurchases({
        automaticallyFinishRestoredTransactions: true,
      });
      let alreadyPurchases = purchases.filter(item =>
        ids.includes(item.productId),
      );
      console.log('alreadyPurchases', alreadyPurchases);
      if (alreadyPurchases && alreadyPurchases.length > 0) {
        setShowTrial(false);
      }
    } catch (error) {
      console.log('error getAvailablePurchases', error);
    }

    try {
      const getsubs = await getSubscriptions({
        skus: ids,
      });
      setsubscriptions(getsubs);
      console.log('getsubs', getsubs);
    } catch (error) {
      console.log('error get subscriptions', error);
    }
    setInitLoading(false);
  }, []);

  const getIosReceipt = useCallback(async () => {
    try {
      const receipt = await getReceiptIOS({forceRefresh: false});
      console.log('getReceiptIOS', receipt);
      return receipt;
    } catch (error) {
      console.log('error get ios receipt', error);
    }
  }, []);

  useEffect(() => {
    setup({storekitMode: 'STOREKIT1_MODE'});
    initIAP();
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase: SubscriptionPurchase | ProductPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        let androidSignature = '';
        if (purchase.signatureAndroid) {
          androidSignature = purchase.signatureAndroid;
        }
        // validate the receipt
        console.log('validate the receipt, purchase data', purchase);
        if (purchase.transactionReceipt) {
          validatePurchase(
            purchase.transactionReceipt,
            androidSignature,
            purchase,
          );
        } else if (Platform.OS === 'ios') {
          getIosReceipt().then(receipt => {
            if (receipt) {
              validatePurchase(receipt, androidSignature, purchase);
            }
          });
        }
      },
    );

    const purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('purchaseErrorListener', error);
      },
    );

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      endConnection();
    };
  }, [initIAP, validatePurchase, getIosReceipt]);

  const purchaseSubscription = async (sku: string) => {
    setSubsLoading(true);
    if (Platform.OS === 'android') {
      sku = sku.toLowerCase();
    }

    try {
      let data;
      if (Platform.OS === 'android') {
        const androidSubs = subscriptions.find(
          item => item.productId === sku && item.platform === 'android',
        );
        console.log('androidSubs', androidSubs);
        const offerToken =
          (androidSubs as SubscriptionAndroid)?.subscriptionOfferDetails[0]
            .offerToken || '';
        try {
          data = await requestSubscription({
            subscriptionOffers: [{sku, offerToken}],
          });
        } catch (error) {
          console.log('err req subscribe android', error);
        }
      } else {
        console.log('ios subs', sku);
        try {
          data = await requestSubscription({sku});
        } catch (error) {
          console.log('err req subscribe ios', error);
        }
      }
      if (data) {
        console.log('data', data);
        analyticTrackEvent('subscribe', Platform.OS);
      }
    } catch (err: any) {
      console.warn(err.code, err.message);
    }
    setSubsLoading(false);
  };

  const restorePurchases = async () => {
    const ids =
      Platform.OS === 'ios'
        ? ['Track_Pro_Automatic_Renewal', 'Track_Pro_Renewal_Yearly']
        : ['track_pro_automatic_renewal', 'track_pro_renewal_yearly'];
    const purchases = await getAvailablePurchases({
      onlyIncludeActiveItems: true,
    });
    let alreadyPurchases = purchases
      .filter(item => ids.includes(item.productId))
      .sort((a, b) => b.transactionDate - a.transactionDate);
    console.log('alreadyPurchases', alreadyPurchases);
    let androidSignature = '';
    if (alreadyPurchases.length) {
      androidSignature = alreadyPurchases[0].signatureAndroid || '';
      if (alreadyPurchases[0].transactionReceipt) {
        validatePurchase(
          alreadyPurchases[0].transactionReceipt,
          androidSignature,
          alreadyPurchases[0],
        );
      } else if (Platform.OS === 'ios') {
        getIosReceipt().then(receipt => {
          if (receipt) {
            validatePurchase(receipt, androidSignature, alreadyPurchases[0]);
          }
        });
      }
    } else {
      dispatch(
        setInfoMessage({
          title: 'Error',
          btnText: 'Nothing to restore',
        }),
      );
    }
  };

  const openTOS = () => {
    Linking.openURL('https://www.nutritionix.com/terms');
  };

  const openPrivacy = () => {
    Linking.openURL('https://www.nutritionix.com/privacy');
  };

  const unsubscribeFromPro = () => {
    dispatch(updateUserData({premium_user: 0}))
      .then(function () {
        analyticTrackEvent('unsubscribe', 'unsubscribe_from_pro');
        console.log('unsubscribe success');
      })
      .catch(function (err) {
        console.log('unsubscribe error', err);
      });
  };

  if (initLoading) {
    return <LoadIndicator color={Colors.Primary} />;
  }

  return (
    <ScrollView style={styles.root}>
      {!premium_user && (
        <View>
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
              disabled={subsLoading}
              onPress={() =>
                purchaseSubscription('Track_Pro_Automatic_Renewal')
              }
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
              disabled={subsLoading}
              onPress={() => purchaseSubscription('Track_Pro_Renewal_Yearly')}
            />
            {showTrial && (
              <Text>Start your 2 month free trial, then $29/year</Text>
            )}
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
              <Text
                style={styles.subscribeDescriptionLink}
                onPress={openPrivacy}>
                {' '}
                Privacy Policy{' '}
              </Text>
            </Text>
            <Text style={styles.note}>
              Need help? Email{' '}
              <Text
                style={styles.noteLink}
                onPress={() =>
                  Linking.openURL('mailto:support@nutritionix.com')
                }>
                support@nutritionix.com
              </Text>
            </Text>
          </View>
        </View>
      )}
      {!!premium_user && (
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
          {!!grocery_agent && (
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
