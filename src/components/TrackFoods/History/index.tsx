// utils
import React, {useState, useEffect} from 'react';
import {batch} from 'react-redux';

// components
import {View, TextInput} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import FoodItem from '../Grocery/FoodItem';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {getHistoryFoods} from 'store/foods/foods.actions';

// styles
import {styles} from './History.styles';

// types
import {BasketFoodProps} from 'store/basket/basket.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';

interface HistoryProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const History: React.FC<HistoryProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const historyFoods = useSelector(state => state.foods.historyFoods);
  const [query, setQuery] = useState('');
  const [loadInProgress, setLoadInProgress] = useState(false);

  useEffect(() => {
    if (!loadInProgress) {
      setLoadInProgress(true);
      dispatch(
        getHistoryFoods({
          query,
          common: false,
          self: true,
          branded: false,
          detailed: true,
        }),
      ).then(() => setLoadInProgress(false));
    }
  }, [dispatch, query, loadInProgress]);

  useEffect(() => {
    if (!loadInProgress) {
      setLoadInProgress(true);
      dispatch(
        getHistoryFoods({
          query,
          common: false,
          self: true,
          branded: false,
          detailed: true,
        }),
      ).then(() => setLoadInProgress(false));
    }
  }, [query, dispatch, loadInProgress]);

  const handleEndOfScroll = () => {
    // Alert.alert(
    //   "Attention",
    //   "Start typing query to search Your foods",
    //   {
    //     cancelable: true,
    //   });
  };

  const addFoodToBasket = (food: BasketFoodProps) => {
    let aggregatedFood = food;

    batch(() => {
      dispatch(basketActions.changeMealType(aggregatedFood.meal_type));
      dispatch(basketActions.changeConsumedAt(aggregatedFood.consumed_at));
      dispatch(basketActions.addExistFoodToBasket(aggregatedFood));
    });
    navigation.replace(Routes.Basket);
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View>
          <TextInput
            placeholder={'Search Your Foods'}
            style={styles.input}
            value={query}
            onChangeText={text => setQuery(text)}
          />
        </View>
        <View>
          {historyFoods.length ? (
            <FlatList
              data={historyFoods}
              keyExtractor={item => item.food_name}
              renderItem={({item}) => (
                <FoodItem
                  onPress={() => addFoodToBasket(item)}
                  foodObj={item}
                />
              )}
              onEndReached={() => handleEndOfScroll()}
              onEndReachedThreshold={0.3}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default History;
