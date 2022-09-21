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

// actions
import {getRestorants, getRestorantsWithCalc} from 'store/foods/foods.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

// constants
import {Routes} from 'navigation/Routes';
import {styles} from './Restaurants.styles';

interface RestaurantsProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const Restaurants: React.FC<RestaurantsProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const {restaurants, restaurantsWithCalc} = useSelector(state => state.foods);
  const [restaurantQuery, setRestaurantQuery] = useState('');
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [filteredRestaurantsList, setFilteredRestaurantsList] = useState([]);

  const [restaurantSearcher, setRestaurantSearcher] =
    useState<Searcher<never, FullOptions<never>>>();

  const [selectedRestaurant, setSelectedRestaurant] = useState();

  useEffect(() => {
    batch(() => {
      dispatch(getRestorants());
      dispatch(getRestorantsWithCalc());
    });
  }, [dispatch]);

  useEffect(() => {
    setRestaurantsList(
      restaurantsList.concat(restaurants).sort((a, b) => {
        let textA = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        let textB = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      }),
    );
  }, [restaurants]);

  useEffect(() => {
    setRestaurantsList(
      restaurantsList.concat(restaurantsWithCalc).sort((a, b) => {
        let textA = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        let textB = a.name
          ? a.name.toUpperCase()
          : a.proper_brand_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      }),
    );
  }, [restaurantsWithCalc]);

  useEffect(() => {
    const filteredList =
      restaurantSearcher && restaurantsList.length && restaurantQuery.length
        ? restaurantSearcher.search(restaurantQuery)
        : restaurantsList;
    setFilteredRestaurantsList(filteredList);
  }, [restaurantQuery]);

  useEffect(() => {
    setFilteredRestaurantsList(restaurantsList);
    setRestaurantSearcher(
      new Searcher(restaurantsList, {
        ignoreCase: false,
        keySelector: obj => obj.proper_brand_name && obj.name,
      }),
    );
  }, [restaurantsList]);

  const showRestaurant = restaurant => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {!selectedRestaurant ? (
        <View style={{padding: 8}}>
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
                keyExtractor={item => item.id}
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
