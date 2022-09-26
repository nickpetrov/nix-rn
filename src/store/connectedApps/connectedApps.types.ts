export enum connectedAppsActionTypes {
  FITBIT_SIGN = 'FITBIT_SIGN',
  FITBIT_UNLINK = 'FITBIT_UNLINK',
  CLEAR = 'CLEAR',
}

export interface ConnectionAppsState {
  nutritionSyncState: string | null;
}
