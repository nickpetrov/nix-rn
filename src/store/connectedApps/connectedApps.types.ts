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

export type fitbitSignInAction = {
  type: connectedAppsActionTypes.FITBIT_SIGN;
  payload: string | null;
};
export type fitbitUnlinkAction = {
  type: connectedAppsActionTypes.FITBIT_UNLINK;
};
export type mergeHKSyncOptionsAction = {
  type: connectedAppsActionTypes.MERGE_HK_SYNC_OPTIONS;
  payload: Partial<hkSyncOptionsProps>;
};
export type clearConnectedAppsAction = {
  type: connectedAppsActionTypes.CLEAR;
};

export type ConnectedAppsActions =
  | fitbitSignInAction
  | fitbitUnlinkAction
  | mergeHKSyncOptionsAction
  | clearConnectedAppsAction;
