// utils
import React from 'react';

// components
import {View, Text, SafeAreaView} from 'react-native';
import appleHealthKit, {HKQuantityTypeIdentifier} from 'hk';
import ModalSelector from 'react-native-modal-selector';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixInput} from 'components/NixInput';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {
  mergeHKSyncOptions,
  pullExerciseFromHK,
  pullWeightsFromHK,
} from 'store/connectedApps/connectedApps.actions';

// styles
import {styles} from './HealthkitSyncScreen.styles';

// helpers
import {SQLexecute} from 'helpers/sqlite';
import {analyticTrackEvent} from 'helpers/analytics.ts';

export const HealthkitSyncScreen: React.FC = () => {
  const db = useSelector(state => state.base.db);
  const dispatch = useDispatch();
  const syncOptions = useSelector(state => state.connectedApps.hkSyncOptions);

  const toggleHKNutrition = (nutrition: string) => {
    if (nutrition === 'off') {
      SQLexecute({db, query: 'DROP TABLE hkdata'});
      analyticTrackEvent('HealthKit_nutrition_sync', 'disable');
    } else {
      //create tables on toggle on; shouldnt exist if toggle off
      SQLexecute({
        db,
        query: 'CREATE TABLE hkdata (id INTEGER PRIMARY KEY, response TEXT)',
      });

      const hk_types = [
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
      ];

      const permissions = {
        read: hk_types,
        write: hk_types,
      };

      appleHealthKit
        .requestAuthorization(permissions.read, permissions.write)
        .then(results => {
          analyticTrackEvent('HealthKit_nutrition_sync', 'enable');
          console.log('results', results);
          console.log('successfully requested HK nutrition auth');
        })
        .catch(error => {
          console.log(error);
          console.log('failed to request HK nutrition auth');
        });
    }
  };

  function toggleHKWeight(weight: string) {
    if (weight === 'off') {
      SQLexecute({db, query: 'DROP TABLE hkdata_weight'});
      analyticTrackEvent('HealthKit_weight_sync', 'disable');
    } else if (weight === 'pull') {
      const permissions = {
        read: [HKQuantityTypeIdentifier.bodyMass],
        write: [HKQuantityTypeIdentifier.bodyMass],
      };
      appleHealthKit
        .requestAuthorization(permissions.read, permissions.write)
        .then(() => {
          analyticTrackEvent('HealthKit_pull_weight_sync', 'enable');
          dispatch(pullWeightsFromHK());
          console.log('successfully requested HK weight auth');
        })
        .catch(error => {
          console.log(error);
          console.log('failed to request HK weight auth');
        });
    } else {
      SQLexecute({
        db,
        query:
          'CREATE TABLE hkdata_weight (id INTEGER PRIMARY KEY, response TEXT)',
      });
      const permissions = {
        read: [HKQuantityTypeIdentifier.bodyMass],
        write: [HKQuantityTypeIdentifier.bodyMass],
      };
      appleHealthKit
        .requestAuthorization(permissions.read, permissions.write)
        .then(results => {
          analyticTrackEvent('HealthKit_push_weight_sync', 'enable');
          console.log('successfully requested HK weight auth', results);
        })
        .catch(error => {
          console.log(error);
          console.log('failed to request HK weight auth');
        });
    }
  }

  const toggleHKExercise = (exercise: string) => {
    if (exercise === 'off') {
      SQLexecute({db, query: 'DROP TABLE hkdata_exercise'});
      analyticTrackEvent('HealthKit_exercise_sync', 'disable');
    } else if (exercise === 'pull') {
      const permissions = {
        read: [HKQuantityTypeIdentifier.activeEnergyBurned],
        write: [HKQuantityTypeIdentifier.activeEnergyBurned],
      };
      appleHealthKit
        .requestAuthorization(permissions.read, permissions.write)
        .then(() => {
          analyticTrackEvent('HealthKit_pull_exercise_sync', 'enable');
          console.log('successfully requested HK exercise auth');
          console.log('here');
          dispatch(pullExerciseFromHK());
        })
        .catch(error => {
          console.log(error);
          console.log('failed to request HK exercise auth');
        });
    } else {
      SQLexecute({
        db,
        query:
          'CREATE TABLE hkdata_exercise (id INTEGER PRIMARY KEY, response TEXT)',
      });
      const permissions = {
        read: [HKQuantityTypeIdentifier.activeEnergyBurned],
        write: [HKQuantityTypeIdentifier.activeEnergyBurned],
      };
      appleHealthKit
        .requestAuthorization(permissions.read, permissions.write)
        .then(() => {
          analyticTrackEvent('HealthKit_push_exercise_sync', 'enable');
          console.log('successfully requested HK exercise auth');
        })
        .catch(error => {
          console.log(error);
          console.log('failed to request HK exercise auth');
        });
    }
  };

  const adjustSync = (option: string, value: string) => {
    if (option === 'nutrition') {
      toggleHKNutrition(value);
    } else if (option === 'weight') {
      toggleHKWeight(value);
    } else if (option === 'exercise') {
      toggleHKExercise(value);
    }
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
          adjustSync('nutrition', option.value);
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
          adjustSync('weight', option.value);
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
          adjustSync('exercise', option.value);
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
