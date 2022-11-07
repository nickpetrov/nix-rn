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
import {Transaction, ResultSet} from 'react-native-sqlite-storage';
import appleHealthKit, {
  HealthPermission,
  HealthStatusCode,
} from 'react-native-health';

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
  console.log('db', db);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const attrs_to_check = [
        appleHealthKit.Constants.Permissions.EnergyConsumed,
        appleHealthKit.Constants.Permissions.Caffeine,
        appleHealthKit.Constants.Permissions.Calcium,
        appleHealthKit.Constants.Permissions.Carbohydrates,
        appleHealthKit.Constants.Permissions.Cholesterol,
        appleHealthKit.Constants.Permissions.Copper,
        appleHealthKit.Constants.Permissions.FatMonounsaturated,
        appleHealthKit.Constants.Permissions.FatPolyunsaturated,
        appleHealthKit.Constants.Permissions.FatSaturated,
        appleHealthKit.Constants.Permissions.FatTotal,
        appleHealthKit.Constants.Permissions.Fiber,
        appleHealthKit.Constants.Permissions.Iron,
        appleHealthKit.Constants.Permissions.Magnesium,
        appleHealthKit.Constants.Permissions.Manganese,
        appleHealthKit.Constants.Permissions.Niacin,
        appleHealthKit.Constants.Permissions.PantothenicAcid,
        appleHealthKit.Constants.Permissions.Phosphorus,
        appleHealthKit.Constants.Permissions.Potassium,
        appleHealthKit.Constants.Permissions.Protein,
        appleHealthKit.Constants.Permissions.Riboflavin,
        appleHealthKit.Constants.Permissions.Sodium,
        appleHealthKit.Constants.Permissions.Sugar,
        appleHealthKit.Constants.Permissions.Thiamin,
        appleHealthKit.Constants.Permissions.VitaminB6,
        appleHealthKit.Constants.Permissions.VitaminA,
        appleHealthKit.Constants.Permissions.VitaminC,
        appleHealthKit.Constants.Permissions.VitaminD,
        appleHealthKit.Constants.Permissions.VitaminE,
        appleHealthKit.Constants.Permissions.Zinc,
        appleHealthKit.Constants.Permissions.BodyMass,
        appleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      ];

      let turnOffWeightHKSync = true;
      let turnOffExcerciseHKSync = true;
      let turnOffNutritionHKSync = true;

      // go through all attributes and turn off appropriate options if not authorized.
      attrs_to_check.map((attr, index) => {
        const permissions = {
          permissions: {
            read: [attr] as HealthPermission[],
            write: [attr] as HealthPermission[],
          },
        };
        appleHealthKit.getAuthStatus(permissions, (err, results) => {
          console.log(err, results);
          if (
            results.permissions.write[0] === HealthStatusCode.SharingAuthorized
          ) {
            if (attr === appleHealthKit.Constants.Permissions.BodyMass) {
              turnOffWeightHKSync = false;
            } else if (
              attr === appleHealthKit.Constants.Permissions.ActiveEnergyBurned
            ) {
              turnOffExcerciseHKSync = false;
            } else {
              turnOffNutritionHKSync = false;
            }
          }
          // //check if it's last attribute in the list and check for options that sould be disabled.

          if (index === attrs_to_check.length - 1) {
            if (turnOffNutritionHKSync) {
              dispatch(mergeHKSyncOptions({nutrition: 'off'}));
              db.transaction((tx: Transaction) => {
                tx.executeSql(
                  'DROP TABLE hkdata',
                  [],
                  (transaction: Transaction, res: ResultSet) => {
                    console.log('query DROP TABLE hkdata completed', res);
                  },
                );
              });

              // AnalyticsService.trackEvent(
              //   'HealthKit nutrition sync',
              //   'disable',
              // );
            }
            if (turnOffExcerciseHKSync) {
              dispatch(mergeHKSyncOptions({exercise: 'off'}));
              db.transaction((tx: Transaction) => {
                tx.executeSql(
                  'DROP TABLE hkdata_exercise',
                  [],
                  (transaction: Transaction, res: ResultSet) => {
                    console.log(
                      'query DROP TABLE hkdata_exercise completed',
                      res,
                    );
                  },
                );
              });
              // AnalyticsService.trackEvent('HealthKit exercise sync', 'disable');
            }
            if (turnOffWeightHKSync) {
              dispatch(mergeHKSyncOptions({weight: 'off'}));
              db.transaction((tx: Transaction) => {
                tx.executeSql(
                  'DROP TABLE hkdata_weight',
                  [],
                  (transaction: Transaction, res: ResultSet) => {
                    console.log(
                      'query DROP TABLE hkdata_weight completed',
                      res,
                    );
                  },
                );
              });
              // AnalyticsService.trackEvent('HealthKit weight sync', 'disable');
            }
          }
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
