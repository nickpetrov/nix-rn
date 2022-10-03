import moment from 'moment-timezone';
import {store} from 'store/index';

export const today = () => {
  const userTimezone = store.getState().auth.userData.timezone || 'US/Central';
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
  const userTimezone = store.getState().auth.userData.timezone || 'US/Central';
  return moment(date, inputFormat).tz(userTimezone).format(outputFormat);
};

export const diffInDays = (
  dateOne: string,
  inputFormatOne: string,
  dateTwo: string,
  inputFormatTwo: string,
) => {
  const userTimezone = store.getState().auth.userData.timezone || 'US/Central';
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
  const userTimezone = store.getState().auth.userData.timezone || 'US/Central';
  return moment(dateOne, inputFormatOne)
    .tz(userTimezone)
    .isSame(moment(dateTwo, inputFormatTwo).tz(userTimezone));
};
