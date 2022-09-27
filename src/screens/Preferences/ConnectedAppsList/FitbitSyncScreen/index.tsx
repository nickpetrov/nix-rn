// utils
import React, {useState} from 'react';

// components
import {View, Text, SafeAreaView} from 'react-native';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import ModalSelector from 'react-native-modal-selector';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as authActions from 'store/auth/auth.actions';
import {
  fitbitSign,
  fitbitUnlink,
} from 'store/connectedApps/connectedApps.actions';

// styles
import {styles} from './FitbitSyncScreen.styles';

export const FitbitSyncScreen: React.FC = () => {
  const userData = useSelector(state => state.auth.userData);
  const nutritionSyncState = useSelector(
    state => state.connectedApps.nutritionSyncState,
  );
  const fitbitSync = userData.oauths.filter(
    (item: {provider: string}) => item.provider === 'fitbit',
  )[0];
  console.log('fitbitSync', fitbitSync);
  const [nutritionValue, setNutritionValue] = useState(
    fitbitSync && fitbitSync.log_pref === 1 ? 'push' : 'off',
  );
  console.log(nutritionValue);
  const [showFitbitAuth, setShowFitbitAuth] = useState(false);

  const dispatch = useDispatch();

  const initFitbitSync = () => {
    dispatch(fitbitSign()).then(() => {
      setShowFitbitAuth(true);
    });
  };

  const authUrlChangeHandler = (webView: WebViewNavigation) => {
    if (
      webView.url ===
      'https://trackapi.nutritionix.com/v2/oauth/fitbit/success#_=_'
    ) {
      dispatch(authActions.getUserDataFromAPI());
      setShowFitbitAuth(false);
    }
  };

  const turnOffFitbitSync = () => {
    dispatch(fitbitUnlink()).then(() => {
      dispatch(authActions.getUserDataFromAPI());
      setShowFitbitAuth(false);
    });
  };

  const handleMessageFromWebView = (data: WebViewMessageEvent) => {
    console.log(data);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Fitbit</Text>
      </View>

      {!showFitbitAuth ? (
        <View>
          <Text style={styles.label}>Nutrition:</Text>
          <ModalSelector
            data={[
              {
                label: 'Push',
                value: 'push',
                key: 'push',
              },
              {
                label: 'Off',
                value: 'off',
                key: 'off',
              },
            ]}
            initValue={nutritionValue === 'push' ? 'push' : 'off'}
            onChange={option => {
              setNutritionValue(option.value);
              if (option.value === 'push') {
                initFitbitSync();
              } else {
                turnOffFitbitSync();
              }
            }}
            listType="FLATLIST"
            keyExtractor={(item: {label: string; value: string}) => item.value}>
            <View style={styles.pickerContainer}>
              <Text>{nutritionValue === 'push' ? 'Push' : 'Off'}</Text>
            </View>
          </ModalSelector>
          <View style={styles.footer}>
            <Text style={styles.footerText}>About Push &amp; Pull</Text>
            <Text style={styles.footerText}>How does Push work?</Text>
            <Text>
              Nutritionix sends data you enter into an approved 3rd party app.
            </Text>
            <Text style={styles.footerText}>How does Pull work?</Text>
            <Text>
              Nutritionix will pull-in the data you have stored in other
              services. Use this option when a 3rd party app is the summary
              source of this data.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.webView}>
          <WebView
            onMessage={data => handleMessageFromWebView(data)}
            style={styles.webView}
            source={{
              uri: `https://trackapi.nutritionix.com/v2/oauth/fitbit/authorize?state=${nutritionSyncState}`,
            }}
            onNavigationStateChange={authUrlChangeHandler}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
