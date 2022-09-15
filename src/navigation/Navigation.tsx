// utils
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

// components
import {SideMenu} from './components/SideMenu';
import DrawerButton from 'components/DrawerButton';

// screens
import {LoginScreen, SigninScreen, SignupScreen} from 'screens/Auth';
import {
  DashboardScreen,
  BasketScreen,
  FoodInfoScreen,
  TrackFoodsScreen,
  BarcodeScannerScreen,
  AutocompleteScreen,
  PhotoUploadScreen,
  DailyGoalsScreen,
  CustomFoodsScreen,
  CustomFoodEditScreen,
  RecipesScreen,
  RecipeDetailsScreen,
  SuggestedScreen,
  TotalsScreen,
  HelpScreen,
  StatsScreen,
} from 'screens/LoggedIn';
import {StartupScreen} from 'screens/StartupScreen';
import {
  ProfileScreen,
  DailyCaloriesScreen,
  ConnectedAppsScreen,
  NotificationsScreen,
  GroceryAgentSettingsScreen,
  DeveloperSettingsScreen,
  FitbitSyncScreen,
  HealthkitSyncScreen,
  PreferencesMenuScreen,
} from 'screens/Preferences';

// constants
import {Routes} from './Routes';
import {Colors} from 'constants';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const ConnectedAppsNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={Routes.List}
        component={ConnectedAppsScreen}
        options={{headerTitle: 'Connected Apps'}}
      />
      <Stack.Screen name={Routes.FitbitSync} component={FitbitSyncScreen} />
      <Stack.Screen
        name={Routes.HealthkitSync}
        component={HealthkitSyncScreen}
      />
    </Stack.Navigator>
  );
};

const PreferencesNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={Routes.Menu}
        component={PreferencesMenuScreen}
        options={{headerTitle: 'Preferences'}}
      />
      <Stack.Screen name={Routes.Profile} component={ProfileScreen} />
      <Stack.Screen
        name={Routes.DailyCalories}
        component={DailyCaloriesScreen}
      />
      <Stack.Screen
        name={Routes.ConnectedApps}
        component={ConnectedAppsNavigation}
        options={{headerTitle: 'Connected Apps'}}
      />
      <Stack.Screen
        name={Routes.Notifications}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name={Routes.GroceryAgentSettings}
        component={GroceryAgentSettingsScreen}
      />
      <Stack.Screen
        name={Routes.DeveloperSettings}
        component={DeveloperSettingsScreen}
      />
    </Stack.Navigator>
  );
};

const LoggedInNavigationOptions = ({navigation}: any) => ({
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: Colors.Primary,
  },
  headerLeft: () => <DrawerButton navigation={navigation} />,
});

const LoggedInNavigation = () => {
  return (
    <Stack.Navigator screenOptions={LoggedInNavigationOptions}>
      <Stack.Screen name={Routes.Dashboard} component={DashboardScreen} />
      <Stack.Screen name={Routes.Basket} component={BasketScreen} />
      <Stack.Screen name={Routes.FoodInfo} component={FoodInfoScreen} />
      <Stack.Screen name={Routes.Autocomplete} component={AutocompleteScreen} />
      <Stack.Screen name={Routes.TrackFoods} component={TrackFoodsScreen} />
      <Stack.Screen
        name={Routes.BarcodeScanner}
        component={BarcodeScannerScreen}
      />
      <Stack.Screen
        name={Routes.CustomFoods}
        component={CustomFoodsScreen}
        options={{
          headerTitle: 'Your Foods',
        }}
      />
      <Stack.Screen
        name={Routes.CustomFoodEdit}
        component={CustomFoodEditScreen}
        options={{
          headerTitle: 'Custom Food',
        }}
      />
      <Stack.Screen
        name={Routes.Recipes}
        component={RecipesScreen}
        options={{
          headerTitle: 'My Recipes',
        }}
      />
      <Stack.Screen
        name={Routes.RecipeDetails}
        component={RecipeDetailsScreen}
        options={{
          headerTitle: 'Edit Recipe',
        }}
      />
      <Stack.Screen
        name={Routes.Preferences}
        component={PreferencesNavigation}
        options={{
          headerTitle: 'Preferences',
        }}
      />
      <Stack.Screen
        name={Routes.DailyGoals}
        component={DailyGoalsScreen}
        options={{
          headerTitle: 'Edit Daily Goals',
        }}
      />
      <Stack.Screen
        name={Routes.Help}
        component={HelpScreen}
        options={{
          headerTitle: 'Help',
        }}
      />
      <Stack.Screen
        name={Routes.Suggested}
        component={SuggestedScreen}
        options={{
          headerTitle: 'Recommended Products',
        }}
      />
      <Stack.Screen
        name={Routes.Totals}
        component={TotalsScreen}
        options={{
          headerTitle: 'Totals',
        }}
      />
      <Stack.Screen
        name={Routes.PhotoUpload}
        component={PhotoUploadScreen}
        options={{
          headerTitle: 'Photo Upload',
        }}
      />
      <Stack.Screen
        name={Routes.Stats}
        component={StatsScreen}
        options={{
          headerTitle: 'Stats',
        }}
      />
    </Stack.Navigator>
  );
};

// const SideDrawerNavigationOptions = {
//   //   header: {visible: true},
//   headerStyle: {
//     backgroundColor: Colors.Primary,
//     elevation: 0,
//     shadowOpacity: 0,
//   },
//   headerTintColor: '#333333',
//   //   headerTitleStyle: {
//   //     fontWeight: 'bold',
//   //     color: '#ffffff',
//   //   },
// };

const SideDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      // screenOptions={SideDrawerNavigationOptions}
      drawerContent={SideMenu}>
      <Drawer.Screen
        name={Routes.Home}
        component={LoggedInNavigation}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

const LoginNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.Login}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.Signin}
        component={SigninScreen}
        options={{headerTitle: 'Sign in via Email'}}
      />
      <Stack.Screen
        name={Routes.Signup}
        component={SignupScreen}
        options={{headerTitle: 'Sign up'}}
      />
    </Stack.Navigator>
  );
};

export const Navigation = () => {
  return (
    <Stack.Navigator
    //   screenOptions={{...TransitionPresets.FadeFromBottomAndroid}}>
    >
      <Stack.Screen
        name={Routes.Startup}
        component={StartupScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.LoginScreens}
        component={LoginNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.LoggedIn}
        component={SideDrawerNavigation}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
