// utils
import React, {useState} from 'react';

// components
import {View, Text, SafeAreaView} from 'react-native';
import {WebViewMessageEvent, WebViewNavigation} from 'react-native-webview';
import ModalSelector from 'react-native-modal-selector';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixInput} from 'components/NixInput';

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

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {Routes} from 'navigation/Routes';

interface FitbitSyncScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.FitbitSync
  >;
}

export const FitbitSyncScreen: React.FC<FitbitSyncScreenProps> = ({
  navigation,
}) => {
  const userData = useSelector(state => state.auth.userData);
  const fitbitSync = userData.oauths.filter(
    (item: {provider: string}) => item.provider === 'fitbit',
  )[0];
  const [nutritionValue, setNutritionValue] = useState(
    fitbitSync && fitbitSync.log_pref === 1 ? 'push' : 'off',
  );
  const dispatch = useDispatch();

  const authUrlChangeHandler = (webView: WebViewNavigation) => {
    if (
      webView.url ===
      'https://trackapi.nutritionix.com/v2/oauth/fitbit/success#_=_'
    ) {
      dispatch(authActions.getUserDataFromAPI());
      navigation.navigate(Routes.FitbitSync);
    }
  };

  const turnOffFitbitSync = () => {
    dispatch(fitbitUnlink()).then(() => {
      dispatch(authActions.getUserDataFromAPI());
    });
  };

  const handleMessageFromWebView = (data: WebViewMessageEvent) => {
    console.log('data', data);
  };

  const initFitbitSync = () => {
    dispatch(fitbitSign()).then(newNutritionSyncState => {
      navigation.navigate(Routes.WebView, {
        url: `https://trackapi.nutritionix.com/v2/oauth/fitbit/authorize?state=${newNutritionSyncState}`,
        onMessage: handleMessageFromWebView,
        onNavigationStateChange: authUrlChangeHandler,
      });
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View>
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
            <NixInput
              label="Nutrition"
              style={{textAlign: 'right'}}
              labelContainerStyle={styles.labelContainerStyle}
              value={nutritionValue === 'push' ? 'Push' : 'Off'}
              onChangeText={() => {}}
              onBlur={() => {}}
              autoCapitalize="none">
              <FontAwesome
                name={'sort-down'}
                size={15}
                style={styles.selectIcon}
              />
            </NixInput>
          </View>
        </ModalSelector>
        <View style={styles.footer}>
          <View style={styles.footerHeader}>
            <Text style={styles.footerTitle}>About Push &amp; Pull</Text>
          </View>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>How does Push work?</Text>
            <Text>
              Nutritionix sends data you enter into an approved 3rd party app.
            </Text>
            <Text style={[styles.footerText, styles.mt20]}>
              How does Pull work?
            </Text>
            <Text>
              Nutritionix will pull-in the data you have stored in other
              services. Use this option when a 3rd party app is the summary
              source of this data.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
