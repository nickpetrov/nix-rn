// utils
import React from 'react';

// components
import {View, Text, SafeAreaView} from 'react-native';
import AppleHealthKit, {
  HealthPermission,
  HealthKitPermissions,
} from 'react-native-health';
import ModalSelector from 'react-native-modal-selector';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixInput} from 'components/NixInput';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {mergeHKSyncOptions} from 'store/connectedApps/connectedApps.actions';

// styles
import {styles} from './HealthkitSyncScreen.styles';

export const HealthkitSyncScreen: React.FC = () => {
  // const userData = useSelector(state => state.auth.userData);
  // const fitbitSync = userData.oauths.filter(
  //   item => item.provider == 'healthkit',
  // )[0];
  const dispatch = useDispatch();
  const syncOptions = useSelector(state => state.connectedApps.hkSyncOptions);

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
    //с; shouldnt exist if toggle off
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
        style={{marginBottom: 10}}
        initValue={syncOptions.nutrition}
        onChange={option => {
          dispatch(mergeHKSyncOptions({nutrition: option.value}));
          adjustSync('nutrition');
        }}
        listType="FLATLIST"
        keyExtractor={(item: {label: string; value: string}) => item.value}>
        <View style={styles.pickerContainer}>
          <NixInput
            label="Nutrition"
            style={{textAlign: 'right'}}
            labelContainerStyle={styles.labelContainerStyle}
            value={
              syncOptions.nutrition.charAt(0).toUpperCase() +
              syncOptions.nutrition.slice(1)
            }
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
        style={{marginBottom: 10}}
        initValue={syncOptions.weight}
        onChange={option => {
          dispatch(mergeHKSyncOptions({weight: option.value}));
          adjustSync('weight');
        }}
        listType="FLATLIST"
        keyExtractor={(item: {label: string; value: string}) => item.value}>
        <View style={styles.pickerContainer}>
          <NixInput
            label="Weight"
            style={{textAlign: 'right'}}
            labelContainerStyle={styles.labelContainerStyle}
            value={
              syncOptions.weight.charAt(0).toUpperCase() +
              syncOptions.weight.slice(1)
            }
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
          dispatch(mergeHKSyncOptions({exercise: option.value}));
          adjustSync('exercise');
        }}
        listType="FLATLIST"
        keyExtractor={(item: {label: string; value: string}) => item.value}>
        <View style={styles.pickerContainer}>
          <NixInput
            label="Exercise Calories"
            style={{textAlign: 'right'}}
            labelContainerStyle={styles.labelContainerStyle}
            value={
              syncOptions.exercise.charAt(0).toUpperCase() +
              syncOptions.exercise.slice(1)
            }
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
            Nutritionix will pull-in the data you have stored in other services.
            Use this option when a 3rd party app is the summary source of this
            data.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
