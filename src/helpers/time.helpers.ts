import moment from 'moment-timezone';

let userTimezone = 'US/Eastern';

export const setTimezone = (timezone: string) => {
  userTimezone = timezone;
};

export const today = () => {
  return moment().tz(userTimezone).format('YYYY-MM-DD');
};

export const offsetDays = (
  date: string,
  inputFormat: string,
  offset: number,
) => {
  return moment(date, inputFormat).add(offset, 'days').format('YYYY-MM-DD');
};

export const formatDate = (
  date: string,
  inputFormat: string | undefined,
  outputFormat: string,
) => {
  return moment(date, inputFormat).tz(userTimezone).format(outputFormat);
};

export const diffInDays = (
  dateOne: string,
  inputFormatOne: string,
  dateTwo: string,
  inputFormatTwo: string,
) => {
  return moment(dateOne, inputFormatOne)
    .tz(userTimezone)
    .diff(moment(dateTwo, inputFormatTwo).tz(userTimezone), 'day');
};

export const isSame = (
  dateOne: string,
  inputFormatOne: string,
  dateTwo: string,
  inputFormatTwo: string,
) => {
  return moment(dateOne, inputFormatOne)
    .tz(userTimezone)
    .isSame(moment(dateTwo, inputFormatTwo).tz(userTimezone));
};
