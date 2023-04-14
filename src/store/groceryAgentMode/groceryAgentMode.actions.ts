import {
  existingBarcodesTableName,
  recordsForSyncTableName,
} from 'constants/barcode';
import {captureException} from '@sentry/react-native';
import {SQLexecute} from 'helpers/sqlite';
import {Dispatch} from 'redux';
import {RootState} from '../index';
import {setInfoMessage} from '../base/base.actions';
import {store} from 'store';
import _ from 'lodash';
import {
  CurrentSessionProps,
  groceryAgentModeActionTypes,
  photoTemplateKeys,
  PhotoTemplate,
  RecordType,
  mergeCurrentSessionAction,
  setCurrentSessionPhotoByKeyAction,
  resetCurrentSessionAction,
  setExistingBarcodeTimestampAction,
  setExistingBarcodeCountAction,
  setBarcodesForSyncCountAction,
  clearGroceryAgentModeAction,
} from './groceryAgentMode.types';
import baseService from 'api/baseService';
import Q from 'q';
// @ts-ignore
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import {aws_config, pictureFolder} from 'config/index';
import RNFS from 'react-native-fs';
import {decode} from 'base64-arraybuffer';

export const mergeCurrentSession = (data: Partial<CurrentSessionProps>) => {
  return async (dispatch: Dispatch<mergeCurrentSessionAction>) => {
    dispatch({
      type: groceryAgentModeActionTypes.MERGE_CURRENT_SESSION,
      payload: data,
    });
  };
};
export const setExistingBarcodesUpdateTimestamp = (count: number) => {
  return async (dispatch: Dispatch<setExistingBarcodeTimestampAction>) => {
    dispatch({
      type: groceryAgentModeActionTypes.SET_EXISTING_BARCODE_TIMESTAMPE,
      payload: count,
    });
  };
};
export const setExistBarcodesCount = (count: number) => {
  return async (dispatch: Dispatch<setExistingBarcodeCountAction>) => {
    dispatch({
      type: groceryAgentModeActionTypes.SET_EXIST_BARCODES_COUNT,
      payload: count,
    });
  };
};
export const setBarcodesForSyncCount = (count: number) => {
  return async (dispatch: Dispatch<setBarcodesForSyncCountAction>) => {
    dispatch({
      type: groceryAgentModeActionTypes.SET_BARCODES_FOR_SYNC_COUNT,
      payload: count,
    });
  };
};
export const mergePhotoByKey = (
  key: photoTemplateKeys,
  data: Partial<PhotoTemplate>,
) => {
  return async (dispatch: Dispatch<setCurrentSessionPhotoByKeyAction>) => {
    dispatch({
      type: groceryAgentModeActionTypes.SET_CURRENT_SESSION_PHOTO_BY_KEY,
      key,
      payload: data,
    });
  };
};
export const resetCurrentSession = () => {
  return async (dispatch: Dispatch<resetCurrentSessionAction>) => {
    dispatch({type: groceryAgentModeActionTypes.RESET_CURRENT_SESSION});
  };
};
export const resetGroceryAgentMode = (): clearGroceryAgentModeAction => {
  return {type: groceryAgentModeActionTypes.GROCERY_AGENT_MODE_CLEAR};
};

export const barcodeExistsInExistingBarcodes = async (barcode: string) => {
  const db = store.getState().base.db;
  var query =
    'SELECT id FROM ' + existingBarcodesTableName + ' WHERE barcode = ?';
  const result = await SQLexecute({
    db,
    query,
    params: [barcode],
  });

  return result.rows.length !== 0;
};

export const checkBarcodeExistsInRecordForSync = async (barcode: string) => {
  const db = store.getState().base.db;
  var query =
    'SELECT id FROM ' + recordsForSyncTableName + ' WHERE barcode = ?';
  const result = await SQLexecute({
    db,
    query,
    params: [barcode],
  });
  return result.rows.length !== 0;
};

export const checkExistingBarcodesTableExists = async () => {
  const db = store.getState().base.db;
  var query =
    'SELECT name FROM sqlite_master WHERE type="table" AND name="' +
    existingBarcodesTableName +
    '"';
  const result = await SQLexecute({
    db,
    query,
  });
  return result.rows.length !== 0;
};

const existingBarcodesUpdateTimestampIsUpToDate = function (
  existingBarcodesUpdateTimestamp: number,
) {
  var timestamp = new Date().getTime();
  var timestampDifference = timestamp - existingBarcodesUpdateTimestamp;
  var oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  return timestampDifference < oneDayInMilliseconds;
};

const createExistingBarcodesTable = function () {
  const db = store.getState().base.db;
  const query =
    'CREATE TABLE ' +
    existingBarcodesTableName +
    ' (id INTEGER PRIMARY KEY, barcode TEXT)';
  return SQLexecute({
    db,
    query,
  });
};
const deleteExistingBarcodes = function () {
  const db = store.getState().base.db;
  const query = 'DELETE FROM ' + existingBarcodesTableName;
  return SQLexecute({
    db,
    query,
  });
};
const requestExistingBarcodes = async function () {
  try {
    const response = await baseService.getGroceryPhotoUploadUPCList();
    return _.pull(response.data, null);
  } catch (error) {
    captureException(error);
    console.log(error);
  }
};
const countExistingBarcodes = function () {
  const db = store.getState().base.db;
  const query = 'SELECT COUNT(id) AS count FROM ' + existingBarcodesTableName;
  return SQLexecute({
    db,
    query,
  }).then(function (selectResult) {
    return selectResult.rows.item(0).count;
  });
};

const insertExistingBarcodes = function (chunk: any, dispatch: Dispatch<any>) {
  const deferred = Q.defer();

  let temp = '';
  const data: any[] = [];
  chunk.map(function (barcode: string, index: number) {
    data.push(barcode);
    if (index !== 0) temp += ',';
    temp += '(?)';
  });

  const db = store.getState().base.db;
  const query =
    'INSERT INTO ' + existingBarcodesTableName + ' (barcode) VALUES ' + temp;
  SQLexecute({
    db,
    query,
    params: data,
    callback: result => {
      countExistingBarcodes().then(function (count: number) {
        var timestamp = new Date().getTime();
        dispatch(setExistingBarcodesUpdateTimestamp(timestamp));
        deferred.resolve(count);
      });
      console.log(result);
    },
    errorCallback: error => {
      console.log(error);
      deferred.reject(error);
    },
  });
  return deferred.promise;
};

export const needToUpdateExistingBarcodes = () => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    try {
      const existingBarcodesTableExists =
        await checkExistingBarcodesTableExists();

      const existingBarcodesUpdateTimestamp =
        useState().groceryAgentMode.existingBarcodesUpdateTimestamp;

      const needUpdate =
        !existingBarcodesTableExists ||
        !existingBarcodesUpdateTimestampIsUpToDate(
          existingBarcodesUpdateTimestamp,
        );

      if (needUpdate) {
        dispatch(
          setInfoMessage({
            text: 'Please hold while the barcodes table is updated. This should complete within 15 seconds.',
            loadingType: true,
          }),
        );
        checkExistingBarcodesTableExists()
          .then(result => {
            if (!result) {
              createExistingBarcodesTable();
            }
          })
          .then(() => {
            return deleteExistingBarcodes();
          })
          .then(() => {
            return requestExistingBarcodes();
          })
          .then((barcodes: any) => {
            var chunks = _.chunk(barcodes, 500);
            return chunks.reduce(function (promise, chunk) {
              return promise
                .then(() => {
                  return insertExistingBarcodes(chunk, dispatch).then(count => {
                    dispatch(
                      setInfoMessage({
                        text:
                          'Synced ' +
                          count +
                          ' out of ' +
                          barcodes.length +
                          ' records.',
                        loadingType: true,
                      }),
                    );
                    dispatch(setExistBarcodesCount(count as number));
                  });
                })
                .catch(function (error) {
                  dispatch(setInfoMessage(null));
                  captureException(error);
                  throw error;
                });
            }, Q.when(''));
          })
          .then(() => {
            dispatch(setInfoMessage(null));
          });
      } else {
        countExistingBarcodes().then(count => {
          dispatch(setExistBarcodesCount(count));
        });
      }
    } catch (error) {
      captureException(error);
      console.log(error);
      dispatch(
        setInfoMessage({
          text: 'Error during existing barcodes sync. Our developers has been informed.',
          loadingType: true,
          loadTime: 3000,
        }),
      );
    }
  };
};

export const createRecordsForSyncTable = function () {
  const db = store.getState().base.db;
  var query =
    'CREATE TABLE ' +
    recordsForSyncTableName +
    ' (' +
    'id INTEGER PRIMARY KEY, ' +
    'user_id TEXT, ' +
    'barcode TEXT, ' +
    'photo_type INTEGER, ' +
    'photo_name TEXT' +
    ')';
  return SQLexecute({
    db,
    query,
  });
};

export const countRecordsForSyncBarcodes = function () {
  const db = store.getState().base.db;
  var query =
    'SELECT COUNT(DISTINCT barcode) AS count FROM ' + recordsForSyncTableName;
  return SQLexecute({
    db,
    query,
  }).then(selectResult => {
    return selectResult.rows.item(0).count;
  });
};

export const checkRecordsForSyncTableExists = function () {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const db = useState().base.db;
    const query =
      'SELECT name FROM sqlite_master WHERE type="table" AND name="' +
      recordsForSyncTableName +
      '"';
    return SQLexecute({
      db,
      query,
    })
      .then(function (selectResult) {
        return selectResult.rows.length !== 0;
      })
      .then(result => {
        if (!result) {
          createRecordsForSyncTable();
        }
      })
      .then(() => {
        return countRecordsForSyncBarcodes();
      })
      .then(count => {
        dispatch(setBarcodesForSyncCount(count));
      });
  };
};

const insertRecordForSync = function (record: RecordType) {
  const db = store.getState().base.db;
  const values = [
    record.user_id,
    record.barcode,
    record.photo_type,
    record.photo_name,
  ];
  const query =
    'INSERT INTO ' +
    recordsForSyncTableName +
    ' (user_id, barcode, photo_type, photo_name) VALUES (?, ?, ?, ?);';
  return SQLexecute({
    db,
    query,
    params: values,
  });
};

const uploadPhotoSaveRecordsForSync = function () {
  const currentSession = store.getState().groceryAgentMode.currentSession;
  const promises = [];
  for (const key in currentSession.photos) {
    if (currentSession.photos[key as photoTemplateKeys].photo_name) {
      const record: RecordType = {
        user_id: currentSession.userId || '',
        barcode: currentSession.barcode || '',
        photo_type: currentSession.photos[key as photoTemplateKeys].photo_type,
        photo_name:
          currentSession.photos[key as photoTemplateKeys].photo_name || '',
      };
      promises.push(insertRecordForSync(record));
    }
  }
  return Q.all(promises);
};

export const saveRecordsForSync = function () {
  return async (dispatch: Dispatch<any>) => {
    uploadPhotoSaveRecordsForSync()
      .then(() => {
        dispatch(resetCurrentSession());
        return countRecordsForSyncBarcodes();
      })
      .then(count => {
        dispatch(setBarcodesForSyncCount(count));
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const getRecordsForSync = function () {
  const db = store.getState().base.db;
  const query = 'SELECT * FROM ' + recordsForSyncTableName;
  return SQLexecute({
    db,
    query,
  }).then(selectResult => {
    const recordsForSync: RecordType[] = [];
    if (selectResult.rows.length > 0) {
      let i = 0;
      while (i < selectResult.rows.length) {
        recordsForSync.push({
          id: selectResult.rows.item(i).id,
          user_id: selectResult.rows.item(i).user_id,
          barcode: selectResult.rows.item(i).barcode,
          photo_type: selectResult.rows.item(i).photo_type,
          photo_name: selectResult.rows.item(i).photo_name,
        });
        i++;
      }
    }
    return recordsForSync;
  });
};

AWS.config.credentials = new AWS.Credentials(
  aws_config.aws_access_key_id,
  aws_config.aws_secret_access_key,
);
AWS.config.region = aws_config.region;

const uploadBucket = new AWS.S3({
  params: {
    Bucket: aws_config.bucket,
    region: aws_config.region,
  },
});

export const uploadToS3 = (record: RecordType) => {
  var deferred = Q.defer();
  var params = {
    Key: record.photo_name + '.jpg',
    ContentType: 'image/jpeg',
    Body: record.arrayBuffer,
  };

  if (_.includes(params.Key, '.jpg.jpg')) {
    params.Key = _.replace(params.Key, '.jpg.jpg', '.jpg');
  }

  try {
    uploadBucket.upload(params, function (err: any, data: any) {
      if (!err) {
        console.log('upload to s3 success', data);
        deferred.resolve(data.Location);
      } else {
        console.log('upload to s3 error');
        deferred.reject(err);
      }
    });
  } catch (error) {
    captureException(error);
    deferred.reject(error);
  }

  return deferred.promise;
};

const deleteRecordForSync = function (id: string) {
  const db = store.getState().base.db;
  var query = 'DELETE FROM ' + recordsForSyncTableName + ' WHERE id = ?';
  return SQLexecute({
    db,
    query,
    params: [id],
  });
};

export const deleteRecordPhoto = (path: string) => {
  RNFS.unlink(path)
    .then(() => {
      console.log('deleteRecordPhoto - FILE DELETED');
    })
    .catch(err => {
      console.log(err.message);
    });
};

export const syncRecord = (record: RecordType) => {
  return RNFS.exists(`${pictureFolder}/${record.photo_name}`)
    .then(exist => {
      if (exist) {
        return exist;
      } else {
        console.log('file not exist');
        throw new Error('File not exist');
      }
    })
    .then(() => {
      return RNFS.readFile(`${pictureFolder}/${record.photo_name}`, 'base64');
    })
    .then(async base64 => {
      const arrayBuffer = decode(base64);
      return arrayBuffer;
    })
    .then(arrayBuffer => {
      record.arrayBuffer = arrayBuffer;
      return record;
    })
    .then(async rec => {
      return uploadToS3(rec);
    })
    .then(() => {
      return deleteRecordForSync(record.id || '');
    })
    .then(() => {
      return deleteRecordPhoto(`${pictureFolder}/${record.photo_name}`);
    })
    .catch(err => console.log('err syncRecord', err));
};

export const sequentialSync = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(
      setInfoMessage({
        text: 'Please hold while the sync is in progress. This should complete within 15 seconds.',
        loadingType: true,
      }),
    );
    getRecordsForSync().then(recordsForSync => {
      return recordsForSync.map(record => {
        return syncRecord(record)
          .then(() => {
            return countRecordsForSyncBarcodes();
          })
          .then((count: number) => {
            dispatch(setBarcodesForSyncCount(count));
            if (!count) {
              dispatch(
                setInfoMessage({
                  text: 'Sync is complete! Thanks for being so patient.',
                  loadingType: true,
                  loadTime: 2000,
                }),
              );
            } else {
              dispatch(
                setInfoMessage({
                  text:
                    'Please hold while the sync is in progress.' +
                    count +
                    ' barcodes left.',
                  loadingType: true,
                }),
              );
            }
          })
          .catch((error: any) => {
            console.log(error);
          });
      }, Q.when(''));
    });
  };
};
