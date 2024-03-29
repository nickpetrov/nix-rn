import {ParamListBase} from '@react-navigation/native';
import {Routes} from 'navigation/Routes';
import {WebViewMessageEvent, WebViewNavigation} from 'react-native-webview';
import {PictureProps} from 'screens/LoggedIn';
import {FoodProps} from 'store/userLog/userLog.types';
import {RecipeProps} from '../store/recipes/recipes.types';
import {User} from 'store/auth/auth.types';

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
        from?: string;
        helpPopup?: {
          text: string;
          barcode: string;
        };
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
        from?: string;
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
    from?: string;
    new_product?: boolean;
  };
  [Routes.Stats]: {
    selectedDate: string;
  };
  [Routes.Logout]: undefined;
  [Routes.GroceryAgentMode]: undefined;
  [Routes.Camera]: {barcode: string; picType: number};
  [Routes.MyCoach]: undefined;
  [Routes.CoachPortal]: undefined;
  [Routes.ViewClient]: {
    client: User;
    clientId: string;
  };
  [Routes.ViewClientDayLog]: {
    client: User;
  };
}

export interface DrawerNavigatorParamList extends ParamListBase {
  [Routes.Home]: undefined;
}
