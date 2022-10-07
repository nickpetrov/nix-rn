// utils
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import equal from 'deep-equal';

// components
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import ModalSelector from 'react-native-modal-selector';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// helpers
import {multiply} from 'helpers/multiply';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './FoodEditItem.styles';
import {Colors} from '../../constants/Colors';

// types
import {MeasureProps, NutrientProps} from 'store/userLog/userLog.types';
import {FoodProps} from 'store/userLog/userLog.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface FoodEditItemProps {
  foodObj: FoodProps;
  itemChangeCallback?: (foodObj: FoodProps, index: number) => void;
  itemIndex?: number;
  onTap?: () => void;
  withInfo?: boolean;
}

const FoodEditItem: React.FC<FoodEditItemProps> = ({
  foodObj,
  onTap,
  itemIndex,
  itemChangeCallback,
  withInfo,
}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackNavigatorParamList, Routes.FoodInfo>
    >();
  const [food, setFoodObj] = useState(foodObj);
  let {
    alt_measures,
    serving_qty,
    serving_unit,
    serving_weight_grams,
    full_nutrients,
    food_name,
    nf_calories,
  } = foodObj;
  const [nfCalories, setNfCalories] = useState(nf_calories);
  const [servingQty, setServingQty] = useState(serving_qty);
  const [servingUnit, setServingUnit] = useState(serving_unit);

  if (!alt_measures) {
    alt_measures = [
      {
        serving_weight: serving_weight_grams,
        measure: serving_unit,
        seq: 1,
        qty: serving_qty,
      },
    ];
  }

  useEffect(() => {
    setFoodObj(foodObj);
    setNfCalories(foodObj.nf_calories);
    setServingQty(foodObj.serving_qty);
    setServingUnit(foodObj.serving_unit);
  }, [foodObj]);

  useEffect(() => {
    if (itemChangeCallback && !equal(foodObj, food)) {
      itemChangeCallback(food, itemIndex || 0);
    }
  }, [food, itemIndex, itemChangeCallback, foodObj]);

  const measures = alt_measures.map((item: MeasureProps) => {
    return {
      label: item.measure,
      value: item.measure,
    };
  });

  const measureChange = (newMeasureName: string) => {
    const prevMeasure = alt_measures.filter(
      (item: MeasureProps) => item.measure === servingUnit,
    );
    const newMeasure = alt_measures.filter(
      (item: MeasureProps) => item.measure === newMeasureName,
    );
    setServingUnit(newMeasure[0].measure);
    serving_weight_grams = newMeasure[0].serving_weight;
    const multiplyer =
      serving_weight_grams / (prevMeasure[0]?.serving_weight || 1);
    const newFoodObj = multiply(
      {...food, serving_unit: newMeasureName},
      multiplyer,
      food.serving_qty,
    );
    setFoodObj({...newFoodObj});
    setNfCalories(newFoodObj.nf_calories);
  };

  const onQtyChange = (value: string) => {
    const newValue = parseFloat(value || '0');
    if (newValue) {
      const multiplyer = newValue / food.serving_qty;
      const newFoodObj = multiply(food, multiplyer, newValue);
      setFoodObj({...newFoodObj});
      setNfCalories(newFoodObj.nf_calories);
      setServingQty(newValue);
    } else {
      setServingQty(Number(value));
    }
  };

  return (
    <TouchableHighlight onPress={onTap}>
      <View style={styles.foodItem}>
        {food.photo ? (
          <Image
            style={styles.foodThumb}
            source={{uri: food.photo.thumb}}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={styles.foodThumb}
            source={require('assets/gray_nix_apple_small.png')}
            resizeMode="contain"
          />
        )}
        <View style={styles.main}>
          <View style={styles.servingWrapper}>
            <TextInput
              style={styles.qty_input}
              value={'' + servingQty}
              placeholder="qty"
              placeholderTextColor="#60605e"
              keyboardType={'numeric'}
              returnKeyType="done"
              onChangeText={onQtyChange}
            />
            <View style={styles.pickerContainer}>
              <ModalSelector
                style={styles.picker}
                initValueTextStyle={{
                  fontSize: 16,
                  color: '#000',
                }}
                optionTextStyle={{
                  fontSize: 16,
                  color: '#000',
                }}
                selectedItemTextStyle={{
                  fontSize: 16,
                  color: Colors.Info,
                  fontWeight: '500',
                }}
                data={measures}
                initValue={servingUnit}
                onChange={option => measureChange(option.value)}
                keyExtractor={(item: {label: string; value: string}) =>
                  item.value
                }
              />
            </View>
          </View>
          <Text style={styles.foodName}>{food_name}</Text>
        </View>
        <View
          style={[styles.footer, withInfo ? {flexGrow: 1} : {flexGrow: 0.6}]}>
          {withInfo && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.FoodInfo, {
                  foodObj,
                })
              }>
              <FontAwesome name="info-circle" color="#999" size={19} />
            </TouchableOpacity>
          )}
          <View style={[styles.calories, withInfo ? {marginLeft: 10} : {}]}>
            <Text style={styles.caloriesValue}>
              {' '}
              {nfCalories
                ? nfCalories.toFixed(0)
                : full_nutrients
                    ?.filter((item: NutrientProps) => item.attr_id === 208)[0]
                    .value.toFixed(0)}
            </Text>
            <Text>cal</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default FoodEditItem;