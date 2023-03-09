// utils
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
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
import {replaceRegexForNumber} from 'helpers/index';

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
  const route = useRoute();
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
    const multiplyer =
      (newMeasure[0]?.serving_weight / newMeasure[0]?.qty || 1) /
      (prevMeasure[0]?.serving_weight / prevMeasure[0]?.qty || 1);
    const clonedFood = _.cloneDeep(food);
    let newFoodObj = multiply(
      {...clonedFood, serving_unit: newMeasureName},
      multiplyer,
      food.serving_qty,
    );
    if (newFoodObj.serving_qty !== 1) {
      const mult = 1 / newFoodObj.serving_qty;
      newFoodObj = multiply(_.cloneDeep(newFoodObj), mult, 1);
      setServingQty('1');
    }
    setFoodObj({...newFoodObj});
    setNfCalories(newFoodObj.nf_calories);
    if (itemChangeCallback) {
      itemChangeCallback({...newFoodObj}, itemIndex || 0);
    }
  };

  const onQtyChange = () => {
    const newValue = parseFloat(servingQty) || 1;
    if (newValue === food.serving_qty) {
      return;
    }
    const multiplyer = newValue / food.serving_qty;
    const newFoodObj = multiply(_.cloneDeep(food), multiplyer, newValue);
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
          selectTextOnFocus
          style={styles.qty_input}
          value={servingQty}
          placeholderTextColor="#60605e"
          keyboardType={'numeric'}
          returnKeyType="done"
          onChangeText={newVal => setServingQty(replaceRegexForNumber(newVal))}
          onBlur={() => {
            onQtyChange();
          }}
        />
        <View style={styles.pickerContainer}>
          {foodObj.alt_measures ? (
            <ModalSelector
              style={styles.picker}
              initValueTextStyle={{
                fontSize: 14,
                color: '#000',
                textAlign: 'left',
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
              }>
              <View style={[styles.picker, styles.serving_select]}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{fontSize: 14, color: '#000', textAlign: 'left'}}>
                  {servingUnit}
                </Text>
              </View>
            </ModalSelector>
          ) : (
            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={styles.pickerText}>
              {servingUnit}
            </Text>
          )}
        </View>
      </View>
      <Text
        style={styles.foodName}
        numberOfLines={withInfo ? 1 : 2}
        ellipsizeMode="tail">
        {food_name}
      </Text>
      {brand_name && (
        <Text
          style={styles.foodBrandName}
          numberOfLines={1}
          ellipsizeMode="tail">
          {brand_name}
        </Text>
      )}
    </>
  );
  const rightPart = (
    <>
      {withInfo ? (
        <FontAwesome
          style={styles.info}
          name="info-circle"
          color="#999"
          size={19}
        />
      ) : null}
      <View style={styles.calories}>
        <Text
          style={styles.caloriesValue}
          numberOfLines={1}
          ellipsizeMode="tail">
          {' '}
          {nfCalories
            ? Math.round(nfCalories)
            : Math.round(
                full_nutrients?.filter(
                  (item: NutrientProps) => item.attr_id === 208,
                )[0].value,
              )}
        </Text>
        <Text style={styles.cal}>cal</Text>
      </View>
    </>
  );

  return (
    <TouchableHighlight onPress={onTap}>
      <View style={[styles.foodItem, withoutBorder && styles.withoutBorder]}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.foodThumb}
            source={
              food.photo
                ? {uri: food.photo?.thumb}
                : require('assets/gray_nix_apple_small.png')
            }
            resizeMode="contain"
          />
        </View>
        {withTooltip ? (
          <TooltipView
            doNotDisplay={route.name !== Routes.Basket}
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
            <View style={styles.footer}>
              <TooltipView
                doNotDisplay={route.name !== Routes.Basket}
                eventName={tooltipEventName || 'firstFoodAddedToBasket'}
                step={1}
                parentWrapperStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
                childrenWrapperStyle={[
                  {backgroundColor: '#fff', alignItems: 'flex-end'},
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
            <View style={[styles.footer]}>{rightPart}</View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default FoodEditItem;
