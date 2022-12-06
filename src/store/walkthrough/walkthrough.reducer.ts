//types
import _ from 'lodash';
import {
  WalkthroughActions,
  walkthroughActionTypes,
  WalkthroughState,
} from './walkthrough.types';

const initialState: WalkthroughState = {
  checkedEvents: {
    firstLogin: {
      value: false,
      steps: [
        {
          title: 'Smart Search',
          text: 'Search all foods here.',
        },
        {
          title: 'Barcode Scanner',
          text: 'Use the barcode scanner to quickly log packaged foods.',
        },
        {
          title: 'Basket',
          text: 'Review foods in your basket before logging.',
        },
        {
          title: 'Log by Voice',
          text: 'Click the +Track button to log by voice.',
        },
      ],
    },
    firstFoodAddedToFoodLog: {
      value: false,
      steps: [
        {
          title: 'Daily Summary',
          text: 'Keep track of your daily totals by tapping on the calorie bar to view your Daily Summary.',
        },
        {
          title: 'Meal Summary',
          text: 'Or view summaries by meal.',
        },
        {
          title: 'Delete or Copy a Food',
          text: 'Swipe left to quickly delete or copy a food.',
        },
        {
          title: 'Delete or Copy a Meal',
          text: 'Or swipe left on a meal to quickly delete or copy a whole meal.',
        },
      ],
    },
    firstFoodAddedToBasket: {
      value: false,
      steps: [
        {
          title: 'Edit Quantity',
          text: 'Easily change the serving size or serving unit.',
        },
        {
          title: 'Nutrition Data Preview',
          text: "Click here to view an item's nutrition information before logging.",
        },
      ],
    },
    firstMultipleFoodsInBasket: {
      value: false,
      steps: [
        {
          title: 'Edit Quantity',
          text: 'Easily change the serving size or serving unit.',
        },
        {
          title: 'Nutrition Data Preview',
          text: "Click here to view an item's nutrition information before logging.",
        },
        {
          title: 'Log as a Single Food',
          text: 'Use this option to combine your Basket contents into a recipe or single meal.',
        },
      ],
    },
    firstEnterInTrackTab: {
      value: false,
      steps: [
        {
          title: 'Freeform',
          text: 'Click into the box to pull up your keyboard. Type freeform text or click the microphone button to speak your foods.',
        },
        {
          title: 'Specific Searches',
          text: 'Search specifically within a restaurant menu, for a packaged food, or for previously logged foods in your History.',
        },
      ],
    },
    firstOfflineMode: {
      value: false,
      steps: [
        {
          title: 'Offline Mode',
          text: 'The Track app relies on a steady internet connection in order to pull the most up-to-date nutrition information directly from the Nutritionix verified database. When the app enters offline mode, you will need to connect to a more reliable internet source in order to look up and/or log new foods.',
        },
      ],
    },
  },
  currentTooltip: null,
};

export default (
  state: WalkthroughState = initialState,
  action: WalkthroughActions,
) => {
  switch (action.type) {
    case walkthroughActionTypes.SET_CHECKED_EVENTS: {
      const newCheckedEvents = _.cloneDeep(state.checkedEvents);
      newCheckedEvents[action.payload.name].value = action.payload.value;

      return {
        ...state,
        checkedEvents: newCheckedEvents,
        currentTooltip: null,
      };
    }
    case walkthroughActionTypes.SET_CONTENT: {
      return {
        ...state,
        currentTooltip: action.payload,
      };
    }
    case walkthroughActionTypes.WALKTHROUGH_CLEAR:
      return initialState;
    default:
      return state;
  }
};
