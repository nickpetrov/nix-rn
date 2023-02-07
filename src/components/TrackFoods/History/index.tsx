// utils
import React, {useState, useEffect} from 'react';
import {batch} from 'react-redux';
import moment from 'moment-timezone';

// components
import {View, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MealListItem from 'components/FoodLog/MealListItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useDebounce} from 'use-debounce';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {clearHistoryFoods, getHistoryFoods} from 'store/foods/foods.actions';
import {showSuggestedFoods} from 'store/autoComplete/autoComplete.actions';

// styles
import {styles} from './History.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps} from 'store/userLog/userLog.types';

// constants
import {Routes} from 'navigation/Routes';
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';

interface HistoryProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const History: React.FC<HistoryProps> = () => {
  const dispatch = useDispatch();
  const suggestedFoods = useSelector(state => state.autoComplete.suggested);
  const historyFoods = useSelector(state => state.foods.historyFoods);
  const emptyBasket = useSelector(state => state.basket.foods.length === 0);
  const [query, setQuery] = useState('');
  const [value] = useDebounce(query, 500);

  useEffect(() => {
    dispatch(showSuggestedFoods(-1));
    return () => {
      dispatch(clearHistoryFoods());
    };
  }, [dispatch]);

  useEffect(() => {
    if (value) {
      dispatch(
        getHistoryFoods({
          query: value,
          common: false,
          self: true,
          branded: false,
          detailed: true,
        }),
      );
    } else {
      dispatch(clearHistoryFoods());
    }
  }, [value, dispatch]);

  const addFoodToBasket = (food: FoodProps) => {
    batch(() => {
      dispatch(
        basketActions.mergeBasket({
          meal_type: emptyBasket
            ? guessMealTypeByTime(moment().hours())
            : undefined,
          consumed_at: moment().format(),
        }),
      );
      dispatch(
        basketActions.addFoodToBasketById(food.id || food.uuid || ''),
      ).catch(err => {
        console.log(err);
      });
    });
  };

  const sortByFoodName = (arr: FoodProps[]) => {
    const newArr = arr.sort((a, b) => {
      let textA = a.food_name.toUpperCase();
      let textB = b.food_name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    return newArr;
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <TextInput
          placeholder={'Search My Food History'}
          style={styles.input}
          value={query}
          onChangeText={text => setQuery(text)}
        />
        {query.length > 0 && (
          <View style={styles.closeBtn}>
            <TouchableOpacity onPress={() => setQuery('')}>
              <FontAwesome name="close" color="#000" size={14} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={
          historyFoods.length || value
            ? sortByFoodName(historyFoods)
            : sortByFoodName(suggestedFoods)
        }
        keyExtractor={item => item.food_name}
        renderItem={({item}) => (
          <MealListItem
            foodObj={item}
            onTap={() => {
              Keyboard.dismiss();
              addFoodToBasket(item);
            }}
            withoutPhotoUploadIcon
            historyTab
            withCal
          />
        )}
      />
    </View>
  );
};

export default History;
