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

// constants
import {Routes} from 'navigation/Routes';

//types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// styles
import {styles} from './ConnectedAppsScreen.styles';
import {Colors} from 'constants/Colors';
import appleHealthKit, {HealthPermission} from 'react-native-health';

interface ConnectedAppsScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.ConnectedApps
  >;
}

export const ConnectedAppsScreen: React.FC<ConnectedAppsScreenProps> = ({
  navigation,
}) => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const attrs_to_check = [
        HealthPermission.EnergyConsumed,
        HealthPermission.Caffeine,
        HealthPermission.Calcium,
        HealthPermission.Carbohydrates,
        HealthPermission.Cholesterol,
        HealthPermission.Copper,
        HealthPermission.FatMonounsaturated,
        HealthPermission.FatPolyunsaturated,
        HealthPermission.FatSaturated,
        HealthPermission.FatTotal,
        HealthPermission.Fiber,
        HealthPermission.Iron,
        HealthPermission.Magnesium,
        HealthPermission.Manganese,
        HealthPermission.Niacin,
        HealthPermission.PantothenicAcid,
        HealthPermission.Phosphorus,
        HealthPermission.Potassium,
        HealthPermission.Protein,
        HealthPermission.Riboflavin,
        HealthPermission.Sodium,
        HealthPermission.Sugar,
        HealthPermission.Thiamin,
        HealthPermission.VitaminB6,
        HealthPermission.VitaminA,
        HealthPermission.VitaminC,
        HealthPermission.VitaminD,
        HealthPermission.VitaminE,
        HealthPermission.Zinc,
        HealthPermission.BodyMass,
        HealthPermission.ActiveEnergyBurned,
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
          // if (res === 'authorized') {
          //   if (attr === 'HKQuantityTypeIdentifierBodyMass') {
          //     turnOffWeightHKSync = false;
          //   } else if (attr === 'HKQuantityTypeIdentifierActiveEnergyBurned') {
          //     turnOffExcerciseHKSync = false;
          //   } else {
          //     turnOffNutritionHKSync = false;
          //   }
          // }
          // //check if it's last attribute in the list and check for options that sould be disabled.

          // if (index === attrs_to_check.length - 1) {
          //   if (turnOffNutritionHKSync) {
          //     $rootScope.hk.nutrition = 'off';
          //     $cordovaSQLite.execute(window.db, 'DROP TABLE hkdata');
          //     AnalyticsService.trackEvent(
          //       'HealthKit nutrition sync',
          //       'disable',
          //     );
          //   }
          //   if (turnOffExcerciseHKSync) {
          //     $rootScope.hk.exercise = 'off';
          //     $cordovaSQLite.execute(window.db, 'DROP TABLE hkdata_exercise');
          //     AnalyticsService.trackEvent('HealthKit exercise sync', 'disable');
          //   }
          //   if (turnOffWeightHKSync) {
          //     $rootScope.hk.weight = 'off';
          //     $cordovaSQLite.execute(window.db, 'DROP TABLE hkdata_weight');
          //     AnalyticsService.trackEvent('HealthKit weight sync', 'disable');
          //   }
          //   window.localStorage.setItem(
          //     'healthkit',
          //     angular.toJson($rootScope.hk),
          //   );
          // }
        });
      });
    }
  }, []);
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
