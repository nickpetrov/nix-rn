// utils
import React, {useState, useEffect} from 'react';
import {batch} from 'react-redux';

// components
import {View, TextInput, Alert} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import FoodItem from './FoodItem';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {getGroceries} from 'store/foods/foods.actions';

// styles
import {styles} from './Grocery.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {BasketFoodProps} from 'store/basket/basket.types';

interface GroceryProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const Grocery: React.FC<GroceryProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const groceries = useSelector(state => state.foods.groceries);
  const [query, setQuery] = useState('');
  const [loadInProgress, setLoadInProgress] = useState(false);

  useEffect(() => {
    if (!loadInProgress) {
      setLoadInProgress(true);
      dispatch(
        getGroceries({
          query: 'app',
          common: false,
          self: false,
          branded: true,
          branded_type: 2,
          detailed: true,
        }),
      ).then(() => setLoadInProgress(false));
    }
  }, [dispatch, loadInProgress]);

  useEffect(() => {
    if (!loadInProgress && query.length > 1) {
      setLoadInProgress(true);
      dispatch(
        getGroceries({
          query,
          common: false,
          self: false,
          branded: true,
          branded_type: 2,
          detailed: true,
        }),
      ).then(() => setLoadInProgress(false));
    }
  }, [query, dispatch, loadInProgress]);

  const handleEndOfScroll = () => {
    Alert.alert('Attention', 'Start typing query to search grocery foods');
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
            placeholder={'Search Grocery Foods'}
            style={styles.input}
            value={query}
            onChangeText={text => setQuery(text)}
          />
        </View>
        <View>
          {groceries.length ? (
            <FlatList
              data={groceries}
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

export default Grocery;
