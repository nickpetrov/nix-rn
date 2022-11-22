// utils
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import moment from 'moment-timezone';
import {useNetInfo} from '@react-native-community/netinfo';
import SQLite from 'react-native-sqlite-storage';

// components
import {
  Text,
  View,
  RefreshControl,
  SectionList,
  TouchableHighlight,
  Platform,
} from 'react-native';
import BasketButton from 'components/BasketButton';
import Footer from 'components/Footer';
import {NavigationHeader} from 'components/NavigationHeader';
import DrawerButton from 'components/DrawerButton';
import ExerciseModal from 'components/FoodLog/ExerciseModal';
import WeightModal from 'components/FoodLog/WeightModal';
import WaterModal from 'components/FoodLog/WaterModal';
import MealListItem from 'components/FoodLog//MealListItem';
import FoodLogHeader from 'components/FoodLog/FoodLogHeader';
import EmptyListItem from 'components/FoodLog/EmptyListItem';
import ExerciseListItem from 'components/FoodLog/ExerciseListItem';
import WaterListItem from 'components/FoodLog/WaterListItem';
import FoodLogSectionHeader from 'components/FoodLog/FoodLogSectionHeader';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeFoodLogHiddenItems from 'components/FoodLog/SwipeFoodLogHiddenItems';
import SwipeHiddenButtons from 'components/SwipeHiddenButtons';
import ChooseModal from 'components/ChooseModal';
import WeighInListItem from 'components/FoodLog/WeighInListItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import useLocalNotification from 'hooks/useLocalNotification';

// actinos
import * as userLogActions from 'store/userLog/userLog.actions';
import {addExistFoodToBasket} from 'store/basket/basket.actions';
import {setDB} from 'store/base/base.actions';

// constant
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {
  ExerciseProps,
  foodLogSections,
  FoodProps,
  mealById,
  mealNameProps,
  TotalProps,
  WeightProps,
} from 'store/userLog/userLog.types';
import {mealTypes} from 'store/basket/basket.types';

// styles
import {styles} from './DashboardScreen.styles';
import {Colors} from 'constants/Colors';

interface DashboardScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Dashboard
  >;
  route: RouteProp<StackNavigatorParamList, Routes.Dashboard>;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
}) => {
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const [deleteteModal, setDeleteteModal] = useState<
    {items: Array<FoodProps>; mealName: keyof mealTypes} | false
  >(false);
  const {foods, totals, selectedDate, weights, exercises} = useSelector(
    state => state.userLog,
  );
  const db = useSelector(state => state.base.db);
  let rowRefs = new Map<string | mealTypes, Swipeable>();
  const userData = useSelector(state => state.auth.userData);
  const uncompletedProfile =
    !userData.weight_kg ||
    !userData.height_cm ||
    !userData.gender ||
    !userData.birth_year;
  const consumedWater = totals.find(
    (item: TotalProps) => item.date === selectedDate,
  )?.water_consumed_liter;
  const selectedDay: {
    totals: TotalProps;
  } = {
    totals:
      totals.filter(
        (dayTotal: TotalProps) => dayTotal.date === selectedDate,
      )[0] || {},
  };

  const sections = useMemo(() => {
    // create empty sections
    const arr: {data: any; key: mealNameProps}[] = [
      {key: foodLogSections.Breakfast, data: []},
      {key: foodLogSections.Lunch, data: []},
      {key: foodLogSections.Dinner, data: []},
    ];

    // add data to sections
    foods
      .filter(
        (item: FoodProps) =>
          moment(item.consumed_at).format('YYYY-MM-DD') === selectedDate,
      )
      .map((item: FoodProps) => {
        const index = arr.findIndex(
          (el: any) =>
            el.key === mealById[item.meal_type as keyof typeof mealById],
        );
        if (index !== -1) {
          arr[index].data.push(item);
        } else {
          arr.push({
            data: [item],
            key: mealById[item.meal_type as keyof typeof mealById],
          });
        }
      });
    // add Snack section if no AM Snack || PM Snack || Late Snack found at foods
    if (
      !arr.some(
        item =>
          item.key === foodLogSections.AM_Snack ||
          item.key === foodLogSections.PM_Snack ||
          item.key === foodLogSections.Late_Snack,
      )
    ) {
      arr.push({key: foodLogSections.Snack, data: []});
    }

    // add weights section
    arr.push({
      key: foodLogSections.Weigh_in,
      data: weights.filter(
        (item: WeightProps) =>
          moment(item.timestamp).format('YYYY-MM-DD') === selectedDate,
      ),
    });

    // add exercise section
    arr.push({
      key: foodLogSections.Exercise,
      data: exercises.filter(
        (item: ExerciseProps) =>
          moment(item.timestamp).format('YYYY-MM-DD') === selectedDate,
      ),
    });

    // add water section
    arr.push({
      key: foodLogSections.Water,
      data: consumedWater ? [{consumed: consumedWater, id: consumedWater}] : [],
    });

    return arr;
  }, [foods, selectedDate, weights, exercises, consumedWater]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [excerciseModal, setExcerciseModal] = useState<ExerciseProps | null>(
    null,
  );
  const [weightModal, setWeightModal] = useState<WeightProps | null>(null);
  const [watertModal, setWaterModal] = useState<boolean>(false);
  useLocalNotification({
    weekday: userData.weekday_reminders_enabled,
    weekend: userData.weekend_reminders_enabled,
  });

  const refreshFoodLog = useCallback(() => {
    setIsRefreshing(true);
    dispatch(userLogActions.refreshLog(selectedDate, userData.timezone)).then(
      () => setIsRefreshing(false),
    );
  }, [dispatch, selectedDate, userData.timezone]);

  useEffect(() => {
    refreshFoodLog();
  }, [refreshFoodLog]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <NavigationHeader
          {...props}
          withAutoComplete
          headerRight={
            <BasketButton
              icon="shopping-basket"
              withCount
              onPress={() => navigation.navigate(Routes.Basket)}
            />
          }
          headerLeft={<DrawerButton navigation={props.navigation} />}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!db?.transaction) {
      dispatch(
        setDB(
          SQLite.openDatabase(
            {
              name: 'track_db',
              // createFromLocation: 1,
              location: Platform.OS === 'ios' ? 'default' : 'Shared',
            },
            () => {
              console.log('Re-open connection success!');
            },
            error => {
              console.log('error open db', error);
            },
          ),
        ),
      );
    }
  }, [db, dispatch]);

  const getEmptySectionText = (key: string) => {
    let noLoggedDataText = 'No foods logged yet.';
    if (key === foodLogSections.Exercise) {
      noLoggedDataText = 'No exercises logged yet.';
    } else if (key === foodLogSections.Weigh_in) {
      noLoggedDataText = 'No weights logged yet.';
    } else if (key === foodLogSections.Water) {
      noLoggedDataText = userData.measure_system === 1 ? '0 L' : '0 oz';
    }

    return noLoggedDataText;
  };

  const handleChooseCategory = (name: string) => {
    switch (name) {
      case foodLogSections.Snack:
        return navigation.navigate(Routes.Autocomplete, {
          mealType: mealTypes[foodLogSections.AM_Snack],
        });
      case foodLogSections.Exercise:
        return setExcerciseModal({name: ''} as ExerciseProps);
      case foodLogSections.Weigh_in:
        return setWeightModal({kg: 0} as WeightProps);
      case foodLogSections.Water:
        return setWaterModal(true);
      default:
        return navigation.navigate(Routes.Autocomplete, {
          mealType: mealTypes[name as keyof typeof mealTypes],
        });
    }
  };

  return (
    <View style={styles.layout}>
      <SectionList
        listKey="rootFoodList"
        sections={sections}
        keyExtractor={(item: any) => item.id}
        ListHeaderComponent={() => (
          <>
            {!netInfo.isConnected && (
              <View style={styles.offline}>
                <View style={styles.offlineContainer}>
                  <Text style={styles.offlineText}>Offline Mode</Text>
                </View>
              </View>
            )}
            <FoodLogHeader
              caloriesLimit={selectedDay.totals.daily_kcal_limit || 0}
              caloriesBurned={selectedDay.totals.total_cal_burned || 0}
              caloriesIntake={selectedDay.totals.total_cal || 0}
              protein={selectedDay.totals.total_proteins || 0}
              carbohydrates={selectedDay.totals.total_carbs || 0}
              fat={selectedDay.totals.total_fat || 0}
              foods={foods.filter(
                (item: FoodProps) =>
                  moment(item.consumed_at).format('YYYY-MM-DD') ===
                  selectedDate,
              )}
            />
          </>
        )}
        renderSectionHeader={({section}) => {
          const mealType =
            section.key !== foodLogSections.Exercise &&
            section.key !== foodLogSections.Weigh_in &&
            section.key !== foodLogSections.Water
              ? mealTypes[section.key as keyof typeof mealTypes]
              : undefined;
          const foodList =
            section.key !== foodLogSections.Exercise &&
            section.key !== foodLogSections.Weigh_in &&
            section.key !== foodLogSections.Water
              ? [...section.data]
              : undefined;
          return mealType ? (
            <Swipeable
              containerStyle={styles.swipeItemContainer}
              renderRightActions={() =>
                section.data.length ? (
                  <SwipeHiddenButtons
                    buttons={[
                      {
                        type: 'delete',
                        onPress: () => {
                          setDeleteteModal({
                            items: section.data,
                            mealName: section.key as keyof mealTypes,
                          });
                        },
                      },
                      {
                        type: 'copy',
                        onPress: () => {
                          dispatch(addExistFoodToBasket(section.data)).then(
                            () => {
                              // close all swipes after copy
                              [...rowRefs.values()].forEach(ref => {
                                if (ref) {
                                  ref.close();
                                }
                              });
                              navigation.navigate(Routes.Basket);
                            },
                          );
                        },
                      },
                    ]}
                  />
                ) : undefined
              }
              ref={ref => {
                if (ref && !rowRefs.get(mealType)) {
                  rowRefs.set(mealType, ref);
                }
              }}
              onSwipeableWillOpen={() => {
                [...rowRefs.entries()].forEach(([key, ref]) => {
                  if (key !== mealType && ref) {
                    ref.close();
                  }
                });
              }}>
              <FoodLogSectionHeader
                title={section.key || ''}
                mealType={mealType}
                foods={foodList}
                onPress={() => handleChooseCategory(section.key || '')}
              />
            </Swipeable>
          ) : (
            <FoodLogSectionHeader
              title={section.key || ''}
              mealType={mealType}
              foods={foodList}
              onPress={() => handleChooseCategory(section.key || '')}
            />
          );
        }}
        renderSectionFooter={({section}) => {
          return (
            <>
              {section.data.length === 0 ? (
                <EmptyListItem
                  type={
                    section.key === foodLogSections.Water ? 'full' : undefined
                  }
                  text={getEmptySectionText(section.key || '')}
                />
              ) : null}
              {section.key === foodLogSections.Water && (
                <TouchableHighlight
                  onPress={() =>
                    navigation.navigate(Routes.Totals, {foods, type: 'daily'})
                  }>
                  <View style={styles.summary}>
                    <FontAwesome name="pie-chart" color="#666" size={18} />
                    <Text style={styles.summaryText}>View Daily Summary</Text>
                  </View>
                </TouchableHighlight>
              )}
              {section.key === foodLogSections.Exercise && uncompletedProfile && (
                <View style={styles.summary}>
                  <Text>
                    Complete your profile{' '}
                    <Text
                      style={{color: Colors.Info}}
                      onPress={() => navigation.navigate(Routes.Profile)}>
                      here
                    </Text>{' '}
                    for more accurate exercise tracking
                  </Text>
                </View>
              )}
            </>
          );
        }}
        renderItem={({item, index, section}: any) => {
          const VisibleComponent = () => {
            if (
              section.key !== foodLogSections.Exercise &&
              section.key !== foodLogSections.Weigh_in &&
              section.key !== foodLogSections.Water
            ) {
              return (
                <MealListItem
                  foodObj={item}
                  navigation={navigation}
                  mealName={mealById[item.mealType as keyof typeof mealById]}
                  withArrow
                />
              );
            } else if (section.key === foodLogSections.Exercise) {
              return (
                <ExerciseListItem
                  last={exercises?.length - 1 === index}
                  exercise={item}
                  onPress={() => setExcerciseModal(item)}
                />
              );
            } else if (section.key === foodLogSections.Weigh_in) {
              return (
                <WeighInListItem
                  item={item}
                  onPress={() => setWeightModal(item)}
                  measure_system={userData.measure_system}
                />
              );
            } else if (section.key === foodLogSections.Water) {
              return (
                <WaterListItem
                  onPress={() => setWaterModal(true)}
                  measure_system={userData.measure_system}
                  consumed={item.consumed}
                />
              );
            } else {
              return null;
            }
          };

          return (
            <Swipeable
              containerStyle={styles.swipeItemContainer}
              renderRightActions={() => (
                <SwipeFoodLogHiddenItems
                  foodLogSection={section.key}
                  sectionItem={item}
                  rowRefs={rowRefs}
                />
              )}
              ref={ref => {
                if (ref && !rowRefs.get(item.id)) {
                  rowRefs.set(item.id, ref);
                }
              }}
              onSwipeableWillOpen={() => {
                [...rowRefs.entries()].forEach(([key, ref]) => {
                  if (key !== item.id && ref) {
                    ref.close();
                  }
                });
              }}>
              <VisibleComponent />
            </Swipeable>
          );
        }}
        onEndReachedThreshold={0.2}
        progressViewOffset={50}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFoodLog}
          />
        }
        ListFooterComponentStyle={styles.listFooterComponent}
      />
      <Footer hide={false} navigation={navigation} />
      <ExerciseModal
        visible={!!excerciseModal}
        exercise={excerciseModal}
        setVisible={setExcerciseModal}
      />
      <WeightModal
        weight={weightModal}
        visible={!!weightModal}
        setVisible={setWeightModal}
        selectedDate={selectedDate}
      />
      <WaterModal
        visible={watertModal}
        setVisible={setWaterModal}
        selectedDate={selectedDate}
      />
      <ChooseModal
        modalVisible={!!deleteteModal}
        hideModal={() => setDeleteteModal(false)}
        title="Delete Foods"
        subtitle={`Are you shure you want to delete all of your ${
          deleteteModal ? deleteteModal.mealName.toLowerCase() : ''
        } items?`}
        btns={[
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => setDeleteteModal(false),
          },
          {
            type: 'primary',
            title: 'Yes',
            onPress: () => {
              setDeleteteModal(false);
              if (deleteteModal) {
                dispatch(
                  userLogActions.deleteFoodFromLog(
                    deleteteModal.items.map((item: FoodProps) => ({
                      id: item.id,
                    })),
                  ),
                );
              }
            },
          },
        ]}
      />
    </View>
  );
};
