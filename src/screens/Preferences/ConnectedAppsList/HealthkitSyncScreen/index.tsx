// utils
import React, {useState} from 'react';

// components
import {View, Text, SafeAreaView} from 'react-native';
import AppleHealthKit, {
  HealthPermission,
  HealthKitPermissions,
} from 'react-native-health';
import ModalSelector from 'react-native-modal-selector';

// hooks
// import {useSelector} from 'hooks/useRedux';

// styles
import {styles} from './HealthkitSyncScreen.styles';

export const HealthkitSyncScreen: React.FC = () => {
  // const userData = useSelector(state => state.auth.userData);
  // const fitbitSync = userData.oauths.filter(
  //   item => item.provider == 'healthkit',
  // )[0];
  const [syncOptions, setSyncOptions] = useState({
    // three choices: push/pull/off
    nutrition: 'off',
    weight: 'off',
    exercise: 'off',
  });

  const adjustSync = (option: string) => {
    console.log(syncOptions);
    let permissions: HealthKitPermissions = {
      permissions: {
        read: [],
        write: [],
      },
    };
    // if (syncOptions.nutrition == 'off') {
    //   // $cordovaSQLite
    //   //   .execute(window.db, 'DROP TABLE hkdata');
    // } else {
    if (option === 'nutrition') {
      /* Permission options */
    } else if (option === 'weight') {
      permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.Weight,
          ] as HealthPermission[],
          write: [
            AppleHealthKit.Constants.Permissions.Weight,
          ] as HealthPermission[],
        },
      };
    } else if (option === 'exercise') {
    }

    AppleHealthKit.initHealthKit(permissions, error => {
      /* Called after we receive a response from the system */
      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }

      /* Can now read or write to HealthKit */

      const options = {
        startDate: new Date(2020, 1, 1).toISOString(),
      };

      AppleHealthKit.getWeightSamples(options, (callbackError, results) => {
        /* Samples are now collected from HealthKit */
        console.log(results);
      });
    });
    //create tables on toggle on; shouldnt exist if toggle off
    // $cordovaSQLite
    //   .execute(window.db, 'CREATE TABLE hkdata (id INTEGER PRIMARY KEY, response TEXT)');

    //   const hk_types = [
    //     'HKQuantityTypeIdentifierDietaryEnergyConsumed',
    //     'HKQuantityTypeIdentifierDietaryCaffeine',
    //     'HKQuantityTypeIdentifierDietaryCalcium',
    //     'HKQuantityTypeIdentifierDietaryCarbohydrates',
    //     'HKQuantityTypeIdentifierDietaryCholesterol',
    //     'HKQuantityTypeIdentifierDietaryCopper',
    //     'HKQuantityTypeIdentifierDietaryFatMonounsaturated',
    //     'HKQuantityTypeIdentifierDietaryFatPolyunsaturated',
    //     'HKQuantityTypeIdentifierDietaryFatSaturated',
    //     'HKQuantityTypeIdentifierDietaryFatTotal',
    //     'HKQuantityTypeIdentifierDietaryFiber',
    //     'HKQuantityTypeIdentifierDietaryIron',
    //     'HKQuantityTypeIdentifierDietaryMagnesium',
    //     'HKQuantityTypeIdentifierDietaryManganese',
    //     'HKQuantityTypeIdentifierDietaryNiacin',
    //     'HKQuantityTypeIdentifierDietaryPantothenicAcid',
    //     'HKQuantityTypeIdentifierDietaryPhosphorus',
    //     'HKQuantityTypeIdentifierDietaryPotassium',
    //     'HKQuantityTypeIdentifierDietaryProtein',
    //     'HKQuantityTypeIdentifierDietaryRiboflavin',
    //     'HKQuantityTypeIdentifierDietarySodium',
    //     'HKQuantityTypeIdentifierDietarySugar',
    //     'HKQuantityTypeIdentifierDietaryThiamin',
    //     'HKQuantityTypeIdentifierDietaryVitaminB6',
    //     'HKQuantityTypeIdentifierDietaryVitaminA',
    //     'HKQuantityTypeIdentifierDietaryVitaminC',
    //     'HKQuantityTypeIdentifierDietaryVitaminD',
    //     'HKQuantityTypeIdentifierDietaryVitaminE',
    //     'HKQuantityTypeIdentifierDietaryZinc'
    //   ];

    //   window.plugins.healthkit.requestAuthorization({
    //     readTypes : hk_types,
    //     writeTypes: hk_types
    //   },
    //   function() {
    //     AnalyticsService.trackEvent('HealthKit nutrition sync', 'enable');
    //     console.log('successfully requested HK nutrition auth');
    //   },
    //   function(err) {
    //     console.log(angular.toJson(err));
    //     console.log('failed to request HK nutrition auth');
    //   });
    // }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Healthkit</Text>
      </View>

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
          initValue={syncOptions.nutrition}
          onChange={option => {
            setSyncOptions(prev => ({...prev, nutrition: option.value}));
            adjustSync('nutrition');
          }}
          listType="FLATLIST"
          keyExtractor={(item: {label: string; value: string}) => item.value}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Nutrition:</Text>
            <Text>
              {syncOptions.nutrition.charAt(0).toUpperCase() +
                syncOptions.nutrition.slice(1)}
            </Text>
          </View>
        </ModalSelector>
        <ModalSelector
          data={[
            {
              label: 'Push',
              value: 'push',
              key: 'push',
            },
            {
              label: 'Pull',
              value: 'pull',
              key: 'pull',
            },
            {
              label: 'Off',
              value: 'off',
              key: 'off',
            },
          ]}
          initValue={syncOptions.weight}
          onChange={option => {
            setSyncOptions(prev => ({...prev, weight: option.value}));
            adjustSync('weight');
          }}
          listType="FLATLIST"
          keyExtractor={(item: {label: string; value: string}) => item.value}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Weight:</Text>
            <Text>
              {syncOptions.weight.charAt(0).toUpperCase() +
                syncOptions.weight.slice(1)}
            </Text>
          </View>
        </ModalSelector>
        <ModalSelector
          data={[
            {
              label: 'Push',
              value: 'push',
              key: 'push',
            },
            {
              label: 'Pull',
              value: 'pull',
              key: 'pull',
            },
            {
              label: 'Off',
              value: 'off',
              key: 'off',
            },
          ]}
          initValue={syncOptions.exercise}
          onChange={option => {
            setSyncOptions(prev => ({...prev, exercise: option.value}));
            adjustSync('exercise');
          }}
          listType="FLATLIST"
          keyExtractor={(item: {label: string; value: string}) => item.value}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Exercise Calories:</Text>
            <Text>
              {syncOptions.exercise.charAt(0).toUpperCase() +
                syncOptions.exercise.slice(1)}
            </Text>
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
            Nutritionix will pull-in the data you have stored in other services.
            Use this option when a 3rd party app is the summary source of this
            data.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
