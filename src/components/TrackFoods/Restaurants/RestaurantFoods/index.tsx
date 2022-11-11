// utils
import React, {useEffect, useState} from 'react';
import {batch} from 'react-redux';
import moment from 'moment-timezone';

// components
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RestaurantFoodItem from 'components/RestaurantFoodItem';
import {NixButton} from 'components/NixButton';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// helpers
import nixHelpers from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {
  clearRestaurantsFoods,
  getNixRestorantsFoods,
  getRestorantsFoods,
} from 'store/foods/foods.actions';
import {setSearchQueryRestaurant} from 'store/foods/foods.actions';
import {setInfoMessage} from 'store/base/base.actions';

// services
import baseService from 'api/baseService';

// styles
import {styles} from './RestaurantFoods.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps} from 'store/userLog/userLog.types';
import {
  RestaurantsProps,
  RestaurantsWithCalcProps,
} from 'store/foods/foods.types';
import {SelectedRestaurant} from 'store/foods/foods.types';

interface RestaurantFoodsProps {
  restaurant: SelectedRestaurant;
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const RestaurantFoods: React.FC<RestaurantFoodsProps> = ({
  navigation,
  restaurant,
}) => {
  const dispatch = useDispatch();
  const searchValue = useSelector(
    state => state.foods.searchQueryRestaurantFoods,
  );
  const brand_id =
    (restaurant as RestaurantsProps).id ||
    (restaurant as RestaurantsWithCalcProps).brand_id;
  const calcUrl =
    (restaurant as RestaurantsWithCalcProps).mobile_calculator_url || '';
  const restaurantFoods = useSelector(state => state.foods.restaurantFoods);
  const [loading, setLoading] = useState(false);

  const maxHits = useSelector(state => state.foods.nixRestaurantFoodsTotal);
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const brandName =
    (restaurant as RestaurantsProps).name ||
    (restaurant as RestaurantsWithCalcProps).proper_brand_name;

  useEffect(() => {
    setLoading(true);
    dispatch(getNixRestorantsFoods('', brand_id))
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
    return () => {
      dispatch(clearRestaurantsFoods());
    };
  }, [dispatch, brand_id]);

  useEffect(() => {
    if (searchValue.length > 1) {
      dispatch(
        getRestorantsFoods({
          query: searchValue,
          brand_ids: [brand_id],
          self: false,
          common: false,
          detailed: true,
          branded_type: 1,
        }),
      ).catch(err => console.log(err));
    }
  }, [dispatch, searchValue, brand_id]);

  const addFoodToBasket = (food: FoodProps) => {
    batch(() => {
      dispatch(
        basketActions.mergeBasket({
          meal_type: guessMealTypeByTime(moment().hours()),
        }),
      );
      if (food.nix_item_id) {
        dispatch(basketActions.addBrandedFoodToBasket(food.nix_item_id));
      } else {
        dispatch(basketActions.addExistFoodToBasket([food]));
      }
    });
  };

  const handleMessageFromWebView = (data: any) => {
    try {
      const foodObj = JSON.parse(data.nativeEvent.data);
      if (!foodObj.full_nutrients) {
        foodObj.full_nutrients = nixHelpers.buildFullNutrientsArray(foodObj);
      }

      const food = nixHelpers.convertV1ItemToTrackFood(foodObj);
      dispatch(basketActions.addExistFoodToBasket([food]));
    } catch (err) {
      console.log(err);
    }
  };

  const requestItem = () => {
    const bugReportData = {
      feedback: `Request missing item. Restaurant name: ${brandName}. Item name: ${searchValue}.`,
      type: 2,
    };
    baseService
      .sendBugReport(bugReportData)
      .then(() => {
        dispatch(setSearchQueryRestaurant(''));
        dispatch(
          setInfoMessage({
            title: 'Thank you!',
            text: 'Your feedback has been queued up with our registered dietitian team, and will be reviewed shortly.',
          }),
        );
      })
      .catch(() => {
        dispatch(
          setInfoMessage({
            title: 'Error',
            child: (
              <Text>
                'There was an error with your submission, please email us at{' '}
                <Text
                  style={styles.link}
                  onPress={() =>
                    Linking.openURL('mailto:support@nutritionix.com')
                  }>
                  support@nutritionix.com
                </Text>{' '}
                to report this problem.'
              </Text>
            ),
          }),
        );
      });
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <FlatList
          data={[]}
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => {
            return (
              <>
                {calcUrl.length ? (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate(Routes.WebView, {
                        title: brandName,
                        close: true,
                        withFooter: true,
                        url: calcUrl + '?embed',
                        onMessage: data => handleMessageFromWebView(data),
                      })
                    }>
                    <View style={styles.content}>
                      <Image
                        style={styles.contentImage}
                        source={{
                          uri:
                            (restaurant as RestaurantsWithCalcProps)
                              .brand_logo || '',
                        }}
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
                        name="chevron-right"
                        size={30}
                        color="#52a256"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </>
            );
          }}
          ListFooterComponent={() => {
            return (
              <View style={styles.restaurants}>
                <FlatList
                  data={restaurantFoods}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) =>
                    item._id || item.item_name || `${item.brand_name}-${index}`
                  }
                  renderItem={({item}) => (
                    <RestaurantFoodItem
                      onPress={() => addFoodToBasket(item)}
                      food={item}
                    />
                  )}
                  ListEmptyComponent={() => (
                    <>
                      {!loading ? (
                        <View style={styles.emptyContainer}>
                          <View style={styles.empty}>
                            <Text style={styles.emptyText}>Nothing found.</Text>
                            <NixButton
                              title={`Request a missing item for ${brandName}`}
                              type="primary"
                              onPress={requestItem}
                            />
                          </View>
                        </View>
                      ) : null}
                    </>
                  )}
                  onEndReached={() => {
                    if (!searchValue.length && offset + limit < maxHits) {
                      setOffset(prev => prev + limit);
                      dispatch(
                        getNixRestorantsFoods(
                          '',
                          brand_id,
                          offset + limit,
                          limit,
                        ),
                      ).catch(err => console.log(err));
                    }
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default RestaurantFoods;
