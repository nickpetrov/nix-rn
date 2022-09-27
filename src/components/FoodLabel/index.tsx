// utils
import React, {useEffect, useState} from 'react';

// components
import {View, Text} from 'react-native';

// helpers
import getAttrValueById from 'helpers/getAttrValueById';

// styles
import {styles} from './FoodLabel.styles';

// types
import {FoodProps} from 'store/userLog/userLog.types';

interface FoodLabelProps {
  data: FoodProps | Array<FoodProps>;
}

interface RowOrColProps {
  style?: {
    [key: string]: string | number;
  };
  children?: React.ReactNode;
}

const Row = (props: RowOrColProps) => {
  return <View style={{...styles.row, ...props.style}}>{props.children}</View>;
};

const Col = (props: RowOrColProps) => {
  return (
    <View style={{...styles.column, ...props.style}}>{props.children}</View>
  );
};

const FoodLabel: React.FC<FoodLabelProps> = props => {
  const [dataObj, setDataObj] = useState(props.data);

  const [labelData, setLabelData] = useState({
    totalCalories: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    polyunsaturatedFat: 0,
    monosaturatedFat: 0,
    cholesterol: 0,
    sodium: 0,
    potassium: 0,
    totalCarbohydrates: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 0,
    vitaminA: 0,
    vitaminC: 0,
    calcium: 0,
    iron: 0,
  });

  useEffect(() => {
    setDataObj(props.data);
  }, [props]);

  useEffect(() => {
    let dataArray: Array<FoodProps> = [];
    if (typeof dataObj !== 'undefined') {
      // check if data passed is a single food item or array of foods.
      if (Object.prototype.toString.call(dataObj) === '[object Object]') {
        dataArray.push(dataObj as FoodProps);
      } else {
        dataArray = dataArray.concat(dataObj);
      }

      dataArray.map(item => {
        setLabelData(prevLabelData => {
          prevLabelData.totalCalories +=
            item.nf_calories || getAttrValueById(item.full_nutrients, 208) || 0;
          prevLabelData.totalFat +=
            item.nf_total_fat ||
            getAttrValueById(item.full_nutrients, 204) ||
            0;
          prevLabelData.saturatedFat +=
            item.nf_saturated_fat ||
            getAttrValueById(item.full_nutrients, 606) ||
            0;
          prevLabelData.transFat +=
            getAttrValueById(item.full_nutrients, 605) || 0;
          prevLabelData.polyunsaturatedFat +=
            getAttrValueById(item.full_nutrients, 646) || 0;
          prevLabelData.monosaturatedFat +=
            getAttrValueById(item.full_nutrients, 645) || 0;
          prevLabelData.cholesterol +=
            item.nf_cholesterol ||
            getAttrValueById(item.full_nutrients, 601) ||
            0;
          prevLabelData.sodium +=
            item.nf_sodium || getAttrValueById(item.full_nutrients, 307) || 0;
          prevLabelData.potassium +=
            item.nf_potassium ||
            getAttrValueById(item.full_nutrients, 306) ||
            0;
          prevLabelData.totalCarbohydrates +=
            item.nf_total_carbohydrate ||
            getAttrValueById(item.full_nutrients, 205) ||
            0;
          prevLabelData.dietaryFiber +=
            item.nf_dietary_fiber ||
            getAttrValueById(item.full_nutrients, 291) ||
            0;
          prevLabelData.sugars +=
            item.nf_sugars || getAttrValueById(item.full_nutrients, 269) || 0;
          prevLabelData.protein +=
            item.nf_protein || getAttrValueById(item.full_nutrients, 203) || 0;
          prevLabelData.vitaminA +=
            getAttrValueById(item.full_nutrients, 318) || 0;
          prevLabelData.vitaminC +=
            getAttrValueById(item.full_nutrients, 401) || 0;
          prevLabelData.calcium +=
            getAttrValueById(item.full_nutrients, 301) || 0;
          prevLabelData.iron += getAttrValueById(item.full_nutrients, 303) || 0;

          return prevLabelData;
        });
      });
    }
  }, [dataObj]);

  // for (let key in labelData) {
  //   console.log(labelData[key]);
  // }

  const roundToOne = (number: number) => {
    return Math.round(number * 10) / 10;
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Nutrition Facts</Text>
      <Row style={styles.topRow}>
        <Col>
          <Text style={styles.textBold}>Calories </Text>
          <Text style={styles.text}>{Math.round(labelData.totalCalories)}</Text>
        </Col>
        <Col style={styles.flexDirectionRow}>
          <Text style={styles.text}>Calories from Fat </Text>
          <Text style={styles.text}>{roundToOne(labelData.totalFat * 9)}</Text>
        </Col>
      </Row>
      <Row>
        <Col />
        <Col>
          <Text style={styles.textBold}>% Daily Value*</Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.textBold}>Total Fat </Text>
          <Text style={styles.text}>{roundToOne(labelData.totalFat)} g</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.totalFat / 65) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row style={styles.ml10}>
        <Col>
          <Text style={styles.text}>Saturated Fat </Text>
          <Text style={styles.text}>{labelData.saturatedFat} g</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.saturatedFat / 20) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row style={styles.ml10}>
        <Col>
          <Text style={styles.textItalic}>Trans Fat </Text>
          <Text style={styles.text}>{labelData.transFat} g</Text>
        </Col>
        <Col />
      </Row>
      <Row style={styles.ml10}>
        <Col>
          <Text style={styles.text}>Polyunsaturated Fat </Text>
          <Text style={styles.text}>{labelData.polyunsaturatedFat} g</Text>
        </Col>
        <Col />
      </Row>
      <Row style={styles.ml10}>
        <Col>
          <Text style={styles.text}>Monounsaturated Fat </Text>
          <Text style={styles.text}>{labelData.monosaturatedFat} g</Text>
        </Col>
        <Col />
      </Row>
      <Row>
        <Col>
          <Text style={styles.textBold}>Cholesterol </Text>
          <Text style={styles.text}>{labelData.cholesterol} mg</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.cholesterol / 200) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.textBold}>Sodium </Text>
          <Text style={styles.text}>{labelData.sodium} mg</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.sodium / 2400) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.textBold}>Potassium </Text>
          <Text style={styles.text}>{labelData.potassium} mg</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.potassium / 3500) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.textBold}>Total Carbohydrates </Text>
          <Text style={styles.text}>{labelData.totalCarbohydrates} g</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.totalCarbohydrates / 300) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row style={styles.ml10}>
        <Col>
          <Text style={styles.text}>Dietary Fiber </Text>
          <Text style={styles.text}>{labelData.dietaryFiber} g</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.dietaryFiber / 25) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row style={styles.ml10}>
        <Col>
          <Text style={styles.text}>Sugars </Text>
          <Text style={styles.text}>{labelData.sugars} g</Text>
        </Col>
        <Col />
      </Row>
      <Row style={styles.borderBotW}>
        <Col>
          <Text style={styles.textBold}>Protein </Text>
          <Text style={styles.text}>{labelData.protein} g</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.protein / 50) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.text}>Vitamin A</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.vitaminA / 5000) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.text}>Vitamin C</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.vitaminC / 60) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.text}>Calcium</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.calcium / 1300) * 100)} %
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={styles.text}>Iron</Text>
        </Col>
        <Col>
          <Text style={styles.text}>
            {roundToOne((labelData.iron / 18) * 100)} %
          </Text>
        </Col>
      </Row>
      <Text style={styles.info}>
        * Percent Daily Values are based on a 2000 calorie diet.
      </Text>
    </View>
  );
};

export default FoodLabel;
