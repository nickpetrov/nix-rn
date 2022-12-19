// utils
import React, {useEffect} from 'react';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {mergeHKSyncOptions} from 'store/connectedApps/connectedApps.actions';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

//types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// styles
import {styles} from './ConnectedAppsScreen.styles';
import appleHealthKit, {
  HKQuantityTypeIdentifier,
  HKAuthorizationRequestStatus,
} from 'hk';

// helpers
import {SQLexecute} from 'helpers/sqlite';
import {analyticTrackEvent} from 'helpers/analytics.ts';

interface ConnectedAppsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.ConnectedApps
  >;
}

export const ConnectedAppsScreen: React.FC<ConnectedAppsScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const db = useSelector(state => state.base.db);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const attrs_to_check = [
        HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        HKQuantityTypeIdentifier.dietaryCaffeine,
        HKQuantityTypeIdentifier.dietaryCalcium,
        HKQuantityTypeIdentifier.dietaryCarbohydrates,
        HKQuantityTypeIdentifier.dietaryCholesterol,
        HKQuantityTypeIdentifier.dietaryCopper,
        HKQuantityTypeIdentifier.dietaryFatMonounsaturated,
        HKQuantityTypeIdentifier.dietaryFatPolyunsaturated,
        HKQuantityTypeIdentifier.dietaryFatSaturated,
        HKQuantityTypeIdentifier.dietaryFatTotal,
        HKQuantityTypeIdentifier.dietaryFiber,
        HKQuantityTypeIdentifier.dietaryIron,
        HKQuantityTypeIdentifier.dietaryMagnesium,
        HKQuantityTypeIdentifier.dietaryManganese,
        HKQuantityTypeIdentifier.dietaryNiacin,
        HKQuantityTypeIdentifier.dietaryPantothenicAcid,
        HKQuantityTypeIdentifier.dietaryPhosphorus,
        HKQuantityTypeIdentifier.dietaryPotassium,
        HKQuantityTypeIdentifier.dietaryProtein,
        HKQuantityTypeIdentifier.dietaryRiboflavin,
        HKQuantityTypeIdentifier.dietarySodium,
        HKQuantityTypeIdentifier.dietarySugar,
        HKQuantityTypeIdentifier.dietaryThiamin,
        HKQuantityTypeIdentifier.dietaryVitaminB6,
        HKQuantityTypeIdentifier.dietaryVitaminA,
        HKQuantityTypeIdentifier.dietaryVitaminC,
        HKQuantityTypeIdentifier.dietaryVitaminD,
        HKQuantityTypeIdentifier.dietaryVitaminE,
        HKQuantityTypeIdentifier.dietaryZinc,
        HKQuantityTypeIdentifier.bodyMass,
        HKQuantityTypeIdentifier.activeEnergyBurned,
      ];

      let turnOffWeightHKSync = true;
      let turnOffExcerciseHKSync = true;
      let turnOffNutritionHKSync = true;

      // go through all attributes and turn off appropriate options if not authorized.
      attrs_to_check.map((attr, index) => {
        const readPermissions = [attr];
        const writePermissions = [attr];
        appleHealthKit
          .getRequestStatusForAuthorization(readPermissions, writePermissions)
          .then(results => {
            if (
              // HealthStatusCode.SharingAuthorized = 2 - some error on ios when use HealthStatusCode.SharingAuthorized
              results === HKAuthorizationRequestStatus.unnecessary
            ) {
              if (attr === HKQuantityTypeIdentifier.bodyMass) {
                turnOffWeightHKSync = false;
              } else if (attr === HKQuantityTypeIdentifier.activeEnergyBurned) {
                turnOffExcerciseHKSync = false;
              } else {
                turnOffNutritionHKSync = false;
              }
            }
            // //check if it's last attribute in the list and check for options that sould be disabled.

            if (index === attrs_to_check.length - 1) {
              if (turnOffNutritionHKSync) {
                dispatch(mergeHKSyncOptions({nutrition: 'off'}));
                SQLexecute({db, query: 'DROP TABLE hkdata'});
                analyticTrackEvent('HealthKit_nutrition_sync', 'disable');
              }
              if (turnOffExcerciseHKSync) {
                dispatch(mergeHKSyncOptions({exercise: 'off'}));
                SQLexecute({db, query: 'DROP TABLE hkdata_exercise'});
                analyticTrackEvent('HealthKit_exercise_sync', 'disable');
              }
              if (turnOffWeightHKSync) {
                dispatch(mergeHKSyncOptions({weight: 'off'}));
                SQLexecute({db, query: 'DROP TABLE hkdata_weight'});
                analyticTrackEvent('HealthKit_weight_sync', 'disable');
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  }, [dispatch, db]);
  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate(Routes.FitbitSync)}>
        <View style={styles.item}>
          <View style={styles.left}>
            <Image style={styles.image} source={require('assets/fitbit.png')} />
            <Text style={styles.text}>Fitbit</Text>
          </View>
          <Ionicons name="chevron-forward" color={Colors.Gray6} size={30} />
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === 'ios' ? (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(Routes.HealthkitSync)}>
          <View style={styles.item}>
            <View style={styles.left}>
              <Ionicons
                name="ios-medical-outline"
                color={Colors.Gray6}
                size={30}
                style={styles.image}
              />
              <Text style={styles.text}>Healthkit</Text>
            </View>
            <Ionicons name="chevron-forward" color={Colors.Gray6} size={30} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      <Text style={styles.note}>More integrations coming soon.</Text>
    </SafeAreaView>
  );
};
