// utils
import React, {useState} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {analyticTrackEvent} from 'helpers/analytics.ts';
import {useRoute} from '@react-navigation/native';

// components
import {View, Text, Linking, TouchableOpacity} from 'react-native';
import {NixButton} from 'components/NixButton';
import VoiceInput from 'components/VoiceInput';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import TooltipView from 'components/TooltipView';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {
  setHideVoiceDisclaimer,
  setInfoMessage,
  setIsVoiceDisclaimerVisible,
} from 'store/base/base.actions';

// styles
import {styles} from './NaturalForm.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

interface NaturalFormProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const NaturalForm: React.FC<NaturalFormProps> = ({navigation}) => {
  const route = useRoute();
  const netInfo = useNetInfo();
  const isVoiceDisclaimerVisible = useSelector(
    state => state.base.isVoiceDisclaimerVisible,
  );
  const [naturalQuery, setNaturalQuery] = useState('');
  const [hideDisclaymore, setHideDisclaymore] = useState(false);
  const dispatch = useDispatch();
  const [randomPlaceholderIndex] = useState(Math.floor(Math.random() * 9));

  const placeholderText = [
    ' e.g. Turkey club sandwich and 12oz coke',
    ' e.g. 600 cal chicken caesar salad',
    ' e.g. 5 eggs and 1 glass milk',
    ' e.g. 2 glasses of wine',
    ' e.g. 15 almonds',
    ' e.g. 100 cal greek yogurt',
    ' e.g. yesterday for dinner i ate a grilled cheese (this will log to 7pm yesterday)',
    ' e.g. for breakfast i had 2 eggs, a slice of bacon, and toast (this will log to 8am this morning)',
  ];

  const handleQueryChange = (text: string) => setNaturalQuery(text);

  const sendNaturalQuery = async () => {
    if (!netInfo.isConnected) {
      dispatch(
        setInfoMessage({
          title: 'This feature is not available in offline mode',
          btnText: 'Ok',
        }),
      );
      return;
    }
    if (!naturalQuery) {
      dispatch(
        setInfoMessage({
          title: 'Please enter some foods to continue',
          btnText: 'Ok',
        }),
      );
      return;
    }

    analyticTrackEvent('foodlog_natural', naturalQuery);

    dispatch(basketActions.addFoodToBasket(naturalQuery))
      .then(foodsToAdd => {
        dispatch(
          basketActions.mergeBasket({
            meal_type: foodsToAdd[0].meal_type,
            consumed_at: foodsToAdd[0].consumed_at,
          }),
        );
        navigation.replace(Routes.Basket);
        analyticTrackEvent('natural_addFoodSmart', naturalQuery);
      })
      .catch(err => {
        dispatch(
          setInfoMessage({
            title: err.data.message + ' for:',
            text: naturalQuery,
            btnText: 'Ok',
          }),
        );
      });
  };

  const goToGooglePlayMarket = () => {
    Linking.openURL(
      'market://details?id=com.google.android.googlequicksearchbox',
    );
  };
  const disclaymoreClose = () => {
    dispatch(setIsVoiceDisclaimerVisible(false));
    if (hideDisclaymore) {
      dispatch(setHideVoiceDisclaimer(false));
    }
  };
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <TooltipView
          doNotDisplay={route.name !== Routes.TrackFoods}
          eventName="firstEnterInTrackTab"
          childrenWrapperStyle={{
            backgroundColor: '#fff',
            alignItems: 'stretch',
          }}
          step={0}>
          <VoiceInput
            value={naturalQuery}
            onChangeText={handleQueryChange}
            placeholder={placeholderText[randomPlaceholderIndex]}
            style={styles.voiceInput}
            withDisclaymore
          />
        </TooltipView>
        <View style={styles.btnContainer}>
          <NixButton
            iconName="ios-add-circle-outline"
            iosIcon
            iconStyles={styles.addIcon}
            title="Add to Basket"
            type="primary"
            onPress={sendNaturalQuery}
          />
        </View>
        {isVoiceDisclaimerVisible && (
          <View style={styles.disclaymore}>
            <Text style={styles.disclaymoreText}>
              * If you are experiencing trouble with the Google Voice
              recognition service, please uninstall the Google Voice Search app
              and{' '}
              <Text
                onPress={goToGooglePlayMarket}
                style={styles.disclaymoreLink}>
                click here
              </Text>{' '}
              to download the latest version from the Play Store.
            </Text>
            <View style={styles.disclaymoreFooter}>
              <View style={styles.disclaymoreCheckbox}>
                <BouncyCheckbox
                  size={20}
                  fillColor={Colors.Info}
                  unfillColor="#FFFFFF"
                  isChecked={hideDisclaymore}
                  onPress={checked => {
                    setHideDisclaymore(checked);
                  }}
                  textContainerStyle={{marginLeft: 5}}
                  textStyle={{
                    color: '#000',
                    fontSize: 10,
                    textDecorationLine: 'none',
                  }}
                  text="Do not show this message again."
                />
              </View>
              <TouchableOpacity onPress={disclaymoreClose}>
                <Text style={styles.disclaymoreClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>How does Freeform work?</Text>
          <Text style={styles.footerText}>
            Type or speak freeform text in the box above.
          </Text>
          <Text style={styles.footerText}>
            Freeform is fueled by our state-of-the-art Natural Language
            Processing technology to accurately determine what you ate.
          </Text>
          <Text style={styles.footerText}>
            After you add foods to the Basket, you will have a chance to review
            the foods, change the time you ate them, and change serving sizes
            before adding to your food log.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NaturalForm;
