//types
import {
  GroceryAgentModeActions,
  groceryAgentModeActionTypes,
  GroceryAgentModeState,
  photoTemplateKeys,
} from './groceryAgentMode.types';

const defaultCurrentSession = {
  barcode: null,
  canSave: false,
  userId: null,
  photos: {
    front: {
      photo_name: null,
      photo_src: null,
      photo_type: 1,
      show: true,
      title: 'Front Package',
      loading: false,
      notUploaded: true,
    },
    nutrition: {
      photo_name: null,
      photo_src: null,
      photo_type: 2,
      show: true,
      title: 'Nutrition Label',
      loading: false,
      notUploaded: true,
    },
    ingredient: {
      photo_name: null,
      photo_src: null,
      photo_type: 3,
      show: false,
      title: 'Ingredient Statement',
      loading: false,
      notUploaded: true,
    },
  },
};

const initialState: GroceryAgentModeState = {
  existingBarcodesCount: 0,
  barcodesForSyncCount: 0,
  currentSession: defaultCurrentSession,
  existingBarcodesUpdateTimestamp: 0,
};

export default (
  state: GroceryAgentModeState = initialState,
  action: GroceryAgentModeActions,
): GroceryAgentModeState => {
  switch (action.type) {
    case groceryAgentModeActionTypes.MERGE_CURRENT_SESSION:
      return {
        ...state,
        currentSession: {...state.currentSession, ...action.payload},
      };
    case groceryAgentModeActionTypes.SET_EXIST_BARCODES_COUNT:
      return {
        ...state,
        existingBarcodesCount: action.payload,
      };
    case groceryAgentModeActionTypes.SET_BARCODES_FOR_SYNC_COUNT:
      return {
        ...state,
        barcodesForSyncCount: action.payload,
      };
    case groceryAgentModeActionTypes.RESET_CURRENT_SESSION:
      return {
        ...state,
        currentSession: defaultCurrentSession,
      };
    case groceryAgentModeActionTypes.SET_CURRENT_SESSION_PHOTO_BY_KEY: {
      const newPhotoByKey = {
        ...state.currentSession.photos[action.key as photoTemplateKeys],
        ...action.payload,
      };
      const newPhotos = {...state.currentSession.photos};
      newPhotos[action.key as photoTemplateKeys] = newPhotoByKey;

      // change canSave
      let canSave = true;
      for (let key in state.currentSession.photos) {
        if (
          !newPhotos[key as photoTemplateKeys].photo_name &&
          newPhotos[key as photoTemplateKeys].show
        ) {
          canSave = false;
        }
      }
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          photos: newPhotos,
          canSave,
        },
      };
    }
    case groceryAgentModeActionTypes.SET_EXISTING_BARCODE_TIMESTAMPE:
      return {
        ...state,
        existingBarcodesUpdateTimestamp: action.payload,
      };
    case groceryAgentModeActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
