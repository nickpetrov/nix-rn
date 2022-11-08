// utils
import React from 'react';

// components
import {View, Text, SafeAreaView} from 'react-native';
import appleHealthKit, {HealthPermission} from 'react-native-health';
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

// types
import {ResultSet, Transaction} from 'react-native-sqlite-storage';

export const HealthkitSyncScreen: React.FC = () => {
  const db = useSelector(state => state.base.db);
  const dispatch = useDispatch();
  const syncOptions = useSelector(state => state.connectedApps.hkSyncOptions);

  const toggleHKNutrition = (nutrition: string) => {
    if (nutrition === 'off') {
      db?.transaction((tx: Transaction) => {
        tx.executeSql(
          'DROP TABLE hkdata',
          [],
          (transaction: Transaction, res: ResultSet) => {
            console.log('query DROP TABLE hkdata completed', res);
          },
        );
      });
      // AnalyticsService.trackEvent('HealthKit nutrition sync', 'disable');
    } else {
      //create tables on toggle on; shouldnt exist if toggle off
      db?.transaction((tx: Transaction) => {
        tx.executeSql(
          'CREATE TABLE hkdata (id INTEGER PRIMARY KEY, response TEXT)',
          [],
          (transaction: Transaction, res: ResultSet) => {
            console.log(
              'query CREATE TABLE hkdata (id INTEGER PRIMARY KEY, response TEXT) completed',
              res,
            );
          },
        );
      });

      const hk_types = [
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
      ];

      const permissions = {
        permissions: {
          read: hk_types as HealthPermission[],
          write: hk_types as HealthPermission[],
        },
      };

      appleHealthKit.initHealthKit(permissions, (error, results) => {
        /* Called after we receive a response from the system */
        if (error) {
          console.log(error);
          console.log('failed to request HK nutrition auth');
        } else {
          // AnalyticsService.trackEvent('HealthKit nutrition sync', 'enable');
          console.log('results', results);
          console.log('successfully requested HK nutrition auth');
        }
      });
    }
  };

  function toggleHKWeight(weight: string) {
    if (weight === 'off') {
      db?.transaction((tx: Transaction) => {
        tx.executeSql(
          'DROP TABLE hkdata_weight',
          [],
          (transaction: Transaction, res: ResultSet) => {
            console.log('query DROP TABLE hkdata_weight completed', res);
          },
        );
      });
      // AnalyticsService.trackEvent('HealthKit weight sync', 'disable');
    } else if (weight === 'pull') {
      const permissions = {
        permissions: {
          read: [
            appleHealthKit.Constants.Permissions.BodyMass,
          ] as HealthPermission[],
          write: [
            appleHealthKit.Constants.Permissions.BodyMass,
          ] as HealthPermission[],
        },
      };
      appleHealthKit.initHealthKit(permissions, error => {
        /* Called after we receive a response from the system */
        if (error) {
          console.log(error);
          console.log('failed to request HK weight auth');
        } else {
          // AnalyticsService.trackEvent('HealthKit pull weight sync', 'enable');
          dispatch(pullWeightsFromHK());
          console.log('successfully requested HK weight auth');
        }
      });
    } else {
      db?.transaction((tx: Transaction) => {
        tx.executeSql(
          'CREATE TABLE hkdata_weight (id INTEGER PRIMARY KEY, response TEXT)',
          [],
          (transaction: Transaction, res: ResultSet) => {
            console.log(
              'query CREATE TABLE hkdata_weight (id INTEGER PRIMARY KEY, response TEXT) completed',
              res,
            );
          },
        );
      });
      const permissions = {
        permissions: {
          read: [
            appleHealthKit.Constants.Permissions.BodyMass,
          ] as HealthPermission[],
          write: [
            appleHealthKit.Constants.Permissions.BodyMass,
          ] as HealthPermission[],
        },
      };
      appleHealthKit.initHealthKit(permissions, (error, results) => {
        /* Called after we receive a response from the system */
        if (error) {
          console.log(error);
          console.log('failed to request HK weight auth');
        } else {
          // AnalyticsService.trackEvent('HealthKit push weight sync', 'enable');
          console.log('successfully requested HK weight auth', results);
        }
      });
    }
  }

  const toggleHKExercise = (exercise: string) => {
    if (exercise === 'off') {
      db?.transaction((tx: Transaction) => {
        tx.executeSql(
          'DROP TABLE hkdata_exercise',
          [],
          (transaction: Transaction, res: ResultSet) => {
            console.log('query DROP TABLE hkdata_exercise completed', res);
          },
        );
      });
      // AnalyticsService.trackEvent('HealthKit exercise sync', 'disable');
    } else if (exercise === 'pull') {
      const permissions = {
        permissions: {
          read: [
            appleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          ] as HealthPermission[],
          write: [
            appleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          ] as HealthPermission[],
        },
      };
      appleHealthKit.initHealthKit(permissions, error => {
        /* Called after we receive a response from the system */
        if (error) {
          console.log(error);
          console.log('failed to request HK exercise auth');
        } else {
          // AnalyticsService.trackEvent('HealthKit pull exercise sync', 'enable');
          console.log('successfully requested HK exercise auth');
          console.log('here');
          dispatch(pullExerciseFromHK());
        }
      });
    } else {
      db?.transaction((tx: Transaction) => {
        tx.executeSql(
          'CREATE TABLE hkdata_exercise (id INTEGER PRIMARY KEY, response TEXT)',
          [],
          (transaction: Transaction, res: ResultSet) => {
            console.log(
              'query CREATE TABLE hkdata_exercise (id INTEGER PRIMARY KEY, response TEXT) completed',
              res,
            );
          },
        );
      });
      const permissions = {
        permissions: {
          read: [
            appleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          ] as HealthPermission[],
          write: [
            appleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          ] as HealthPermission[],
        },
      };
      appleHealthKit.initHealthKit(permissions, error => {
        /* Called after we receive a response from the system */
        if (error) {
          console.log(error);
          console.log('failed to request HK exercise auth');
        } else {
          // AnalyticsService.trackEvent('HealthKit push exercise sync', 'enable');
          console.log('successfully requested HK exercise auth');
        }
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
