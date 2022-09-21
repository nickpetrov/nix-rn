// utils
import React, {useEffect, useState} from 'react';
import {batch} from 'react-redux';

// components
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FoodItem from '../../Grocery/FoodItem';
import {WebView} from 'react-native-webview';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useDebounce} from 'use-debounce';

// helpers
import nixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {
  getRestorantsFoods,
  // getRestorantsFoodsFromOldApi,
} from 'store/foods/foods.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {BasketFoodProps} from 'store/basket/basket.types';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './RestaurantFoods.styles';

interface RestaurantFoodsProps {
  restaurant: any;
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const RestaurantFoods: React.FC<RestaurantFoodsProps> = props => {
  const dispatch = useDispatch();
  const brand_id = props.restaurant.id || props.restaurant.brand_id;
  const calcUrl = props.restaurant.mobile_calculator_url || '';
  const restaurantFoods = useSelector(state => state.foods.restaurantFoods);
  const [query, setQuery] = useState('');
  const [value] = useDebounce(query, 1000);
  const [showCalculator, setShowCalculator] = useState(false);
  const brandName = props.restaurant.name || props.restaurant.proper_brand_name;

  useEffect(() => {
    dispatch(
      getRestorantsFoods({
        query: '',
        brand_ids: [brand_id],
        self: false,
        common: false,
        detailed: true,
        branded_type: 1,
      }),
    );
  }, [dispatch, brand_id]);

  useEffect(() => {
    if (value.length > 1) {
      dispatch(
        getRestorantsFoods({
          query: value,
          brand_ids: [brand_id],
          self: false,
          common: false,
          detailed: true,
          branded_type: 1,
        }),
      );
    }
  }, [dispatch, value, brand_id]);

  const addFoodToBasket = (food: BasketFoodProps) => {
    let aggregatedFood = food;

    batch(() => {
      dispatch(basketActions.changeMealType(aggregatedFood.meal_type));
      dispatch(basketActions.changeConsumedAt(aggregatedFood.consumed_at));
      dispatch(basketActions.addExistFoodToBasket(aggregatedFood));
    });
    props.navigation.replace(Routes.Basket);
  };

  const handleMessageFromWebView = (data: any) => {
    try {
      const foodObj = JSON.parse(data.nativeEvent.data);
      if (!foodObj.full_nutrients) {
        foodObj.full_nutrients = nixHelpers.buildFullNutrientsArray(foodObj);
      }

      const food = nixHelpers.convertV1ItemToTrackFood(foodObj);
      dispatch(basketActions.addExistFoodToBasket(food));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.root}>
      {!showCalculator ? (
        <View style={styles.container}>
          <View>
            <TextInput
              placeholder={`Search ${brandName} Foods`}
              style={styles.input}
              value={query}
              onChangeText={text => setQuery(text)}
            />
          </View>
          {calcUrl.length ? (
            <TouchableWithoutFeedback onPress={() => setShowCalculator(true)}>
              <View style={styles.content}>
                <Image
                  style={styles.contentImage}
                  source={{uri: props.restaurant.brand_logo}}
                  resizeMode="contain"
                />
                <View style={styles.contentContainer}>
                  <Text style={styles.contentInput}>Launch</Text>
                  <Text style={styles.contentInput}>Nutrition</Text>
                  <Text style={styles.contentInput}>Calculator</Text>
                </View>
                <FontAwesome
                  name="calculator"
                  size={40}
                  color="#6ca6e8"
                  style={styles.icon}
                />
                <FontAwesome
                  name="angle-right"
                  size={30}
                  color="#a1a1a1"
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : null}
          <View>
            <FlatList
              data={restaurantFoods}
              keyExtractor={item => item.food_name}
              renderItem={({item}) => (
                <FoodItem
                  onPress={() => addFoodToBasket(item)}
                  foodObj={item}
                />
              )}
            />
          </View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <WebView
            onMessage={data => handleMessageFromWebView(data)}
            // style={{ width: '100%' }}
            source={{uri: calcUrl + '?embed'}}
          />
        </View>
      )}
    </View>
  );
};

export default RestaurantFoods;
