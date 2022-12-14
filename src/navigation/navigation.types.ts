import {ParamListBase} from '@react-navigation/native';
import {Routes} from 'navigation/Routes';
import {WebViewMessageEvent, WebViewNavigation} from 'react-native-webview';
import {PictureProps} from 'screens/LoggedIn';
import {FoodProps} from 'store/userLog/userLog.types';
import {RecipeProps} from '../store/recipes/recipes.types';

export interface StackNavigatorParamList extends ParamListBase {
  [Routes.Login]: undefined;
  [Routes.Signin]: undefined;
  [Routes.Signup]: undefined;
  [Routes.Startup]: undefined;
  [Routes.Dashboard]:
    | {
        justLoggedIn?: boolean;
        startWalkthroughAfterLog?: boolean;
      }
    | undefined;
  [Routes.List]: undefined;
  [Routes.FitbitSync]: undefined;
  [Routes.HealthkitSync]: undefined;
  [Routes.Menu]: undefined;
  [Routes.Profile]: undefined;
  [Routes.DailyCalories]: undefined;
  [Routes.ConnectedApps]: undefined;
  [Routes.Notifications]: undefined;
  [Routes.GroceryAgentSettings]: undefined;
  [Routes.DeveloperSettings]: undefined;
  [Routes.Basket]:
    | {
        redirectStateKey?: string;
      }
    | undefined;
  [Routes.Food]: {
    foodObj: FoodProps;
    mealType?: number;
    readOnly?: boolean;
  };
  [Routes.Autocomplete]:
    | {
        mealType?: number;
      }
    | undefined;
  [Routes.TrackFoods]: undefined;
  [Routes.WebView]: {
    url: string;
    title?: string;
    close?: boolean;
    withFooter?: boolean;
    onMessage?: ((event: WebViewMessageEvent) => void) & ((data: any) => void);
    onNavigationStateChange?: ((event: WebViewNavigation) => void) &
      ((event: WebViewNavigation) => void) &
      ((data: any) => void);
  };
  [Routes.BarcodeScanner]:
    | {
        force_photo_upload?: boolean;
        redirectStateKey?: string;
      }
    | undefined;
  [Routes.CustomFoods]: {showSavedFoodMessage?: boolean} | undefined;
  [Routes.CustomFoodEdit]:
    | {
        food?: FoodProps;
        logAfterSubmit?: boolean;
        mealType?: number;
      }
    | undefined;
  [Routes.Recipes]:
    | {
        showSavedRecipeMessage?: boolean;
      }
    | undefined;
  [Routes.RecipeDetails]: {
    recipe: RecipeProps | null;
  };
  [Routes.Preferences]: {screen: string} | undefined;
  [Routes.DailyGoals]: undefined;
  [Routes.Help]: undefined;
  [Routes.Suggested]: undefined;
  [Routes.Totals]: {
    type: string;
    foods: Array<FoodProps> | Array<FoodProps>;
    date?: string;
    clientId?: string;
    readOnly?: boolean;
  };
  [Routes.PhotoUpload]: {
    barcode: string;
    picture?: PictureProps | null;
    picType?: number;
    redirectStateKey?: string;
    new_product?: boolean;
  };
  [Routes.Stats]: undefined;
  [Routes.Logout]: undefined;
  [Routes.GroceryAgentMode]: undefined;
  [Routes.Camera]: {barcode: string; picType: number};
  [Routes.MyCoach]: undefined;
  [Routes.CoachPortal]: undefined;
}

export interface DrawerNavigatorParamList extends ParamListBase {
  [Routes.Home]: undefined;
}
