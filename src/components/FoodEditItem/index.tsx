// utils
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';

// components
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import ModalSelector from 'react-native-modal-selector';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TooltipView from 'components/TooltipView';

// helpers
import {multiply} from 'helpers/multiply';

// constants
import {Routes} from 'navigation/Routes';

// styles
import {styles} from './FoodEditItem.styles';
import {Colors} from 'constants/Colors';

// types
import {MeasureProps, NutrientProps} from 'store/userLog/userLog.types';
import {FoodProps} from 'store/userLog/userLog.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {CheckedEventsType} from 'store/walkthrough/walkthrough.types';

interface FoodEditItemProps {
  foodObj: FoodProps;
  itemChangeCallback?: (foodObj: FoodProps, index: number) => void;
  itemIndex?: number;
  onTap?: () => void;
  withInfo?: boolean;
  withoutBorder?: boolean;
  withTooltip?: boolean;
  tooltipEventName?: keyof CheckedEventsType;
}

const FoodEditItem: React.FC<FoodEditItemProps> = ({
  foodObj,
  onTap,
  itemIndex,
  itemChangeCallback,
  withInfo,
  withoutBorder,
  withTooltip,
  tooltipEventName,
}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackNavigatorParamList, Routes.Food>
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
    brand_name,
  } = foodObj;
  const [nfCalories, setNfCalories] = useState(nf_calories);
  const [servingQty, setServingQty] = useState(String(serving_qty));
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
  } else {
    alt_measures = _.unionBy(alt_measures, 'measure');
  }

  useEffect(() => {
    setFoodObj(foodObj);
    setNfCalories(foodObj.nf_calories);
    setServingQty(String(foodObj.serving_qty));
    setServingUnit(foodObj.serving_unit);
  }, [foodObj]);

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
    if (itemChangeCallback) {
      itemChangeCallback({...newFoodObj}, itemIndex || 0);
    }
  };

  const onQtyChange = () => {
    const newValue = parseFloat(servingQty) || 1;
    const multiplyer = newValue / food.serving_qty;
    const newFoodObj = multiply(food, multiplyer, newValue);
    setFoodObj({...newFoodObj});
    setNfCalories(newFoodObj.nf_calories);
    if (itemChangeCallback) {
      itemChangeCallback({...newFoodObj}, itemIndex || 0);
    }
  };

  const mainView = (
    <>
      <View style={styles.servingWrapper}>
        <TextInput
          style={styles.qty_input}
          value={servingQty}
          placeholderTextColor="#60605e"
          keyboardType={'numeric'}
          returnKeyType="done"
          onChangeText={setServingQty}
          onBlur={() => onQtyChange()}
        />
        <View style={styles.pickerContainer}>
          {foodObj.alt_measures ? (
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
          ) : (
            <Text style={styles.pickerText}>{servingUnit}</Text>
          )}
        </View>
      </View>
      <View>
        <Text style={styles.foodName}>{food_name}</Text>
        {brand_name && <Text style={styles.foodBrandName}>{brand_name}</Text>}
      </View>
    </>
  );
  const rightPart = (
    <>
      {withInfo ? (
        <FontAwesome name="info-circle" color="#999" size={19} />
      ) : null}
      <View style={[styles.calories, withInfo ? {marginLeft: 10} : {}]}>
        <Text style={styles.caloriesValue}>
          {' '}
          {nfCalories
            ? nfCalories.toFixed(0)
            : full_nutrients
                ?.filter((item: NutrientProps) => item.attr_id === 208)[0]
                .value.toFixed(0)}
        </Text>
        <Text style={styles.cal}>cal</Text>
      </View>
    </>
  );

  return (
    <TouchableHighlight onPress={onTap}>
      <View style={[styles.foodItem, withoutBorder && styles.withoutBorder]}>
        <Image
          style={styles.foodThumb}
          source={
            food.photo
              ? {uri: food.photo.thumb}
              : require('assets/gray_nix_apple_small.png')
          }
          resizeMode="contain"
        />
        {withTooltip ? (
          <TooltipView
            eventName={tooltipEventName || 'firstFoodAddedToBasket'}
            step={0}
            parentWrapperStyle={{...styles.main}}
            childrenWrapperStyle={{
              backgroundColor: '#fff',
              alignItems: 'flex-start',
            }}>
            {mainView}
          </TooltipView>
        ) : (
          <View style={styles.main}>{mainView}</View>
        )}
        {withTooltip ? (
          <TouchableWithoutFeedback
            onPress={() => {
              if (withInfo) {
                navigation.navigate(Routes.Food, {
                  foodObj,
                  readOnly: true,
                });
              }
            }}>
            <View style={[styles.footer, withInfo && styles.between]}>
              <TooltipView
                eventName={tooltipEventName || 'firstFoodAddedToBasket'}
                step={1}
                parentWrapperStyle={[styles.footer, withInfo && styles.between]}
                childrenWrapperStyle={[
                  styles.footer,
                  withInfo && styles.between,
                  {backgroundColor: '#fff'},
                ]}>
                {rightPart}
              </TooltipView>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              if (withInfo) {
                navigation.navigate(Routes.Food, {
                  foodObj,
                  readOnly: true,
                });
              }
            }}>
            <View style={[styles.footer, withInfo && styles.between]}>
              {rightPart}
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default FoodEditItem;
