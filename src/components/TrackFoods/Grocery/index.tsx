// utils
import React, {useState, useEffect} from 'react';
import moment from 'moment-timezone';
import {batch} from 'react-redux';

// hekpers
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';

// components
import {
  View,
  TextInput,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import RestaurantFoodItem from 'components/RestaurantFoodItem';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';
import {useDebounce} from 'use-debounce';

// actions
import * as basketActions from 'store/basket/basket.actions';
import {clearGroceryFoods, getGroceries} from 'store/foods/foods.actions';

// styles
import {styles} from './Grocery.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {FoodProps} from 'store/userLog/userLog.types';

interface GroceryProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.TrackFoods
  >;
}

const Grocery: React.FC<GroceryProps> = () => {
  const dispatch = useDispatch();
  const groceries = useSelector(state => state.foods.groceries);
  const [popup, setPopup] = useState(false);
  const [query, setQuery] = useState('');
  const [value] = useDebounce(query, 500);

  useEffect(() => {
    // in prod app not displayed it
    // dispatch(getGroceries('app'));
    return () => {
      dispatch(clearGroceryFoods());
    };
  }, [dispatch]);

  useEffect(() => {
    // in native app it's fire without bounce,so flow a bit different
    if (value.length > 2) {
      dispatch(getGroceries(value));
    }
  }, [value, dispatch]);

  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        setPopup(false);
      }, 1000);
    }
  }, [popup]);

  const handleEndOfScroll = () => {
    setPopup(true);
  };

  const addFoodToBasket = (food: FoodProps) => {
    batch(() => {
      dispatch(
        basketActions.mergeBasket({
          meal_type: guessMealTypeByTime(moment().hours()),
        }),
      );
      dispatch(basketActions.addExistFoodToBasket([food]));
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <TextInput
          placeholder={'Search Grocery Foods'}
          style={styles.input}
          value={query}
          onChangeText={text => setQuery(text)}
        />
      </View>
      {groceries.length ? (
        <FlatList
          data={groceries}
          keyExtractor={(item, index) =>
            item._id || item.item_name || `${item.brand_name}-${index}`
          }
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <RestaurantFoodItem
              onPress={() => addFoodToBasket(item)}
              food={item}
            />
          )}
          onEndReached={() => {
            if (!value) {
              handleEndOfScroll();
            }
          }}
          onEndReachedThreshold={0.3}
        />
      ) : (
        <TouchableWithoutFeedback style={{flex: 1}} onPress={handleEndOfScroll}>
          <View style={{flex: 1}} />
        </TouchableWithoutFeedback>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={popup}
        onRequestClose={() => {
          setPopup(false);
        }}>
        <View style={styles.rootModal}>
          <Text style={styles.modalText}>
            Please enter a search query to filter results.
          </Text>
        </View>
      </Modal>
    </View>
  );
};

export default Grocery;
