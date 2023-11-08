// utils
import React, {useState, useEffect, useLayoutEffect, useMemo} from 'react';
import moment from 'moment-timezone';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {useDrawerStatus} from '@react-navigation/drawer';

// components
import {
  Text,
  View,
  RefreshControl,
  SectionList,
  TouchableHighlight,
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
import TooltipView from 'components/TooltipView';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import useLocalNotification from 'hooks/useLocalNotification';

// actinos
import * as userLogActions from 'store/userLog/userLog.actions';
import {addExistFoodToBasket, mergeBasket} from 'store/basket/basket.actions';
import {setWalkthroughTooltip} from 'store/walkthrough/walkthrough.actions';
import {setOfflineMode} from 'store/base/base.actions';

// constant
import {Routes} from 'navigation/Routes';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RouteProp, useIsFocused} from '@react-navigation/native';
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
import {analyticSetUserId, analyticTrackEvent} from 'helpers/analytics.ts';

// styles
import {styles} from './DashboardScreen.styles';
import {Colors} from 'constants/Colors';
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';
import {mergeWidget} from 'store/widget/widget.actions';

interface DashboardScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Dashboard
  >;
  route: RouteProp<StackNavigatorParamList, Routes.Dashboard>;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const isFocused = useIsFocused();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const emptyBasket = useSelector(state => state.basket.foods.length === 0);
  const checkedEvents = useSelector(state => state.walkthrough.checkedEvents);
  const [deleteteModal, setDeleteteModal] = useState<
    {items: Array<FoodProps>; mealName: keyof mealTypes} | false
  >(false);
  const {foods, totals, selectedDate, weights, exercises} = useSelector(
    state => state.userLog,
  );
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
        (dayTotal: TotalProps) =>
          moment(dayTotal.date).format('YYYY-MM-DD') === selectedDate,
      )[0] || {},
  };
  const sections = useMemo(() => {
    // create empty sections
    let arr: {data: any; key: mealNameProps}[] = [
      {key: foodLogSections.Breakfast, data: []},
      {key: foodLogSections.AM_Snack, data: []},
      {key: foodLogSections.Lunch, data: []},
      {key: foodLogSections.PM_Snack, data: []},
      {key: foodLogSections.Dinner, data: []},
      {key: foodLogSections.Late_Snack, data: []},
    ];

    // add data to sections
    foods
      .filter(
        (item: FoodProps) =>
          moment
            .utc(item.consumed_at)
            .tz(userData.timezone)
            .format('YYYY-MM-DD') === selectedDate,
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

    // remove empty snack sections
    arr = arr.filter(
      item =>
        item.data.length > 0 ||
        item.key === foodLogSections.Breakfast ||
        item.key === foodLogSections.Lunch ||
        item.key === foodLogSections.Dinner,
    );

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

    // add exercise section
    arr.push({
      key: foodLogSections.Exercise,
      data: exercises.filter(
        (item: ExerciseProps) =>
          moment(item.timestamp).format('YYYY-MM-DD') === selectedDate,
      ),
    });

    // add weights section
    arr.push({
      key: foodLogSections.Weigh_in,
      data: weights.filter(
        (item: WeightProps) =>
          moment(item.timestamp).format('YYYY-MM-DD') === selectedDate,
      ),
    });

    // add water section
    arr.push({
      key: foodLogSections.Water,
      data: consumedWater ? [{consumed: consumedWater, id: consumedWater}] : [],
    });

    return arr;
  }, [
    foods,
    selectedDate,
    weights,
    exercises,
    consumedWater,
    userData.timezone,
  ]);

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

  useEffect(() => {
    dispatch(userLogActions.refreshLog(selectedDate, userData.timezone)).catch(
      err => console.log(err),
    );
    analyticSetUserId(userData.id);
  }, [dispatch, selectedDate, userData.timezone, userData.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          withAutoComplete
          headerRight={
            <BasketButton
              icon="shopping-basket"
              withCount
              onPress={() => navigation.navigate(Routes.Basket)}
            />
          }
          headerLeft={<DrawerButton />}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!checkedEvents.firstLogin.value) {
      setTimeout(() => {
        dispatch(setWalkthroughTooltip('firstLogin', 0));
      }, 1000);
    }
  }, [checkedEvents.firstLogin, dispatch]);

  useEffect(() => {
    if (route.params?.startWalkthroughAfterLog) {
      setTimeout(() => {
        dispatch(setWalkthroughTooltip('firstFoodAddedToFoodLog', 0));
      }, 1000);
      navigation.setParams({startWalkthroughAfterLog: undefined});
    }
  }, [route.params?.startWalkthroughAfterLog, navigation, dispatch]);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == false && !isDrawerOpen && isFocused) {
        dispatch(setOfflineMode(true));
        if (!checkedEvents.firstOfflineMode.value) {
          dispatch(setWalkthroughTooltip('firstOfflineMode', 0));
        }
      } else {
        dispatch(setOfflineMode(false));
      }
    });

    return () => {
      dispatch(setOfflineMode(false));
    };
  }, [
    netInfo,
    dispatch,
    isDrawerOpen,
    checkedEvents.firstOfflineMode,
    isFocused,
  ]);

  // update widget data

  // update widget
  useEffect(() => {
    if (selectedDate === moment().format('YYYY-MM-DD')) {
      let caloriesIntake = 0;
      foods
        .filter(
          (item: FoodProps) =>
            moment
              .utc(item.consumed_at)
              .tz(userData.timezone)
              .format('YYYY-MM-DD') === selectedDate,
        )
        .forEach(item => {
          caloriesIntake += item.nf_calories || 0;
        });

      const newSelectedDay: {
        totals: TotalProps;
      } = {
        totals:
          totals.filter(
            (dayTotal: TotalProps) =>
              moment(dayTotal.date).format('YYYY-MM-DD') === selectedDate,
          )[0] || {},
      };
      dispatch(
        mergeWidget({
          limit:
            newSelectedDay.totals.daily_kcal_limit || userData.daily_kcal || 0,
          consumed: Math.round(caloriesIntake || 0),
          burned: Math.round(newSelectedDay.totals.total_cal_burned || 0),
          date: moment.utc().format('MM-DD-YYYY'),
        }),
      );
    }
  }, [
    dispatch,
    totals,
    foods,
    selectedDate,
    userData.daily_kcal,
    userData.timezone,
  ]);

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
        keyExtractor={(item: any, index: number) => `${item.id}-${index}`}
        ListHeaderComponent={() => (
          <>
            <FoodLogHeader
              caloriesLimit={
                selectedDay.totals.daily_kcal_limit || userData.daily_kcal || 0
              }
              caloriesBurned={selectedDay.totals.total_cal_burned || 0}
              foods={foods.filter(
                (item: FoodProps) =>
                  moment
                    .utc(item.consumed_at)
                    .tz(userData.timezone)
                    .format('YYYY-MM-DD') === selectedDate,
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
              containerStyle={{...styles.swipeItemContainer, flex: 1}}
              renderRightActions={() =>
                section.data.length ? (
                  <SwipeHiddenButtons
                    buttons={[
                      {
                        type: 'delete',
                        onPress: () => {
                          analyticTrackEvent('swipe_left', 'swipe_left_delete');
                          setDeleteteModal({
                            items: section.data,
                            mealName: section.key as keyof mealTypes,
                          });
                        },
                      },
                      {
                        type: 'copy',
                        onPress: () => {
                          analyticTrackEvent('swipe_left', 'swipe_left_copy');
                          dispatch(addExistFoodToBasket(section.data)).then(
                            () => {
                              dispatch(
                                mergeBasket({
                                  consumed_at: moment().format('YYYY-MM-DD'),
                                  meal_type: emptyBasket
                                    ? guessMealTypeByTime(moment().hours())
                                    : undefined,
                                }),
                              );
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
              {section.key === sections[0].key ? (
                <TooltipView
                  doNotDisplay={route.name !== Routes.Dashboard}
                  eventName="firstFoodAddedToFoodLog"
                  step={3}
                  childrenWrapperStyle={{flex: 1, flexDirection: 'row'}}>
                  <FoodLogSectionHeader
                    title={section.key || ''}
                    mealType={mealType}
                    foods={foodList}
                    onPress={() => handleChooseCategory(section.key || '')}
                  />
                </TooltipView>
              ) : (
                <FoodLogSectionHeader
                  title={section.key || ''}
                  mealType={mealType}
                  foods={foodList}
                  onPress={() => handleChooseCategory(section.key || '')}
                />
              )}
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
                    navigation.navigate(Routes.Totals, {
                      foods: foods.filter(
                        (item: FoodProps) =>
                          moment.utc(item.consumed_at).tz(userData.timezone).format('YYYY-MM-DD') === selectedDate,
                      ),
                      type: 'daily',
                    })
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
                      onPress={() =>
                        navigation.navigate(Routes.Preferences, {
                          screen: Routes.Profile,
                        })
                      }>
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
              return item.id ===
                sections.filter(el => el.data.length)[0]?.data[0]?.id ? (
                <TooltipView
                  doNotDisplay={route.name !== Routes.Dashboard}
                  eventName="firstFoodAddedToFoodLog"
                  step={2}
                  childrenWrapperStyle={{
                    flex: 1,
                    backgroundColor: '#fff',
                  }}>
                  <MealListItem
                    foodObj={item}
                    navigation={navigation}
                    mealName={mealById[item.mealType as keyof typeof mealById]}
                    withArrow
                  />
                </TooltipView>
              ) : (
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
            onRefresh={() => {
              setIsRefreshing(true);
              dispatch(
                userLogActions.refreshLog(
                  selectedDate,
                  userData.timezone,
                  true,
                ),
              )
                .then(() => {
                  setIsRefreshing(false);
                })
                .catch(err => {
                  console.log(err);
                  setIsRefreshing(false);
                });
            }}
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
                // close all swipes after delete
                [...rowRefs.values()].forEach(ref => {
                  if (ref) {
                    ref.close();
                  }
                });
              }
            },
          },
        ]}
      />
    </View>
  );
};
