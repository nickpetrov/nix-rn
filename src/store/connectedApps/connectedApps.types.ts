export enum connectedAppsActionTypes {
  FITBIT_SIGN = 'FITBIT_SIGN',
  FITBIT_UNLINK = 'FITBIT_UNLINK',
  MERGE_HK_SYNC_OPTIONS = 'MERGE_HK_SYNC_OPTIONS',
  CLEAR = 'CLEAR',
}

export type hkSyncOptionsProps = {
  nutrition: string;
  weight: string;
  exercise: string;
};

export interface ConnectionAppsState {
  fitbitSync: string | null;
  hkSyncOptions: hkSyncOptionsProps;
}
