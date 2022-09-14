// utils
import React from 'react';

//components
import {View, Text, TouchableHighlight} from 'react-native';

// styles
import {styles} from './Totals.styles';

interface TotalsProps {
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

const Totals: React.FC<TotalsProps> = props => {
  const {totalCalories, protein, carbohydrates, fat} = props;

  return (
    <TouchableHighlight style={{backgroundColor: '#eee'}}>
      <View>
        <View style={styles.overviewWrapper}>
          <Text style={styles.overviewLabel}>Total Calories</Text>
          <Text style={styles.caloriesValue}>{totalCalories.toFixed(0)}</Text>
        </View>
        <View style={styles.macroTotals}>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{protein.toFixed(0)}g</Text>
            <Text style={styles.macroTitle}>Protein</Text>
          </View>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{carbohydrates.toFixed(0)}g</Text>
            <Text style={styles.macroTitle}>Carb</Text>
          </View>
          <View style={styles.macroTotalsTile}>
            <Text style={styles.macroValue}>{fat.toFixed(0)}g</Text>
            <Text style={styles.macroTitle}>Fat</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default Totals;
