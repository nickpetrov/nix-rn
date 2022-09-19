import moment from 'moment-timezone';

const maxPoints = 10;

export const pickerOptions = [
  {label: 'Last 7 days', value: 'week'},
  {label: 'Last 30 days', value: 'month'},
  {label: 'This month', value: 'thisMonth'},
  {label: 'Previous month', value: 'prevMonth'},
  {label: 'Last 3 months', value: 'lastQuater'},
  {label: 'Last 6 months', value: 'lastHalfYear'},
  {label: 'Since starting weight', value: 'fromStart'},
];

export const getDatesByInterval = (interval: string) => {
  let from: Date | null = new Date();
  let to: Date | null = new Date();

  switch (interval) {
    case 'week':
      from = moment().startOf('day').subtract(7, 'days').toDate();
      to = moment().startOf('day').toDate();
      break;
    case 'month':
      from = moment().startOf('day').subtract(30, 'days').toDate();
      to = moment().startOf('day').toDate();
      break;
    case 'thisMonth':
      from = moment().startOf('month').toDate();
      to = moment().startOf('day').toDate();
      break;
    case 'prevMonth':
      from = moment().subtract(1, 'month').startOf('month').toDate();
      to = moment(from).endOf('month').toDate();
      break;
    case 'lastQuater':
      from = moment().subtract(3, 'month').toDate();
      to = moment().startOf('day').toDate();
      break;
    case 'lastHalfYear':
      from = moment().subtract(6, 'month').toDate();
      to = moment().startOf('day').toDate();
      break;
    case 'fromStart':
      from = null;
      to = moment().startOf('day').toDate();
      break;
    default:
      from = new Date();
      to = new Date();
      break;
  }

  return {from, to};
};

export const getWeightChartData = (weightLog: any, from: any, to: any) => {
  const months = Math.round(moment(to).diff(moment(from), 'month', true));
  if (from === null) {
    from = moment(new Date()).subtract(20, 'years');
  }

  let dateFormat = '';
  if (months < 4) {
    dateFormat = 'MMM DD';
  } else {
    dateFormat = "MMM 'YY";
  }

  const dates = {};
  const weightLogBoundaries = weightLog
    .filter(
      (record: {timestamp: string}) =>
        moment(record.timestamp).isBefore(moment(to)) &&
        moment(record.timestamp).isAfter(moment(from)),
    )
    .sort((a: any, b: any) => moment(a.timestamp).isAfter(moment(b.timestamp)));
  weightLogBoundaries.forEach(function (weight: any) {
    const date = moment(weight.timestamp).format(dateFormat);
    if (!dates[date]) {
      dates[date] = [];
    }
    dates[date].push(weight.kg);
    if (
      !dates[date].mostRecent ||
      dates[date].mostRecent.timestamp < weight.timestamp
    ) {
      dates[date].mostRecent = weight;
    }
    if (
      !dates[date].veryFirst ||
      dates[date].veryFirst.timestamp > weight.timestamp
    ) {
      dates[date].veryFirst = weight;
    }
  });

  let datesKeys = Object.keys(dates);

  Object.entries(dates).forEach(function ([date, weights]) {
    if (date === datesKeys[datesKeys.length - 1]) {
      dates[date] = weights.mostRecent.kg;
    } else if (date === datesKeys[0] && from === null) {
      dates[date] = weights.veryFirst.kg;
    } else {
      dates[date] = weights.reduce((acc, val) => acc + val) / weights.length;
    }
  });
  if (datesKeys.length > maxPoints) {
    const intervalLength = (datesKeys.length - 2) / (maxPoints - 2);
    const tmp = [];

    for (let i = 1; i <= maxPoints - 2; i += 1) {
      const startIndex = 1 + (i - 1) * intervalLength;
      const endIndex = 1 + i * intervalLength;

      let index = (startIndex + endIndex) / 2;

      index = i <= (maxPoints - 2) / 2 ? Math.ceil(index) : Math.floor(index);

      tmp.push(datesKeys[index]);
    }

    tmp.unshift(datesKeys[0]);
    tmp.push(datesKeys[datesKeys.length - 1]);

    datesKeys = [...new Set(tmp)];
  }

  return {labels: datesKeys, values: datesKeys.map(key => dates[key])};
};
