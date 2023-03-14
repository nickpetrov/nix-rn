// utils
import React from 'react';
import round from 'lodash/round';

//components
import {View, Text, TouchableHighlight} from 'react-native';

// styles
import {styles} from './Totals.styles';

interface TotalsProps {
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  singleFoodQty?: number;
}

const Totals: React.FC<TotalsProps> = ({
  totalCalories,
  protein,
  carbohydrates,
  fat,
  singleFoodQty,
}) => {
  return (
    <TouchableHighlight style={styles.root}>
      <View>
        <View style={styles.overviewWrapper}>
          <Text style={styles.overviewLabel}>Total Calories</Text>
          <Text style={styles.caloriesValue}>{round(totalCalories)}</Text>
        </View>
        {singleFoodQty && (
          <View style={[styles.overviewWrapper, styles.topBorder]}>
            <Text style={styles.overviewLabel}>Calories Per Serving</Text>
            <Text style={styles.caloriesValue}>
              {round(totalCalories / singleFoodQty)}
            </Text>
          </View>
        )}
        <View style={styles.macroTotals}>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{round(protein)}g</Text>
            <Text style={styles.macroTitle}>Protein</Text>
          </View>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{round(carbohydrates)}g</Text>
            <Text style={styles.macroTitle}>Carb</Text>
          </View>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{round(fat)}g</Text>
            <Text style={styles.macroTitle}>Fat</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default Totals;
