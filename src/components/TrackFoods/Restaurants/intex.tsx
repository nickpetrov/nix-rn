// utils
import React, {useState, useEffect} from 'react';
import {FullOptions, Searcher} from 'fast-fuzzy';
import {batch} from 'react-redux';

// components
import {View, TextInput} from 'react-native';
import RestaurantItem from './RestaurantItem/intex';
import RestaurantFoods from './RestaurantFoods';
import {FlatList} from 'react-native-gesture-handler';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useDebounce} from 'use-debounce';

// actions
import {getRestorants, getRestorantsWithCalc} from 'store/foods/foods.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';
import {styles} from './Restaurants.styles';
import {
  RestaurantsProps,
  RestaurantsWithCalcProps,
} from 'store/foods/foods.types';

interface RestaurantsComponentProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const Restaurants: React.FC<RestaurantsComponentProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const {restaurants, restaurantsWithCalc} = useSelector(state => state.foods);
  const [restaurantQuery, setRestaurantQuery] = useState('');
  const [value] = useDebounce(restaurantQuery, 1000);
  const [restaurantsList, setRestaurantsList] = useState<
    Array<RestaurantsProps | RestaurantsWithCalcProps>
  >([]);
  const [filteredRestaurantsList, setFilteredRestaurantsList] = useState<
    Array<RestaurantsProps>
  >([]);

  const [restaurantSearcher, setRestaurantSearcher] =
    useState<Searcher<RestaurantsProps, FullOptions<RestaurantsProps>>>();

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantsProps>();

  useEffect(() => {
    batch(() => {
      dispatch(getRestorants());
      dispatch(getRestorantsWithCalc());
    });
  }, [dispatch]);

  useEffect(() => {
    setRestaurantsList(prev => {
      const newArr = prev.concat(restaurants).sort(a => {
        let textA = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        let textB = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      return newArr;
    });
  }, [restaurants]);

  useEffect(() => {
    setRestaurantsList(prev => {
      const newArr = prev.concat(restaurantsWithCalc).sort(a => {
        let textA = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        let textB = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      return newArr;
    });
  }, [restaurantsWithCalc]);

  useEffect(() => {
    const filteredList =
      restaurantSearcher && restaurantsList.length && value.length
        ? restaurantSearcher.search(value)
        : restaurantsList;
    setFilteredRestaurantsList(filteredList);
  }, [value, restaurantSearcher, restaurantsList]);

  useEffect(() => {
    setFilteredRestaurantsList(restaurantsList);
    setRestaurantSearcher(
      new Searcher(restaurantsList, {
        keySelector: obj => obj?.proper_brand_name || obj?.name,
        threshold: 1,
      }),
    );
  }, [restaurantsList]);

  const showRestaurant = (
    restaurant: RestaurantsProps | RestaurantsWithCalcProps,
  ) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <View style={styles.root}>
      {!selectedRestaurant ? (
        <View style={styles.container}>
          <>
            <View>
              <TextInput
                placeholder={'Search All Restaurans'}
                style={styles.input}
                value={restaurantQuery}
                onChangeText={text => setRestaurantQuery(text)}
              />
            </View>
            <View>
              <FlatList
                data={filteredRestaurantsList}
                extraData={value}
                keyExtractor={item => item.id || item.brand_id}
                renderItem={({item}) => (
                  <RestaurantItem
                    isWithCalc={!!item.brand_id}
                    name={item.name || item.proper_brand_name}
                    logo={item.logo || item.brand_logo}
                    onPress={() => {
                      showRestaurant(item);
                    }}
                  />
                )}
              />
            </View>
          </>
        </View>
      ) : (
        <RestaurantFoods
          restaurant={selectedRestaurant}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default Restaurants;
