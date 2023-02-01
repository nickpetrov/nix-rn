// utils
import React, {useEffect, useState, useMemo, useLayoutEffect} from 'react';
import moment from 'moment-timezone';

// components
import {
  View,
  SectionList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import FoodLogSectionHeader from 'components/FoodLog/FoodLogSectionHeader';
import EmptyListItem from 'components/FoodLog/EmptyListItem';
import MealListItem from 'components/FoodLog/MealListItem';
import ExerciseListItem from 'components/FoodLog/ExerciseListItem';
import WaterListItem from 'components/FoodLog/WaterListItem';
import FoodLogHeader from 'components/FoodLog/FoodLogHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {refreshClientLog} from 'store/coach/coach.actions';

// constants
import {Routes} from 'navigation/Routes';

// types
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp} from '@react-navigation/native';
import {ExerciseProps, mealById} from 'store/userLog/userLog.types';
import {NavigationHeader} from 'components/NavigationHeader';
import {
  FoodProps,
  TotalProps,
  foodLogSections,
  mealNameProps,
} from 'store/userLog/userLog.types';
import {mealTypes} from 'store/basket/basket.types';

// styles
import {styles} from './ViewClientDayLogScreen.styles';

interface ViewClientDayLogScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Dashboard
  >;
  route: RouteProp<StackNavigatorParamList, Routes.ViewClientDayLog>;
}

const ViewClientDayLogScreen: React.FC<ViewClientDayLogScreenProps> = ({
  navigation,
  route,
}) => {
  const client = route.params.client;
  const user = useSelector(state => state.auth.userData);
  // user - coach for this client
  const dispatch = useDispatch();
  const {
    clientFoods: foods,
    clientTotals: totals,
    clientSelectedDate: selectedDate,
    clientExercises: exercises,
  } = useSelector(state => state.coach);
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
    const arr: {data: any; key: mealNameProps}[] = [
      {key: foodLogSections.Breakfast, data: []},
      {key: foodLogSections.Lunch, data: []},
      {key: foodLogSections.Dinner, data: []},
    ];

    // add data to sections
    foods
      .filter(
        (item: FoodProps) =>
          moment
            .utc(item.consumed_at)
            .tz(client.timezone)
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
  }, [foods, selectedDate, exercises, consumedWater, client.timezone]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const options = {
      clientId: client.id,
      timezone: client.timezone,
    };
    dispatch(refreshClientLog(options, selectedDate));
  }, [dispatch, selectedDate, client.timezone, client.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <NavigationHeader
          {...props}
          navigation={navigation}
          headerRight={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Routes.Dashboard);
              }}>
              <FontAwesome size={30} color={'white'} name="home" />
            </TouchableOpacity>
          }
        />
      ),
    });
  }, [navigation]);

  const getEmptySectionText = (key: string) => {
    let noLoggedDataText = 'No foods logged yet.';
    if (key === foodLogSections.Exercise) {
      noLoggedDataText = 'No exercises logged yet.';
    } else if (key === foodLogSections.Water) {
      noLoggedDataText = user.measure_system === 1 ? '0 L' : '0 oz';
    }

    return noLoggedDataText;
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
                selectedDay.totals.daily_kcal_limit || client.daily_kcal || 0
              }
              caloriesBurned={selectedDay.totals.total_cal_burned || 0}
              foods={foods.filter(
                (item: FoodProps) =>
                  moment
                    .utc(item.consumed_at)
                    .tz(client.timezone)
                    .format('YYYY-MM-DD') === selectedDate,
              )}
              client={client}
              clientSelectedDate={selectedDate}
            />
          </>
        )}
        renderSectionHeader={({section}) => {
          const mealType =
            section.key !== foodLogSections.Exercise &&
            section.key !== foodLogSections.Water
              ? mealTypes[section.key as keyof typeof mealTypes]
              : undefined;
          const foodList =
            section.key !== foodLogSections.Exercise &&
            section.key !== foodLogSections.Water
              ? [...section.data]
              : undefined;
          return (
            <FoodLogSectionHeader
              title={section.key || ''}
              mealType={mealType}
              foods={foodList}
              onPress={() => {}}
              clientId={client.id}
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
                  readOnly={true}
                  mealName={mealById[item.mealType as keyof typeof mealById]}
                />
              );
            } else if (section.key === foodLogSections.Exercise) {
              return (
                <ExerciseListItem
                  last={exercises?.length - 1 === index}
                  exercise={item}
                />
              );
            } else if (section.key === foodLogSections.Water) {
              return (
                <WaterListItem
                  measure_system={user.measure_system}
                  consumed={item.consumed}
                />
              );
            } else {
              return null;
            }
          };

          return <VisibleComponent />;
        }}
        onEndReachedThreshold={0.2}
        progressViewOffset={50}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              const options = {
                clientId: client.id,
                timezone: client.timezone,
              };
              dispatch(refreshClientLog(options, selectedDate, true)).then(
                () => {
                  setIsRefreshing(false);
                },
              );
            }}
          />
        }
        ListFooterComponentStyle={styles.listFooterComponent}
      />
    </View>
  );
};

export default ViewClientDayLogScreen;
