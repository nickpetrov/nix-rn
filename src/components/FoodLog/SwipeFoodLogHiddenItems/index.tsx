// utils
import React, {useCallback} from 'react';

// components
import SwipeHiddenButtons, {
  SwipeHidderButtonProps,
} from 'components/SwipeHiddenButtons';

// hooks
import {useDispatch} from 'hooks/useRedux';
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
import {foodLogSections, FoodProps} from 'store/userLog/userLog.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {mealTypes} from 'store/basket/basket.types';
import Swipeable from 'react-native-gesture-handler/lib/typescript/components/Swipeable';
import {analyticTrackEvent} from 'helpers/analytics.ts';
import moment from 'moment-timezone';

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
  const addItemToBasket = useCallback(
    (food: FoodProps) => {
      dispatch(basketActions.addExistFoodToBasket([food])).then(() => {
        dispatch(
          basketActions.mergeBasket({
            consumed_at: moment().format('YYYY-MM-DD'),
            meal_type: mealTypes[foodLogSection as keyof typeof mealTypes],
          }),
        );
        // close all swipes after copy
        [...rowRefs.values()].forEach(ref => {
          if (ref) ref.close();
        });
        navigation.navigate(Routes.Basket);
      });
    },
    [foodLogSection, dispatch, navigation, rowRefs],
  );

  const handleDeleteFoodFromLog = useCallback(
    (id: string) => {
      dispatch(deleteFoodFromLog([{id: id || '-1'}]));
    },
    [dispatch],
  );

  const handleDeleteWeightFromLog = useCallback(
    (id: string) => {
      dispatch(deleteWeightFromLog([{id: id || '-1'}])).catch(err =>
        console.log(err),
      );
    },
    [dispatch],
  );
  const handleDeleteExerciseFromLog = useCallback(
    (id: string) => {
      dispatch(deleteExerciseFromLog([{id: id || '-1'}])).catch(err =>
        console.log(err),
      );
    },
    [dispatch],
  );
  const handleDeleteWaterLog = useCallback(() => {
    dispatch(deleteWaterFromLog()).then(() => {
      analyticTrackEvent('deletedWater', ' ');
    });
  }, [dispatch]);

  const getAction = (action: string) => {
    if (action === 'copy') {
      if (
        foodLogSection !== foodLogSections.Exercise &&
        foodLogSection !== foodLogSections.Weigh_in &&
        foodLogSection !== foodLogSections.Water
      ) {
        return () => {
          analyticTrackEvent('swipe_left', 'swipe_left_copy');
          addItemToBasket(sectionItem);
        };
      }
    } else if (action === 'delete') {
      if (foodLogSection === foodLogSections.Exercise) {
        return () => {
          analyticTrackEvent('swipe_left', 'swipe_left_delete');
          handleDeleteExerciseFromLog(sectionItem.id);
        };
      } else if (foodLogSection === foodLogSections.Weigh_in) {
        return () => {
          analyticTrackEvent('swipe_left', 'swipe_left_delete');
          handleDeleteWeightFromLog(sectionItem.id);
        };
      } else if (foodLogSection === foodLogSections.Water) {
        return () => {
          analyticTrackEvent('swipe_left', 'swipe_left_delete');
          handleDeleteWaterLog();
        };
      } else {
        return () => {
          analyticTrackEvent('swipe_left', 'swipe_left_delete');
          analyticTrackEvent('deletedFood', sectionItem.food_name);
          handleDeleteFoodFromLog(sectionItem.id);
        };
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
