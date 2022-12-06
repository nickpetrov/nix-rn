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
        // sequence #0
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
    firstFoodAddedToFoodLog: {value: false, steps: []},
    firstFoodAddedToBasket: {value: false, steps: []},
    firstMultipleFoodsInBasket: {value: false, steps: []},
    firstEnterInTrackTab: {value: false, steps: []},
    firstOfflineMode: {value: false, steps: []},
  },
  currentTooltip: null,
};

// const walkthroughList = [
//   [
//     // sequence #1
//     {
//       id: '1-1',
//       title: 'Daily Summary',
//       content:
//         'Keep track of your daily totals by tapping on the calorie bar to view your Daily Summary.',
//       state: 'app.foodlog',
//       focusOffset: {
//         top: 3,
//         bottom: 23,
//         left: 0,
//         right: 0,
//       },
//     },
//     {
//       id: '1-2',
//       title: 'Meal Summary',
//       content: 'Or view summaries by meal.',
//       state: 'app.foodlog',
//       fixed: true,
//       focusOffset: {
//         top: 3,
//         bottom: 3,
//         left: 3,
//         right: 3,
//       },
//     },
//     {
//       id: '1-3',
//       title: 'Delete or Copy a Food',
//       content: 'Swipe left to quickly delete or copy a food.',
//       state: 'app.foodlog',
//       fixed: true,
//       focusOffset: {
//         top: 3,
//         bottom: 3,
//         left: 3,
//         right: 3,
//       },
//     },
//     {
//       id: '1-4',
//       title: 'Delete or Copy a Meal',
//       content:
//         'Or swipe left on a meal to quickly delete or copy a whole meal.',
//       state: 'app.foodlog',
//       fixed: true,
//       lastSlide: true, // set to true to set it as last slide.
//     },
//   ],
//   [
//     // sequence #2
//     {
//       id: '2-1',
//       title: 'Edit Quantity',
//       content: 'Easily change the serving size or serving unit.',
//       state: 'app.reviewFoods',
//       focusOffset: {
//         top: 3,
//         bottom: -12,
//         left: 3,
//         right: 3,
//       },
//     },
//     {
//       id: '2-2',
//       title: 'Nutrition Data Preview',
//       content:
//         "Click here to view an item's nutrition information before logging.",
//       state: 'app.reviewFoods',
//       fixed: true,
//       focusOffset: {
//         top: -10,
//         bottom: -10,
//         left: 0,
//         right: -45,
//       },
//     },
//   ],
//   [
//     // sequence #3 (#2 extended)
//     {
//       id: '2-1',
//       title: 'Edit Quantity',
//       content: 'Easily change the serving size or serving unit.',
//       state: 'app.reviewFoods',
//       focusOffset: {
//         top: 3,
//         bottom: -12,
//         left: 3,
//         right: 3,
//       },
//     },
//     {
//       id: '2-2',
//       title: 'Nutrition Data Preview',
//       content:
//         "Click here to view an item's nutrition information before logging.",
//       state: 'app.reviewFoods',
//       fixed: true,
//       focusOffset: {
//         top: -10,
//         bottom: -10,
//         left: 0,
//         right: -45,
//       },
//     },
//     {
//       id: '3-1',
//       title: 'Log as a Single Food',
//       content:
//         'Use this option to combine your Basket contents into a recipe or single meal.',
//       state: 'app.reviewFoods',
//       fixed: true,
//       focusOffset: {
//         top: 3,
//         bottom: 3,
//         left: 3,
//         right: 3,
//       },
//     },
//   ],
//   [
//     // sequence #4 (#3 step 3 only)
//     {
//       id: '3-1',
//       title: 'Log as a Single Food',
//       content:
//         'Use this option to combine your Basket contents into a recipe or single meal.',
//       state: 'app.reviewFoods',
//       fixed: true,
//       focusOffset: {
//         top: 3,
//         bottom: 3,
//         left: 3,
//         right: 3,
//       },
//     },
//   ],
//   [
//     // sequence #5
//     {
//       id: '4-1',
//       title: 'Freeform',
//       content:
//         'Click into the box to pull up your keyboard. Type freeform text or click the microphone button to speak your foods.',
//       state: 'app.reviewFoods',
//       fixed: true,
//       focusOffset: {
//         top: 3,
//         bottom: 3,
//         left: 3,
//         right: 3,
//       },
//     },
//     {
//       id: '4-2',
//       title: 'Specific Searches',
//       content:
//         'Search specifically within a restaurant menu, for a packaged food, or for previously logged foods in your History.',
//       state: 'app.reviewFoods',
//       fixed: true,
//       focusOffset: {
//         top: 3,
//         bottom: 3,
//         left: 3,
//         right: 3,
//       },
//     },
//   ],
//   [
//     // sequence #6
//     {
//       id: '6-1',
//       title: 'Offline Mode',
//       content:
//         'The Track app relies on a steady internet connection in order to pull the most up-to-date nutrition information directly from the Nutritionix verified database. When the app enters offline mode, you will need to connect to a more reliable internet source in order to look up and/or log new foods.',
//       state: 'app.foodlog',
//       fixed: true,
//       focusOffset: {
//         top: 3,
//         bottom: 3,
//         left: 3,
//         right: 3,
//       },
//     },
//   ],
// ];

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
