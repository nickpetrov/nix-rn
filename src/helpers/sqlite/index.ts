import _ from 'lodash';
import {
  ResultSet,
  SQLError,
  SQLiteDatabase,
  Transaction,
} from 'react-native-sqlite-storage';

interface SQLexecuteProps {
  db: SQLiteDatabase | null;
  query: string;
  params?: any[];
  callback?: (res: ResultSet) => void;
  errorCallback?: (error: SQLError) => void;
}

export const SQLexecute = ({
  db,
  query,
  params,
  callback,
  errorCallback,
}: SQLexecuteProps) => {
  if (!db) {
    return;
  }
  db?.transaction((tx: Transaction) => {
    tx.executeSql(
      query,
      params || [],
      (transaction: Transaction, res: ResultSet) => {
        console.log(`query ${query} completed`, res);
        callback && callback(res);
      },
      (transaction: Transaction, error: SQLError) => {
        console.log(`query ${query} error`, error);
        errorCallback && errorCallback(error);
      },
    );
  });
};

export function SQLgetById(result: ResultSet) {
  var output = null;
  if (result.rows.length > 0) {
    output = _.cloneDeep(result.rows.item(0));
  }
  return output;
}
