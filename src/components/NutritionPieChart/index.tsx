// utils
import React, {useEffect, useState, useMemo} from 'react';
import _ from 'lodash';

// types
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {TotalProps} from 'store/userLog/userLog.types';

// hooks
import {useSelector} from 'hooks/useRedux';

// constants
import {Routes} from 'navigation/Routes';

// components
import {View, Text} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

// styles
import {styles} from './NutritionPieChart.styles';

export interface pieChartDataProps {
  totalFatCalories: number;
  totalCarbohydratesCalories: number;
  totalProteinCalories: number;
  totalAlcoholCalories: number | null;
}

interface NutritionPieChartProps {
  data: pieChartDataProps;
  totalCalForPieChart: number;
  clientTotals: Array<TotalProps>;
}

const NutritionPieChart: React.FC<NutritionPieChartProps> = ({
  data,
  totalCalForPieChart,
  clientTotals,
}) => {
  const route = useRoute<RouteProp<StackNavigatorParamList, Routes.Totals>>();
  const userData = useSelector(state => state.auth.userData);
  const clientId = route.params?.clientId;
  const [pieChartData, setPieChartData] = useState<
    Array<{
      name: string;
      calories: number;
      color: string;
      legendFontColor: string;
      legendFontSize: number;
    }>
  >([]);
  const dataForPieChart = useMemo(() => {
    let newDataForPieChart = [
      (data.totalProteinCalories / totalCalForPieChart) * 100,
      (data.totalCarbohydratesCalories / totalCalForPieChart) * 100,
      (data.totalFatCalories / totalCalForPieChart) * 100,
    ];
    if (data.totalAlcoholCalories && data.totalAlcoholCalories > 0) {
      newDataForPieChart.push(
        ((data.totalAlcoholCalories || 0) / totalCalForPieChart) * 100,
      );
    }
    return newDataForPieChart;
  }, [data, totalCalForPieChart]);

  const pieChartPercent = useMemo(() => {
    let newPiChartPercent = [
      _.round(dataForPieChart[0]),
      _.round(dataForPieChart[1]),
      _.round(dataForPieChart[2]),
    ];
    if (dataForPieChart[3]) {
      newPiChartPercent.push(_.round(dataForPieChart[3]));
    }

    let sum = _.sum(newPiChartPercent);
    if (sum > 102 || sum < 98) {
      const coefficient = 100 / sum;
      newPiChartPercent = newPiChartPercent.map(v => _.round(v * coefficient));
      sum = _.sum(newPiChartPercent);
    }

    if (sum !== 100) {
      newPiChartPercent[
        newPiChartPercent.indexOf(_.max(newPiChartPercent) as number)
      ] -= sum - 100;
    }

    return newPiChartPercent;
  }, [dataForPieChart]);

  const dailyGoals = clientId
    ? {
        protein_pct: clientTotals[0].daily_protein_pct,
        protein_progress: Math.round(
          (dataForPieChart[0] / clientTotals[0].daily_protein_pct) * 100,
        ),
        carbohydrate_pct: clientTotals[0].daily_carbs_pct,
        carbohydrate_progress: Math.round(
          (dataForPieChart[1] / clientTotals[0].daily_carbs_pct) * 100,
        ),
        fat_pct: clientTotals[0].daily_fat_pct,
        fat_progress: Math.round(
          (dataForPieChart[2] / clientTotals[0].daily_fat_pct) * 100,
        ),
      }
    : {
        protein_pct: userData.daily_protein_pct,
        protein_progress: Math.round(
          (dataForPieChart[0] / (userData.daily_protein_pct || 0)) * 100,
        ),
        carbohydrate_pct: userData.daily_carbs_pct,
        carbohydrate_progress: Math.round(
          (dataForPieChart[1] / (userData.daily_carbs_pct || 0)) * 100,
        ),
        fat_pct: userData.daily_fat_pct,
        fat_progress: Math.round(
          (dataForPieChart[2] / (userData.daily_fat_pct || 0)) * 100,
        ),
      };

  useEffect(() => {
    const newPieChartData = [
      {
        name: 'Protein',
        calories: pieChartPercent[0] || 0,
        color: '#1aa6b7',
        legendFontColor: '#666',
        legendFontSize: 12,
      },
      {
        name: 'Carbs',
        calories: pieChartPercent[1] || 0,
        color: '#f0ab00',
        legendFontColor: '#666',
        legendFontSize: 12,
      },
      {
        name: 'Fat',
        calories: pieChartPercent[2] || 0,
        color: '#b3217c',
        legendFontColor: '#666',
        legendFontSize: 12,
      },
    ];
    if (pieChartPercent.length > 3 && pieChartPercent[3] > 0) {
      newPieChartData.push({
        name: 'Alcohol',
        calories: pieChartPercent[3] || 0,
        color: '#808080',
        legendFontColor: '#666',
        legendFontSize: 12,
      });
    }

    setPieChartData(newPieChartData);
  }, [pieChartPercent]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Source of Calories</Text>
      {!!dailyGoals &&
        (!!dailyGoals.protein_pct ||
          !!dailyGoals.carbohydrate_pct ||
          !!dailyGoals.fat_pct) && (
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarTitle}>Actual / Goal</Text>
            {dailyGoals.protein_pct !== null && (
              <View style={styles.progressBarItem}>
                <View style={styles.progressBarItemHeader}>
                  <Text
                    style={[
                      pieChartPercent[0] > dailyGoals.protein_pct &&
                        styles.redText,
                    ]}>
                    Protein
                  </Text>
                  <Text>
                    <Text
                      style={[
                        pieChartPercent[0] > dailyGoals.protein_pct &&
                          styles.redText,
                      ]}>
                      {pieChartPercent[0]}%
                    </Text>{' '}
                    / {dailyGoals.protein_pct}%
                  </Text>
                </View>
                <View style={styles.progressbar}>
                  <View
                    style={[
                      {
                        backgroundColor: '#1aa6b7',
                        height: '100%',
                        width: `${
                          (dailyGoals.protein_progress || 0) < 100
                            ? dailyGoals.protein_progress
                            : 100
                        }%`,
                      },
                      pieChartPercent[0] > dailyGoals.protein_pct &&
                        styles.redBg,
                    ]}></View>
                </View>
              </View>
            )}
            {dailyGoals.carbohydrate_pct !== null && (
              <View style={styles.progressBarItem}>
                <View style={styles.progressBarItemHeader}>
                  <Text
                    style={[
                      pieChartPercent[1] > dailyGoals.carbohydrate_pct &&
                        styles.redText,
                    ]}>
                    Carbohydrate
                  </Text>
                  <Text>
                    <Text
                      style={[
                        pieChartPercent[1] > dailyGoals.carbohydrate_pct &&
                          styles.redText,
                      ]}>
                      {pieChartPercent[1]}%
                    </Text>{' '}
                    / {dailyGoals.carbohydrate_pct}%
                  </Text>
                </View>
                <View style={styles.progressbar}>
                  <View
                    style={[
                      {
                        backgroundColor: '#f0ab00',
                        height: '100%',
                        width: `${
                          (dailyGoals.carbohydrate_progress || 0) < 100
                            ? dailyGoals.carbohydrate_progress
                            : 100
                        }%`,
                      },
                      pieChartPercent[1] > dailyGoals.carbohydrate_pct &&
                        styles.redBg,
                    ]}></View>
                </View>
              </View>
            )}
            {dailyGoals.fat_pct !== null && (
              <View style={styles.progressBarItem}>
                <View style={styles.progressBarItemHeader}>
                  <Text
                    style={[
                      pieChartPercent[2] > dailyGoals.fat_pct && styles.redText,
                    ]}>
                    Fat
                  </Text>
                  <Text>
                    <Text
                      style={[
                        pieChartPercent[2] > dailyGoals.fat_pct &&
                          styles.redText,
                      ]}>
                      {pieChartPercent[2]}%
                    </Text>{' '}
                    / {dailyGoals.fat_pct}%
                  </Text>
                </View>
                <View style={styles.progressbar}>
                  <View
                    style={[
                      {
                        backgroundColor: '#b3217c',
                        height: '100%',
                        width: `${
                          (dailyGoals.fat_progress || 0) < 100
                            ? dailyGoals.fat_progress
                            : 100
                        }%`,
                      },
                      pieChartPercent[2] > dailyGoals.fat_pct && styles.redBg,
                    ]}></View>
                </View>
              </View>
            )}
          </View>
        )}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieChartData}
          width={180}
          height={140}
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
          hasLegend={false}
        />
        <View style={styles.itemLabelList}>
          {pieChartData.map(item => (
            <View style={styles.itemLabel} key={item.name}>
              <View
                style={[
                  styles.itemLabelSquare,
                  {backgroundColor: item.color},
                ]}></View>
              <Text style={styles.itemLabelText}>
                {item.name} {item.calories}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NutritionPieChart;
