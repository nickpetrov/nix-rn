export enum groceryAgentModeActionTypes {
  MERGE_CURRENT_SESSION = 'MERGE_CURRENT_SESSION',
  SET_CURRENT_SESSION_PHOTO_BY_KEY = 'SET_CURRENT_SESSION_PHOTO_BY_KEY',
  RESET_CURRENT_SESSION = 'RESET_CURRENT_SESSION',
  SET_EXISTING_BARCODE_TIMESTAMPE = 'SET_EXISTING_BARCODE_TIMESTAMPE',
  SET_EXIST_BARCODES_COUNT = 'SET_EXIST_BARCODES_COUNT',
  SET_BARCODES_FOR_SYNC_COUNT = 'SET_BARCODES_FOR_SYNC_COUNT',
  CLEAR = 'CLEAR',
}
export interface PhotoTemplate {
  photo_name: null | string;
  photo_src: null | string;
  photo_type: number;
  show: boolean;
  title: string;
  loading: boolean;
  notUploaded: boolean;
}

export type RecordType = {
  user_id: string;
  barcode: string;
  photo_type: number;
  photo_name: string;
  arrayBuffer?: ArrayBuffer;
  id?: string;
};

export enum photoTemplateKeys {
  front = 'front',
  nutrition = 'nutrition',
  ingredient = 'ingredient',
}

export type CurrentSessionProps = {
  barcode: null | string;
  canSave: boolean;
  userId: null | string;
  photos: {
    [key in photoTemplateKeys]: PhotoTemplate;
  };
};

export interface GroceryAgentModeState {
  existingBarcodesCount: number;
  barcodesForSyncCount: number;
  currentSession: CurrentSessionProps;
  existingBarcodesUpdateTimestamp: number;
}
