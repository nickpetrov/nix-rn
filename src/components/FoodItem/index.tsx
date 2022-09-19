// utils
import React, {useEffect, useState} from 'react';

// components
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';

// helpers
import {multiply} from 'helpers/multiply';

// styles
import {styles} from './FoodItem.styles';

// types
import {
  BasketFoodProps,
  MeasureProps,
  NutrientProps,
} from 'store/basket/basket.types';
import {FoodProps} from 'store/userLog/userLog.types';

interface FoodItemProps {
  foodObj: BasketFoodProps | FoodProps;
  itemChangeCallback?: (
    foodObj: BasketFoodProps | FoodProps,
    index: number,
  ) => void;
  itemIndex?: number;
  onTap?: () => void;
}

const FoodItem: React.FC<FoodItemProps> = ({
  foodObj,
  onTap,
  itemIndex,
  itemChangeCallback,
}) => {
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
    if (itemChangeCallback) {
      itemChangeCallback(food, itemIndex || 0);
    }
  }, [food, itemIndex, itemChangeCallback]);

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
    const multiplyer = serving_weight_grams / prevMeasure[0].serving_weight;
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
    <TouchableOpacity onPress={onTap}>
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
        <View style={{flex: 1}}>
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
            <View style={{flexGrow: 5}}>
              <Picker
                style={{width: '100%', minWidth: '100%'}}
                selectedValue={servingUnit}
                onValueChange={measureChange}>
                {measures.map((item: {label: string; value: string}) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}

                <Picker.Item label="JavaScript" value="js" />
              </Picker>
            </View>
          </View>
          <Text style={styles.foodName}>{food_name}</Text>
        </View>
        <View style={{alignItems: 'flex-end', width: 80}}>
          <Text style={styles.caloriesValue}>
            {' '}
            {nfCalories
              ? nfCalories.toFixed(0)
              : full_nutrients
                  .filter((item: NutrientProps) => item.attr_id === 208)[0]
                  .value.toFixed(0)}
          </Text>
          <Text>cal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodItem;
