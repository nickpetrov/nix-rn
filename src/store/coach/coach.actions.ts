// utils
import {Dispatch} from 'redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {captureException} from '@sentry/react-native';

// services
import coachService from 'api/coachService';

// actions
import {getUserDataFromAPI} from 'store/auth/auth.actions';

// types
import {
  addCoachAction,
  becomeCoachAction,
  coachActionTypes,
  getClientTotalsAction,
  getCoachesAction,
  removeCoachAction,
  getClientsAction,
  getClientFoogLogAction,
  clearClientTotalsAndFoodsAction,
  changeClientSelectedDateAction,
  getClientExercisesAction,
  clearCoachAction,
  changeClientLogDateRangeLogAction,
} from './coach.types';
import {OptionsProps} from 'api/coachService/types';
import {RootState} from '../index';
import {SQLexecute, SQLgetGetAll} from 'helpers/sqlite';
import {User} from 'store/auth/auth.types';
import * as timeHelper from 'helpers/time.helpers';
import {batch} from 'react-redux';

export const getClientTotals = (options: Partial<OptionsProps>) => {
  return async (dispatch: Dispatch<getClientTotalsAction>) => {
    let newOptions = {...options};
    if (_.isEmpty(newOptions)) {
      newOptions = {};
    }

    if (!newOptions.begin) {
      newOptions.begin = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.end) {
      newOptions.end = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.timezone) {
      newOptions.timezone = 'US/Eastern';
    }
    try {
      const response = await coachService.getClientTotals(
        newOptions as OptionsProps,
      );

      const result = response.data;
      if (__DEV__) {
        console.log('client totals', result);
      }
      if (result.dates) {
        dispatch({
          type: coachActionTypes.GET_CLIENT_TOTTALS,
          payload: result.dates,
        });
      }
    } catch (err: any) {
      if (err?.status !== 0) {
        captureException(err);
      }
      throw err;
    }
  };
};

export const getClientFoodLog = (options: Partial<OptionsProps>) => {
  return async (dispatch: Dispatch<getClientFoogLogAction>) => {
    let newOptions = {...options};
    if (_.isEmpty(newOptions)) {
      newOptions = {};
    }

    if (!newOptions.begin) {
      newOptions.begin = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.end) {
      newOptions.end = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.timezone) {
      newOptions.timezone = 'US/Eastern';
    }
    try {
      const response = await coachService.getClientFoodLog(
        newOptions as OptionsProps,
      );

      const result = response.data;
      if (__DEV__) {
        console.log('client foodlog', result);
      }
      if (result.foods) {
        dispatch({
          type: coachActionTypes.GET_CLIENT_FOODLOG,
          payload: result.foods,
        });
      }
    } catch (err: any) {
      if (err?.status !== 0) {
        captureException(err);
      }
      throw err;
    }
  };
};
export const getClientExercisesLog = (options: Partial<OptionsProps>) => {
  return async (dispatch: Dispatch<getClientExercisesAction>) => {
    let newOptions = {...options};
    if (_.isEmpty(newOptions)) {
      newOptions = {};
    }

    if (!newOptions.begin) {
      newOptions.begin = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.end) {
      newOptions.end = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (!newOptions.timezone) {
      newOptions.timezone = 'US/Eastern';
    }
    try {
      const response = await coachService.getClientExerciseslog(
        newOptions as OptionsProps,
      );

      const result = response.data;
      if (__DEV__) {
        console.log('client exercises', result);
      }
      if (result.exercises) {
        dispatch({
          type: coachActionTypes.GET_CLIENT_EXERCISES_LOG,
          payload: result.exercises,
        });
      }
    } catch (err: any) {
      if (err?.status !== 0) {
        captureException(err);
      }
      throw err;
    }
  };
};

export const clearCoachState = () => {
  return async (dispatch: Dispatch<clearCoachAction>) => {
    dispatch({
      type: coachActionTypes.COACH_CLEAR,
    });
  };
};

export const clearClientTotalsAndFoods = () => {
  return async (dispatch: Dispatch<clearClientTotalsAndFoodsAction>) => {
    dispatch({
      type: coachActionTypes.CLEAR_CLIENT_TOTALS_AND_FOODS,
    });
  };
};

export const becomeCoach = () => {
  return async (dispatch: Dispatch<becomeCoachAction>) => {
    try {
      const res = await coachService.becomeCoach();
      if (!!res && !!res.data && !!res.data.code) {
        dispatch<any>(getUserDataFromAPI());
      }
    } catch (err: any) {
      console.log('error become coach', err);
      if (err?.status !== 0) {
        captureException(err);
      }
    }
  };
};
export const stopBeingCoach = () => {
  return async () => {
    try {
      await coachService.stopBeingCoach();
    } catch (err: any) {
      console.log('error stop being a coach', err);
      if (err?.status !== 0) {
        captureException(err);
      }
    }
  };
};

export const getClients = () => {
  return async (dispatch: Dispatch<getClientsAction>) => {
    try {
      const res = await coachService.getClients();
      if (!res || !res.data || !res.data.patients) {
        return;
      } else {
        let clientList: User[] = [];
        _.forEach(res.data.patients, user => {
          clientList.push(user);
        });
        dispatch({
          type: coachActionTypes.GET_CLIENTS,
          payload: clientList,
        });
      }
    } catch (err: any) {
      console.log('error get clients', err);
      if (err?.status !== 0) {
        captureException(err);
      }
    }
  };
};

export const getCoaches = () => {
  return async (dispatch: Dispatch<getCoachesAction>) => {
    try {
      const res = await coachService.getCoaches();
      dispatch({
        type: coachActionTypes.GET_COACHES,
        payload: res.data.coaches,
      });
    } catch (err: any) {
      console.log('error get coaches', err);
      if (err?.status !== 0) {
        captureException(err);
      }
    }
  };
};

export const addCoach = (coachCode: string) => {
  return async (dispatch: Dispatch<addCoachAction>) => {
    try {
      const res = await coachService.addCoach(coachCode);
      dispatch({
        type: coachActionTypes.ADD_COACH,
        payload: res.data,
      });
    } catch (err: any) {
      if (err?.status !== 0) {
        captureException(err);
      }
      throw err;
    }
  };
};
export const removeCoach = (coachCode: string) => {
  return async (dispatch: Dispatch<removeCoachAction>) => {
    try {
      await coachService.removeCoach(coachCode);
      dispatch({
        type: coachActionTypes.REMOVE_COACH,
        payload: coachCode,
      });
    } catch (err: any) {
      console.log('error remove coach', err);
      if (err?.status !== 0) {
        captureException(err);
      }
    }
  };
};

export const checkSubscriptions = () => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const db = useState().base.db;
    await SQLexecute({
      db,
      query:
        'CREATE TABLE IF NOT EXISTS iap_receipts (id INTEGER PRIMARY KEY, receipt TEXT, signature TEXT)',
    });

    let sqlReceiptID = '';
    SQLexecute({db, query: 'SELECT * FROM iap_receipts'})
      .then(function (result) {
        //receipt exists so they bought a subscription
        if (result.rows.length >= 1) {
          const res = SQLgetGetAll(result);
          const latestEntry = res[res.length - 1];
          sqlReceiptID = latestEntry.id;
          const receipt = latestEntry.receipt;
          const signature = latestEntry.signature;
          console.log('checkSubscriptions receipt', receipt);
          return coachService.validatePurchase(receipt, signature);
        }
      })
      .then(function (resp) {
        if (resp) {
          //receipt is expired, so delete it
          if (resp.data.premium_user === false) {
            SQLexecute({db, query: 'DELETE FROM iap_receipts'}).catch(function (
              err,
            ) {
              console.log(
                'there was an error deleting the expired receipt',
                err,
              );
            });
          } else {
            dispatch<any>(getUserDataFromAPI());
            var latest_receipt = resp.data.latest_receipt;
            SQLexecute({
              db,
              query: 'UPDATE iap_receipts SET receipt=? where id=?',
              params: [latest_receipt, sqlReceiptID],
            }).catch(function (err) {
              console.log('there was error upating latest receipt', err);
            });
          }
        }
      })
      .catch(function (err: any) {
        console.log(err);
        if (err?.status !== 0) {
          captureException(err);
        }
      });
  };
};

export const changeClientSelectedDay = (newDate: string) => {
  return async (dispatch: Dispatch<changeClientSelectedDateAction>) => {
    dispatch({
      type: coachActionTypes.CHANGE_CLIENT_SELECTED_DATE,
      newDate: newDate,
    });
  };
};

export const changeClientLogDateRange = (
  dateRange: [string, string] | null,
) => {
  return async (dispatch: Dispatch<changeClientLogDateRangeLogAction>) => {
    dispatch({
      type: coachActionTypes.CHANGE_CLIENT_LOG_DATE_RANGE,
      payload: dateRange,
    });
  };
};

export const refreshClientLog = (
  options: Partial<OptionsProps>,
  selectedDate: string,
  refresh?: boolean,
) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    let newOptions = {...options};
    if (_.isEmpty(newOptions)) {
      newOptions = {};
    }
    const clientDateRange = useState().coach.clientDateRange;
    const needUpdateAfterChangeSelectedDate =
      clientDateRange &&
      !moment(selectedDate).isBetween(
        clientDateRange[0],
        clientDateRange[1],
        'days',
      );

    if (needUpdateAfterChangeSelectedDate || refresh || !clientDateRange) {
      if (!newOptions.begin) {
        newOptions.begin = timeHelper.offsetDays(
          selectedDate,
          'YYYY-MM-DD',
          -7,
        );
      }
      if (!newOptions.end) {
        newOptions.end = timeHelper.offsetDays(selectedDate, 'YYYY-MM-DD', 7);
      }
      if (!newOptions.timezone) {
        newOptions.timezone = 'US/Eastern';
      }
      batch(() => {
        if (newOptions.begin && newOptions.end) {
          dispatch(
            changeClientLogDateRange([newOptions.begin, newOptions.end]),
          );
        }
        dispatch(getClientFoodLog(newOptions));
        dispatch(getClientExercisesLog(newOptions));
        dispatch(getClientTotals(newOptions));
      });
    } else {
      return;
    }
  };
};
