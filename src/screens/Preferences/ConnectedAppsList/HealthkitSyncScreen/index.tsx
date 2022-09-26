// utils
import React, {useState} from 'react';

// components
import {View, Text, SafeAreaView} from 'react-native';
import AppleHealthKit, {
  HealthPermission,
  HealthKitPermissions,
} from 'react-native-health';
import {Picker} from '@react-native-picker/picker';

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
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Nutrition:</Text>
          <Picker
            style={styles.picker}
            selectedValue={syncOptions.nutrition}
            onValueChange={(newVal: string) => {
              setSyncOptions(prev => ({...prev, nutrition: newVal}));
              adjustSync('nutrition');
            }}>
            {[
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
            ].map((item: {label: string; value: string}) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Weight:</Text>
          <Picker
            style={styles.picker}
            selectedValue={
              syncOptions.weight === 'push'
                ? 'Push'
                : syncOptions.weight === 'pull'
                ? 'Pull'
                : 'Off'
            }
            onValueChange={(newVal: string) => {
              setSyncOptions(prev => ({...prev, weight: newVal}));
              adjustSync('weight');
            }}>
            {[
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
            ].map((item: {label: string; value: string}) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Exercise Calories:</Text>
          <Picker
            style={styles.picker}
            selectedValue={
              syncOptions.exercise === 'push'
                ? 'Push'
                : syncOptions.exercise === 'pull'
                ? 'Pull'
                : 'Off'
            }
            onValueChange={(newVal: string) => {
              setSyncOptions(prev => ({...prev, exercise: newVal}));
              adjustSync('exercise');
            }}>
            {[
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
            ].map((item: {label: string; value: string}) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>

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
