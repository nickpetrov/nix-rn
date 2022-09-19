// utils
import React, {useEffect, useState} from 'react';
import moment from 'moment';

// components
import {ScrollView} from 'react-native';
import Svg, {G, Rect, Text} from 'react-native-svg';

// hooks
import {useDispatch} from 'hooks/useRedux';

// actions
import {changeSelectedDay} from 'store/userLog/userLog.actions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Routes} from '../../navigation/Routes';

interface HeatMapProps {
  colors?: Array<string>;
  daysInMonth: string;
  skipFromStart: number;
  squareSize?: number;
  gutterSize?: number;
  values: Array<number>;
  targets: Array<number>;
  selectedMonth: string;
  navigation: NativeStackNavigationProp<any>;
}

const HeatMap: React.FC<HeatMapProps> = props => {
  const dispatch = useDispatch();
  const colorsArray = props.colors || [
    '#ededed',
    '#58a61c',
    '#88c25a',
    '#bbdca2',
    '#f29898',
    '#e64a48',
    '#dc0000',
  ];
  const [canvasWidth, setCanvasWidth] = useState(200);
  const [canvasHeight, setCanvasHeight] = useState(200);
  const [daysInMonth, setDaysInMonth] = useState<string>(
    props.daysInMonth || '30',
  );
  const [weeksInMonth, setWeeksInMonth] = useState(
    Math.ceil(
      (parseInt(props.daysInMonth) +
        parseInt(String(props.skipFromStart)) +
        1) /
        7,
    ) || 4,
  );

  const SQUARE_SIZE = props.squareSize || 30;
  const gutterSize = props.gutterSize || 5;

  const [targets, setTargets] = useState(props.targets);
  const [values, setValues] = useState(props.values || []);

  useEffect(() => {
    setTargets(props.targets);
    setValues(props.values);
    if (props.daysInMonth) {
      setDaysInMonth(props.daysInMonth);
    }
    setWeeksInMonth(
      Math.ceil(
        (parseInt(props.daysInMonth) +
          parseInt(String(props.skipFromStart)) +
          1) /
          7,
      ),
    );
  }, [props]);

  useEffect(() => {
    setCanvasWidth((SQUARE_SIZE + gutterSize) * 7);
  }, [gutterSize, SQUARE_SIZE]);

  useEffect(() => {
    setCanvasHeight((SQUARE_SIZE + gutterSize) * weeksInMonth);
  }, [gutterSize, SQUARE_SIZE, weeksInMonth]);

  const getSquareSizeWithGutter = () => {
    return SQUARE_SIZE + gutterSize;
  };

  const getFillColor = (value: number, goal: number) => {
    const percent = Math.round((value / goal) * 100);
    let color = colorsArray[0];
    switch (true) {
      case percent >= 110:
        color = colorsArray[6];
        break;
      case percent >= 104:
        color = colorsArray[5];
        break;
      case percent >= 100:
        color = colorsArray[4];
        break;
      case percent >= 66:
        color = colorsArray[3];
        break;
      case percent >= 33:
        color = colorsArray[2];
        break;
      case percent > 0 && percent < 33:
        color = colorsArray[1];
        break;
      default:
        color = colorsArray[0];
    }
    return color;
  };

  const getSquareCoordinates = (dayIndex: number, weekIndex: number) => {
    const multiplyer = dayIndex % 7;
    return [
      multiplyer * getSquareSizeWithGutter() + '',
      weekIndex * getSquareSizeWithGutter() + '',
    ];
  };

  const renderSquare = (dayIndex: number, weekIndex: number) => {
    const [x, y] = getSquareCoordinates(dayIndex, weekIndex);
    const fillColor = getFillColor(
      values[dayIndex - parseInt(String(props.skipFromStart)) - 1] || 0,
      targets[dayIndex - parseInt(String(props.skipFromStart)) - 1] || 2000,
    );
    return (
      <G
        key={`${dayIndex}-${weekIndex}-${String(props.skipFromStart)}`}
        onPress={() => {
          console.log('props.selectedMonth', props.selectedMonth);
          console.log('props.skipFromStart', props.skipFromStart);
          const newDate = moment()
            .set('month', +moment().month(props.selectedMonth).format('M') - 1)
            .startOf('month')
            .add(dayIndex - parseInt(String(props.skipFromStart)) - 1, 'days')
            .format('YYYY-MM-DD');
          dispatch(changeSelectedDay(newDate));
          props.navigation.replace(Routes.Dashboard);
        }}>
        <Rect
          key={dayIndex}
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          x={x}
          y={y}
          // title={getTitleForIndex(index, valueCache, titleForValue)}
          // onPress={() => handleClick(index)}
          fill={fillColor}
          // {...getTooltipDataAttrsForIndex(index, valueCache, tooltipDataAttrs)}
        />
        <Text
          x={parseInt(x) + SQUARE_SIZE / 2}
          y={parseInt(y) + (SQUARE_SIZE + gutterSize) / 2}
          fontSize={10}
          fill={'#000'}
          textAnchor="middle">
          {dayIndex - parseInt(String(props.skipFromStart))}
        </Text>
      </G>
    );
  };

  const renderMonth = () => {
    let month = [];
    let weekIndex = -1;
    for (
      let i = 0;
      i < parseInt(daysInMonth) + parseInt(String(props.skipFromStart)) + 1;
      i++
    ) {
      if (i % 7 === 0) {
        weekIndex += 1;
      }
      if (weekIndex === 0 && i < parseInt(String(props.skipFromStart)) + 1) {
        month.push(null);
      } else {
        month.push(renderSquare(i, weekIndex));
      }
    }
    return month;
  };

  return (
    <ScrollView>
      <Svg
        // style={{ borderWidth: 1, borderColor: 'red' }}
        height={canvasHeight}
        width={canvasWidth}>
        {renderMonth()}
      </Svg>
    </ScrollView>
  );
};

export default HeatMap;
