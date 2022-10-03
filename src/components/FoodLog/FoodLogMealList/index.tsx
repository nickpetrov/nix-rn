// utils
import React, {useState, useEffect, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment-timezone';

// components
import {View, Text, TouchableOpacity, TouchableHighlight} from 'react-native';
import MealListItem from '../MealListItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExerciseListItem from '../ExerciseListItem';
import EmptyListItem from '../EmptyListItem';
import WaterListItem from '../WaterListItem';
import SwipeView from 'components/SwipeView';

// constants
import {Routes} from 'navigation/Routes';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {
  deleteExerciseFromLog,
  DeleteFoodFromLog,
  deleteWaterFromLog,
  deleteWeightFromLog,
} from 'store/userLog/userLog.actions';
import * as basketActions from 'store/basket/basket.actions';

// styles
import {styles} from './FoodLogMealList.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {mealTypes} from 'store/basket/basket.types';
import {
  mealNameProps,
  WeightProps,
  ExerciseProps,
  FoodProps,
} from 'store/userLog/userLog.types';
import {User} from 'store/auth/auth.types';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface FoodLogMealListProps {
  mealName: mealNameProps;
  weights?: Array<WeightProps>;
  exercises?: Array<ExerciseProps>;
  mealFoodsList?: Array<FoodProps>;
  setWeightModal: (w: WeightProps) => void;
  setExcerciseModal: (ex: ExerciseProps) => void;
  setWaterModal: (v: boolean) => void;
  userData: User;
  consumedWater: number;
}

const FoodLogMealList: React.FC<FoodLogMealListProps> = props => {
  const dispatch = useDispatch();
  const {selectedDate} = useSelector(state => state.userLog);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        StackNavigatorParamList,
        Routes.Totals | Routes.Dashboard | Routes.Autocomplete
      >
    >();
  const {
    mealFoodsList,
    mealName,
    weights,
    setExcerciseModal,
    setWeightModal,
    setWaterModal,
    consumedWater,
    userData,
    exercises,
  } = props;
  const [totalMealCalories, setTotalMealCalories] = useState(0);
  let noLoggedDataText = 'No foods logged yet.';
  if (mealName === 'Excercise') {
    noLoggedDataText = 'No exercises logged yet.';
  } else if (mealName === 'Weigh-in') {
    noLoggedDataText = 'No weights logged yet.';
  }
  const [mealFoods, setMealFoods] = useState(() => (
    <EmptyListItem text={noLoggedDataText} />
  ));

  const handleDeleteFoodFromLog = useCallback(
    (id: string) => {
      dispatch(DeleteFoodFromLog([{id: id || '-1'}]));
    },
    [dispatch],
  );

  const handleDeleteWeightFromLog = useCallback(
    (id: string) => {
      dispatch(deleteWeightFromLog([{id: id || '-1'}]));
    },
    [dispatch],
  );
  const handleDeleteExerciseFromLog = useCallback(
    (id: string) => {
      dispatch(deleteExerciseFromLog([{id: id || '-1'}]));
    },
    [dispatch],
  );
  const handleDeleteWaterLog = useCallback(() => {
    dispatch(deleteWaterFromLog());
  }, [dispatch]);

  const addItemToBasket = useCallback(
    (foodName: string) => {
      dispatch(basketActions.addFoodToBasket(foodName || '')).then(() => {
        dispatch(basketActions.changeConsumedAt(selectedDate));
        dispatch(
          basketActions.changeMealType(
            mealTypes[mealName as keyof typeof mealTypes],
          ),
        );
        navigation.navigate(Routes.Basket);
      });
    },
    [selectedDate, mealName, dispatch, navigation],
  );

  useEffect(() => {
    setTotalMealCalories(0);
    setMealFoods(<EmptyListItem text={noLoggedDataText} />);
    if (mealName === 'Weigh-in' && weights) {
      return setMealFoods(() => (
        <View style={styles.flex1}>
          {weights.length > 0 ? (
            <SwipeView
              listKey="weigh-in"
              data={weights}
              buttons={[
                {
                  type: 'delete',
                  keyId: 'id',
                  onPress: (id: string) => handleDeleteWeightFromLog(id),
                },
              ]}
              renderItem={data => (
                <TouchableHighlight
                  style={[styles.flex1]}
                  onPress={() => setWeightModal(data.item)}>
                  <EmptyListItem
                    text={`${moment(data.item.timestamp).format('h:mm a')}   ${
                      userData.measure_system === 1
                        ? `${data.item.kg} kg`
                        : `${Math.round(
                            parseFloat(String(data.item.kg)) * 2.20462,
                          )} lbs`
                    }`}
                    type="full"
                  />
                </TouchableHighlight>
              )}
            />
          ) : (
            <EmptyListItem text={noLoggedDataText} type="full" />
          )}
        </View>
      ));
    }
    if (mealName === 'Excercise' && exercises) {
      return setMealFoods(() => (
        <View style={styles.flex1}>
          {exercises.length > 0 ? (
            <SwipeView
              listKey="exercises"
              data={exercises}
              buttons={[
                {
                  type: 'delete',
                  keyId: 'id',
                  onPress: (id: string) => handleDeleteExerciseFromLog(id),
                },
              ]}
              renderItem={data => (
                <ExerciseListItem
                  key={data.item.id}
                  exercise={data.item}
                  onPress={() => setExcerciseModal(data.item)}
                />
              )}
            />
          ) : (
            <EmptyListItem text={noLoggedDataText} type="full" />
          )}
        </View>
      ));
    }
    // WaterListItem
    if (mealName === 'Water') {
      return setMealFoods(() => (
        <SwipeView
          listKey="water"
          data={[{consumed: consumedWater, id: consumedWater}]}
          buttons={[
            {
              type: 'delete',
              keyId: 'id',
              onPress: () => handleDeleteWaterLog(),
            },
          ]}
          renderItem={data => (
            <WaterListItem
              key={data.item.key}
              onPress={() => setWaterModal(true)}
              text={data.item.consumed}
            />
          )}
        />
      ));
    }
    if (!!mealFoodsList && mealFoodsList.length) {
      mealFoodsList.forEach((food: FoodProps) => {
        setTotalMealCalories(
          prevCalories => prevCalories + (food.nf_calories || 0),
        );
      });
      return setMealFoods(() => (
        <>
          <SwipeView
            listKey="food"
            data={mealFoodsList}
            buttons={[
              {
                type: 'copy',
                keyId: 'food_name',
                onPress: (name: string) => addItemToBasket(name),
              },
              {
                type: 'delete',
                keyId: 'id',
                onPress: (id: string) => handleDeleteFoodFromLog(id),
              },
            ]}
            renderItem={data => (
              <MealListItem
                key={data.item.id}
                foodObj={data.item}
                navigation={navigation}
                mealName={mealName}
              />
            )}
          />
        </>
      ));
    }
  }, [
    mealFoodsList,
    weights,
    exercises,
    mealName,
    noLoggedDataText,
    navigation,
    setExcerciseModal,
    setWeightModal,
    userData.measure_system,
    addItemToBasket,
    handleDeleteFoodFromLog,
    handleDeleteWeightFromLog,
    handleDeleteExerciseFromLog,
    handleDeleteWaterLog,
    consumedWater,
    setWaterModal,
  ]);

  const handleChooseCategory = (name: mealNameProps) => {
    switch (name) {
      case 'Breakfast':
        return navigation.navigate(Routes.Autocomplete, {
          mealType: mealTypes.Breakfast,
        });
      case 'Lunch':
        return navigation.navigate(Routes.Autocomplete, {
          mealType: mealTypes.Lunch,
        });
      case 'Dinner':
        return navigation.navigate(Routes.Autocomplete, {
          mealType: mealTypes.Dinner,
        });
      case 'Snack':
        return navigation.navigate(Routes.Autocomplete, {
          mealType: mealTypes['AM Snack'],
        });
      case 'Excercise':
        return setExcerciseModal({name: ''} as ExerciseProps);
      case 'Weigh-in':
        return setWeightModal({kg: 0} as WeightProps);
      case 'Water':
        return setWaterModal(true);
    }
  };

  if (
    (mealName === 'AM Snack' ||
      mealName === 'PM Snack' ||
      mealName === 'Late Snack') &&
    mealFoodsList?.length === 0
  ) {
    return null;
  }

  return (
    <View>
      <View style={styles.mealTitle}>
        <TouchableOpacity
          style={{
            ...styles.increasedTouchableArea,
            ...{flex: 1, flexDirection: 'row', alignItems: 'center'},
          }}
          onPress={() => handleChooseCategory(mealName)}>
          <Text style={styles.mealTitleText}>{mealName}</Text>
          <View style={styles.mealTitleIconWrapper}>
            <Ionicons
              name="ios-add"
              color="#fff"
              size={14}
              style={styles.mealTitleIcon}
            />
          </View>
        </TouchableOpacity>
        {mealName !== 'Excercise' &&
        mealName !== 'Weigh-in' &&
        mealName !== 'Water' ? (
          <View style={styles.mealDetailsWrapper}>
            <TouchableOpacity
              style={{
                ...styles.increasedTouchableArea,
                ...{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              }}
              onPress={() => {
                if (mealFoodsList?.length) {
                  navigation.navigate(Routes.Totals, {
                    foods: mealFoodsList,
                    type: mealName,
                  });
                }
              }}>
              <FontAwesome name="info-circle" color="#999" size={19} />
              <Text style={styles.mealTotalCalories}>
                {totalMealCalories.toFixed(0)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {mealFoods}
    </View>
  );
};

export default FoodLogMealList;
