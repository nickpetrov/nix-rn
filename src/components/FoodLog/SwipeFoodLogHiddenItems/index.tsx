// utils
import React, {useCallback} from 'react';

// components
import SwipeHiddenButtons, {
  SwipeHidderButtonProps,
} from 'components/SwipeHiddenButtons';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useNavigation} from '@react-navigation/native';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {
  deleteExerciseFromLog,
  deleteFoodFromLog,
  deleteWaterFromLog,
  deleteWeightFromLog,
} from 'store/userLog/userLog.actions';

// constnts
import {Routes} from 'navigation/Routes';

// types
import {foodLogSections} from 'store/userLog/userLog.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {mealTypes} from 'store/basket/basket.types';
import Swipeable from 'react-native-gesture-handler/lib/typescript/components/Swipeable';

interface SwipeFoodLogHiddenItemsProps {
  foodLogSection: foodLogSections;
  sectionItem: any;
  rowRefs: Map<string | mealTypes, Swipeable>;
}

const SwipeFoodLogHiddenItems: React.FC<SwipeFoodLogHiddenItemsProps> = ({
  foodLogSection,
  sectionItem,
  rowRefs,
}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackNavigatorParamList, Routes.Dashboard>
    >();
  const dispatch = useDispatch();
  const selectedDate = useSelector(state => state.userLog.selectedDate);
  const addItemToBasket = useCallback(
    (foodName: string) => {
      dispatch(basketActions.addFoodToBasket(foodName || '')).then(() => {
        dispatch(basketActions.changeConsumedAt(selectedDate));
        dispatch(
          basketActions.changeMealType(
            mealTypes[foodLogSection as keyof typeof mealTypes],
          ),
        );
        // close all swipes after copy
        [...rowRefs.values()].forEach(ref => {
          if (ref) ref.close();
        });
        navigation.navigate(Routes.Basket);
      });
    },
    [selectedDate, foodLogSection, dispatch, navigation, rowRefs],
  );

  const handleDeleteFoodFromLog = useCallback(
    (id: string) => {
      dispatch(deleteFoodFromLog([{id: id || '-1'}]));
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

  const getAction = (action: string) => {
    if (action === 'copy') {
      if (
        foodLogSection !== foodLogSections.Exercise &&
        foodLogSection !== foodLogSections.Weigh_in &&
        foodLogSection !== foodLogSections.Water
      ) {
        return () => addItemToBasket(sectionItem.food_name);
      }
    } else if (action === 'delete') {
      if (foodLogSection === foodLogSections.Exercise) {
        return () => handleDeleteExerciseFromLog(sectionItem.id);
      } else if (foodLogSection === foodLogSections.Weigh_in) {
        return () => handleDeleteWeightFromLog(sectionItem.id);
      } else if (foodLogSection === foodLogSections.Water) {
        return () => handleDeleteWaterLog();
      } else {
        return () => handleDeleteFoodFromLog(sectionItem.id);
      }
    }

    return () => {};
  };

  const buttons: SwipeHidderButtonProps[] =
    foodLogSection !== foodLogSections.Exercise &&
    foodLogSection !== foodLogSections.Weigh_in &&
    foodLogSection !== foodLogSections.Water
      ? [
          {type: 'delete', onPress: getAction('delete')},
          {type: 'copy', onPress: getAction('copy')},
        ]
      : [{type: 'delete', onPress: getAction('delete')}];

  return <SwipeHiddenButtons buttons={buttons} />;
};

export default SwipeFoodLogHiddenItems;
