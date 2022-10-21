import {ParamListBase} from '@react-navigation/native';
import {Routes} from 'navigation/Routes';
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
        scanError?: boolean;
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
        scanError?: boolean;
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
  [Routes.BarcodeScanner]:
    | {
        force_photo_upload?: boolean;
        redirectStateKey?: string;
      }
    | undefined;
  [Routes.CustomFoods]: undefined;
  [Routes.CustomFoodEdit]: {
    food?: FoodProps;
    logAfterSubmit?: boolean;
  };
  [Routes.Recipes]: undefined;
  [Routes.RecipeDetails]: {
    recipe: RecipeProps | null;
  };
  [Routes.Preferences]: undefined;
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
  [Routes.Camera]: {barcode: string; picType: number};
}

export interface DrawerNavigatorParamList extends ParamListBase {
  [Routes.Home]: undefined;
}
