// utils
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import moment from 'moment-timezone';

// components
import {Text, View, RefreshControl, SectionList} from 'react-native';
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

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import useLocalNotification from 'hooks/useLocalNotification';

// actinos
import * as userLogActions from 'store/userLog/userLog.actions';

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
  const {foods, totals, selectedDate, weights, exercises} = useSelector(
    state => state.userLog,
  );
  let rowRefs = new Map<string, Swipeable>();
  const userData = useSelector(state => state.auth.userData);
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
  const [showPhotoUploadMessage, setShowPhotoUploadMessage] = useState(false);
  const infoMessage = route.params?.infoMessage;

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
    if (infoMessage === 'success') {
      setShowPhotoUploadMessage(true);
    }
  }, [infoMessage]);

  setTimeout(() => {
    setShowPhotoUploadMessage(false);
  }, 3000);

  const getEmptySectionText = (key: string) => {
    let noLoggedDataText = 'No foods logged yet.';
    if (key === foodLogSections.Exercise) {
      noLoggedDataText = 'No exercises logged yet.';
    } else if (key === foodLogSections.Weigh_in) {
      noLoggedDataText = 'No weights logged yet.';
    } else if (key === foodLogSections.Water) {
      noLoggedDataText = '0 L';
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
            {showPhotoUploadMessage ? (
              <View style={styles.photoMessageContainer}>
                <Text style={styles.photoMessageTitle}>Thank you!</Text>
                <View style={styles.photoMessageTextContainer}>
                  <Text style={styles.photoMessageText}>
                    {' '}
                    Soon this food will be updated in our database.
                  </Text>
                </View>
              </View>
            ) : null}
            <FoodLogHeader
              caloriesLimit={selectedDay.totals.daily_kcal_limit || 0}
              caloriesBurned={selectedDay.totals.total_cal_burned || 0}
              caloriesIntake={selectedDay.totals.total_cal || 0}
              protein={selectedDay.totals.total_proteins || 0}
              carbohydrates={selectedDay.totals.total_carbs || 0}
              fat={selectedDay.totals.total_fat || 0}
              foods={foods || []}
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
          return (
            <FoodLogSectionHeader
              title={section.key || ''}
              mealType={mealType}
              foods={foodList}
              onPress={() => handleChooseCategory(section.key || '')}
            />
          );
        }}
        renderSectionFooter={({section}) => {
          if (section.data.length === 0) {
            return (
              <EmptyListItem
                type={
                  section.key === foodLogSections.Water ? 'full' : undefined
                }
                text={getEmptySectionText(section.key || '')}
              />
            );
          } else {
            return null;
          }
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
                <EmptyListItem
                  text={`${moment(item.timestamp).format('h:mm a')}   ${
                    userData.measure_system === 1
                      ? `${item.kg} kg`
                      : `${Math.round(
                          parseFloat(String(item.kg)) * 2.20462,
                        )} lbs`
                  }`}
                  type="full"
                />
              );
            } else if (section.key === foodLogSections.Water) {
              return (
                <WaterListItem
                  onPress={() => setWaterModal(true)}
                  text={item.consumed}
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
                  if (key !== item.id && ref) ref.close();
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
    </View>
  );
};
