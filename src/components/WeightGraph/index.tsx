// utils
import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

// components
import {Text, View, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import ModalSelector from 'react-native-modal-selector';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

// constants
import {Colors} from 'constants/Colors';

// types
import {WeightProps} from 'store/userLog/userLog.types';
import PowerWithGradientProps from 'components/PowerWithGradient';
import Graph from './components/Graph';

export const WeightGraph: React.FC = () => {
  const dispatch = useDispatch();
  const timezone = useSelector(state => state.auth.userData.timezone);
  const weights = useSelector(state => state.stats.weights);
  const [showDatePickers, setShowDatePickers] = useState({
    from: false,
    to: false,
  });
  const [dates, setDates] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: moment().subtract(3, 'month').toDate(),
    to: new Date(),
  });
  const [weightData, setWeightData] = useState<WeightProps[] | []>([]);
  const measure_system = useSelector(
    state => state.auth.userData.measure_system,
  );
  const weightUnit = measure_system ? 'kg' : 'lbs';

  useEffect(() => {
    const params = {
      begin: moment(dates.from).format('YYYY-MM-DD'),
      end: moment(dates.to).add('1', 'day').format('YYYY-MM-DD'),
      timezone,
      offset: 0,
      limit: 500,
    };
    dispatch(getStatsWeight(params)).then(res => {
      if (res && res.length === 500) {
        dispatch(getStatsWeight({...params, offset: 500}));
      }
    });
  }, [dispatch, dates, timezone]);

  useEffect(() => {
    setWeightData(
      weights
        .filter(item => item.kg)
        .map(item => {
          const kgValue = measure_system
            ? item.kg
            : item.kg > 0
            ? _.round(item.kg * 2.20462, 1)
            : item.kg;
          return {
            ...item,
            kg: isNaN(kgValue) ? 0 : kgValue,
          };
        }),
    );
  }, [weights, measure_system]);

  const handleShowDatePickers = (pickerType: 'from' | 'to') => () => {
    setShowDatePickers({
      ...showDatePickers,
      [pickerType]: true,
    });
  };

  const handleCloseDatePickers = (pickerType: 'from' | 'to') => () => {
    setShowDatePickers({
      ...showDatePickers,
      [pickerType]: false,
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
  const endText =
    chartData.values.length &&
    moment(dates.to).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      ? 'Current'
      : 'End';
  const change = _.round(
    chartData.values[chartData.values.length - 1] - chartData.values[0],
    1,
  );
  const changePercentage = _.round((change / chartData.values[0]) * 100, 0);
  const pickers: Array<'from' | 'to'> = ['from', 'to'];

  return (
    <View style={styles.root}>
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
            initValue={pickerOptions[4].label}
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
            <Text>
              {dates[pickerType]
                ? moment(dates[pickerType]).format('MM/DD/YYYY')
                : ''}
            </Text>
            <DatePicker
              key={pickerType}
              modal
              open={showDatePickers[pickerType]}
              mode="date"
              date={dates[pickerType] || new Date()}
              onConfirm={handleChangeDates(pickerType)}
              onCancel={handleCloseDatePickers(pickerType)}
              maximumDate={new Date()}
            />
            <FontAwesome name="calendar" size={20} />
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.chartContainer}>
        {chartData.values.length >= 1 ? (
          <>
            <View style={styles.labels}>
              <View>
                <Text style={styles.labelTitle}>
                  {chartData.values[0]?.toFixed(1)} {weightUnit}
                </Text>
                <Text style={styles.labelNote}>Start</Text>
              </View>
              <View>
                <Text style={styles.labelTitle}>
                  {chartData.values[chartData.values.length - 1]?.toFixed(1)}{' '}
                  {weightUnit}
                </Text>
                <Text style={styles.labelNote}>{endText}</Text>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <PowerWithGradientProps
                    key={`gradient-${change < 0 ? 'down' : 'up'}`}
                    maskStyle={{height: 12}}
                    gradient={
                      change > 0 ? ['#DC0000', '#fff'] : ['#fff', '#6AB316']
                    }>
                    <FontAwesome
                      name={
                        change === 0
                          ? 'minus'
                          : change < 0
                          ? 'arrow-down'
                          : 'arrow-up'
                      }
                      style={[styles.labelIcon]}
                    />
                  </PowerWithGradientProps>
                  <Text style={styles.labelTitle}>
                    {change} {weightUnit}
                  </Text>
                </View>
                <Text style={styles.labelNote}>
                  Change ({changePercentage > 0 ? '+' : ''}
                  {Math.abs(changePercentage)}%)
                </Text>
              </View>
            </View>
            <Graph weightUnit={weightUnit} chartData={chartData} />
          </>
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
