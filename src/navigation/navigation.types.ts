import {ParamListBase} from '@react-navigation/native';
import {Routes} from 'navigation/Routes';
import {PictureProps} from 'screens/LoggedIn';
import {FoodProps, SortedFoodProps} from 'store/userLog/userLog.types';
import {RecipeProps} from '../store/recipes/recipes.types';

export interface StackNavigatorParamList extends ParamListBase {
  [Routes.Login]: undefined;
  [Routes.Signin]: undefined;
  [Routes.Signup]: undefined;
  [Routes.Startup]: undefined;
  [Routes.Dashboard]:
    | {
        justLoggedIn?: boolean;
        infoMessage?: string;
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
  [Routes.Basket]: undefined;
  [Routes.FoodEdit]: {
    foodObj: FoodProps;
    mealType?: number;
  };
  [Routes.FoodInfo]: {
    foodObj: FoodProps;
  };
  [Routes.Autocomplete]:
    | {
        mealType?: number;
      }
    | undefined;
  [Routes.TrackFoods]: undefined;
  [Routes.BarcodeScanner]: undefined;
  [Routes.CustomFoods]: undefined;
  [Routes.CustomFoodEdit]: {
    food: FoodProps | null;
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
    foods: Array<FoodProps> | Array<SortedFoodProps>;
  };
  [Routes.PhotoUpload]: {
    barcode: string;
    picture?: PictureProps | null;
    picType?: number;
  };
  [Routes.Stats]: undefined;
  [Routes.Camera]: {barcode: string; picType: number};
}

export interface DrawerNavigatorParamList extends ParamListBase {
  [Routes.Home]: undefined;
}
