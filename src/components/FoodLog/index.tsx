// utils
import React, {useEffect, useState, useCallback} from 'react';
import moment from 'moment-timezone';

// helpers
import * as foodLogHelpers from 'helpers/foodLogHelpers';

// components
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
} from 'react-native';
import FoodLogHeader from './FoodLogHeader';
import FoodLogMealList from './FoodLogMealList';
import ExerciseModal from './ExerciseModal';
import WeightModal from './WeightModal';
import WaterModal from './WaterModal';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import * as userLogActions from 'store/userLog/userLog.actions';

// styles
import {styles} from './FoodLog.styles';

// types
import {
  ExerciseProps,
  SortedFoodProps,
  TotalProps,
  WeightProps,
  mealNameProps,
} from 'store/userLog/userLog.types';

const animationTimeouts: Array<number> = [];

const FoodLog: React.FC = () => {
  const dispatch = useDispatch();
  const {foods, totals, selectedDate, weights, exercises} = useSelector(
    state => state.userLog,
  );
  const consumedWater = totals.find(
    (item: TotalProps) => item.date === selectedDate,
  )?.water_consumed_liter;
  const userData = useSelector(state => state.auth.userData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [excerciseModal, setExcerciseModal] = useState<ExerciseProps | null>(
    null,
  );
  const [weightModal, setWeightModal] = useState<WeightProps | null>(null);
  const [watertModal, setWaterModal] = useState<boolean>(false);
  const [sortedFoods, setSortedFoods] = useState<Array<SortedFoodProps>>(
    foodLogHelpers.sortFoodsByMeal(foods, selectedDate),
  );
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [positionFromEnd, setPositionFromEnd] = useState(1);

  const refreshFoodLog = useCallback(() => {
    setIsRefreshing(true);
    dispatch(userLogActions.refreshLog(selectedDate, userData.timezone)).then(
      () => setIsRefreshing(false),
    );
  }, [dispatch, selectedDate, userData.timezone]);

  useEffect(() => {
    setSortedFoods([
      ...foodLogHelpers.sortFoodsByMeal(foods, selectedDate),
      {
        mealName: 'Excercise',
        exercises: exercises.filter(
          (item: ExerciseProps) =>
            moment(item.timestamp).format('YYYY-MM-DD') === selectedDate,
        ),
      },
      {
        mealName: 'Weigh-in',
        weights: weights.filter(
          (item: WeightProps) =>
            moment(item.timestamp).format('YYYY-MM-DD') === selectedDate,
        ),
      },
      {
        mealName: 'Water',
        water: [],
      },
    ]);
    setPositionFromEnd(1);
  }, [foods, selectedDate, exercises, weights]);

  useEffect(() => {
    setSortedFoods((prev: Array<SortedFoodProps>) => {
      let isSnackPresent = false;
      prev.map((meal: SortedFoodProps) => {
        if (
          meal.mealName === 'AM Snack' ||
          meal.mealName === 'PM Snack' ||
          meal.mealName === 'Late Snack'
        ) {
          if (!!meal?.foods?.length) {
            isSnackPresent = true;
          }
        }
      });
      if (!isSnackPresent) {
        const newSortedFood = prev.filter((meal: SortedFoodProps) => {
          return (
            meal.mealName !== 'AM Snack' &&
            meal.mealName !== 'PM Snack' &&
            meal.mealName !== 'Late Snack'
          );
        });

        newSortedFood.push({mealName: 'Snack' as mealNameProps, foods: []});
        return newSortedFood;
      } else {
        return prev;
      }
    });
  }, []);

  useEffect(() => {
    setSortedFoods((prev: Array<SortedFoodProps>) => {
      return prev.map((item: SortedFoodProps) => {
        if (item.mealName === 'Weigh-in') {
          item.weights = weights.filter(
            (el: WeightProps) =>
              moment(el.timestamp).format('YYYY-MM-DD') === selectedDate,
          );
        }
        if (item.mealName === 'Excercise') {
          item.exercises = exercises.filter(
            (el: ExerciseProps) =>
              moment(el.timestamp).format('YYYY-MM-DD') === selectedDate,
          );
        }
        return item;
      });
    });
  }, [selectedDate, exercises, weights]);

  useEffect(() => {
    refreshFoodLog();
  }, [refreshFoodLog]);

  const selectedDay: {
    totals: TotalProps;
  } = {
    totals:
      totals.filter(
        (dayTotal: TotalProps) => dayTotal.date === selectedDate,
      )[0] || {},
  };

  const foodLogScrollHandler = (info: {
    nativeEvent: {
      contentOffset: {
        y: number;
      };
    };
  }) => {
    if (positionFromEnd <= 0) {
      //if it's the 'bounce' effect at the bottom - don't do anything
      return;
    }
    let currentPosition = info.nativeEvent.contentOffset.y;
    if (currentPosition < 0) {
      //check if it's the 'bounce' effect at the top
      currentPosition = 0;
      setPositionFromEnd(1);
    }
    if (currentPosition > lastScrollPosition) {
      setScrollDirection('down');
    } else {
      setScrollDirection('up');
    }
    setLastScrollPosition(currentPosition);
  };

  const onEndReachedHandler = (end: {distanceFromEnd: number}) => {
    if (animationTimeouts.length) {
      animationTimeouts.map((timeoutId: number) => {
        clearTimeout(timeoutId);
      });
    }
    setPositionFromEnd(end.distanceFromEnd);
    const timeoutId = setTimeout(() => {
      setPositionFromEnd(1);
    }, 200);
    animationTimeouts.push(timeoutId);
  };

  return (
    <View style={styles.foodLogWrapper}>
      <FoodLogHeader
        caloriesLimit={selectedDay.totals.daily_kcal_limit || 0}
        caloriesBurned={selectedDay.totals.total_cal_burned || 0}
        caloriesIntake={selectedDay.totals.total_cal || 0}
        protein={selectedDay.totals.total_proteins || 0}
        carbohydrates={selectedDay.totals.total_carbs || 0}
        fat={selectedDay.totals.total_fat || 0}
        scrollDirection={scrollDirection}
        foods={sortedFoods || []}
      />
      <TouchableWithoutFeedback>
        <FlatList
          data={sortedFoods}
          keyExtractor={item => item.mealName}
          renderItem={({item}) => (
            <FoodLogMealList
              key={item.mealName}
              mealName={item.mealName}
              weights={item.weights}
              exercises={item.exercises}
              mealFoodsList={item.foods}
              consumedWater={consumedWater}
              setWeightModal={(w: WeightProps) => setWeightModal(w)}
              setExcerciseModal={(ex: ExerciseProps) => setExcerciseModal(ex)}
              setWaterModal={setWaterModal}
              userData={userData}
            />
          )}
          onScroll={foodLogScrollHandler}
          onEndReached={onEndReachedHandler}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => refreshFoodLog()}
            />
          }
        />
      </TouchableWithoutFeedback>
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

export default FoodLog;
