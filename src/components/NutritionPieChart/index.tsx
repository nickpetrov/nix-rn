// utils
import React, {useEffect, useState} from 'react';

// components
import {View, Text, Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

// styles
import {styles} from './NutritionPieChart.styles';

export interface pieChartDataProps {
  totalFatCalories: number;
  totalCarbohydratesCalories: number;
  totalProteinCalories: number;
  totalAlcoholCalories?: number;
}

interface NutritionPieChartProps {
  data: pieChartDataProps;
}

const NutritionPieChart: React.FC<NutritionPieChartProps> = props => {
  const [pieChartData, setPieChartData] = useState<
    Array<{
      name: string;
      calories: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }>
  >([]);

  useEffect(() => {
    const newPieChartData = [
      {
        name: 'Protein',
        calories: props.data.totalProteinCalories || 0,
        color: '#1aa6b7',
        legendFontColor: '#666',
        legendFontSize: 12,
      },
      {
        name: 'Carbs',
        calories: props.data.totalCarbohydratesCalories || 0,
        color: '#f0ab00',
        legendFontColor: '#666',
        legendFontSize: 12,
      },
      {
        name: 'Fat',
        calories: props.data.totalFatCalories || 0,
        color: '#b3217c',
        legendFontColor: '#666',
        legendFontSize: 12,
      },
    ];

    if (
      props.data.totalAlcoholCalories &&
      props.data.totalAlcoholCalories > 0
    ) {
      newPieChartData.push({
        name: 'Alcohol',
        calories: props.data.totalAlcoholCalories,
        color: '#808080',
        legendFontColor: '#666',
        legendFontSize: 12,
      });
    }
    setPieChartData(newPieChartData);
  }, [props]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Source of Calories</Text>
      <PieChart
        data={pieChartData}
        width={Dimensions.get('window').width - 20}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: '#08130D',
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          barPercentage: 0.5,
        }}
        accessor={'calories'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute={false}
        avoidFalseZero={true}
      />
    </View>
  );
};

export default NutritionPieChart;
