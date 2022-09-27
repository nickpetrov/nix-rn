// utils
import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';

// components
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {LineChart} from 'react-native-chart-kit';

// helpers
import {
  getDatesByInterval,
  pickerOptions,
  getWeightChartData,
} from './WeightGraph.utils';

// styles
import {styles} from './WeightGraph.styles';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {getStatsWeight} from 'store/stats/stats.actions';
import ModalSelector from 'react-native-modal-selector';
import {Colors} from '../../constants/Colors';

export const WeightGraph: React.FC = () => {
  const dispatch = useDispatch();
  const weights = useSelector(state => state.stats.weights);
  const [showDatePickers, setShowDatePickers] = useState({
    from: false,
    to: false,
  });
  const [dates, setDates] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: moment().subtract(7, 'days').toDate(),
    to: new Date(),
  });
  const [weightData, setWeightData] = useState([]);

  useEffect(() => {
    dispatch(getStatsWeight());
  }, [dispatch]);

  useEffect(() => {
    setWeightData(weights);
  }, [weights]);

  const handleShowDatePickers = (pickerType: 'from' | 'to') => () => {
    setShowDatePickers({
      ...showDatePickers,
      [pickerType]: !showDatePickers[pickerType],
    });
  };

  const handleChangeDates = (pickerType: 'from' | 'to') => (newDate: Date) => {
    setDates({...dates, [pickerType]: newDate});
  };

  const resetDatesByInterval = (interval: string) => {
    if (!interval) return;
    const {from, to} = getDatesByInterval(interval);
    setDates({from, to});
  };

  const chartData = getWeightChartData(weightData, dates.from, dates.to);

  const pickers: Array<'from' | 'to'> = ['from', 'to'];

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Weight Graph</Text>
      </View>
      <View style={styles.section}>
        <Text>Interval</Text>
        <Text>
          <ModalSelector
            selectStyle={{
              borderWidth: 0,
            }}
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
            data={pickerOptions}
            initValue={pickerOptions[0].label}
            onChange={option => {
              resetDatesByInterval(option.value);
            }}
            listType="FLATLIST"
            keyExtractor={(item: {label: string; value: string}) => item.value}
          />
        </Text>
      </View>
      {pickers.map(pickerType => (
        <TouchableOpacity
          key={pickerType}
          onPress={handleShowDatePickers(pickerType)}>
          <View style={styles.section}>
            <Text style={styles.textEmphasized}>{pickerType}</Text>
            <Text>{new Date(dates[pickerType] as Date).toDateString()}</Text>
            <DatePicker
              modal
              open={showDatePickers[pickerType]}
              mode="date"
              date={dates[pickerType] || new Date()}
              onConfirm={handleChangeDates(pickerType)}
              onCancel={handleShowDatePickers(pickerType)}
              maximumDate={new Date()}
            />
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.section}>
        {chartData.values.length >= 1 ? (
          <LineChart
            verticalLabelRotation={60}
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.values,
                },
                {
                  data: [Math.round(Math.min(...chartData.values)) - 10],
                  withDots: false,
                },
              ],
            }}
            width={Dimensions.get('window').width - 40}
            height={340}
            chartConfig={{
              propsForLabels: {
                fontSize: 11,
              },
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 230, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '3',
                strokeWidth: '1',
                stroke: 'rgb(0, 0, 180)',
              },
            }}
            bezier
            style={styles.lineChart}
          />
        ) : (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              No data has been tracked for this period
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
