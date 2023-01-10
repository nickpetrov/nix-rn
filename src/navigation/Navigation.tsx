// utils
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import moment from 'moment-timezone';

// hooks
import {useSelector} from 'hooks/useRedux';

// components
import {SideMenu} from './components/SideMenu';
import DrawerButton from 'components/DrawerButton';
import {NavigationHeader} from 'components/NavigationHeader';

// screens
import {LoginScreen, SigninScreen, SignupScreen} from 'screens/Auth';
import {
  DashboardScreen,
  BasketScreen,
  FoodScreen,
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
  CameraScreen,
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
import GroceryAgentModeScreen from 'screens/LoggedIn/GroceryAgentModeScreen';
import MyCoachScreen from 'screens/LoggedIn/MyCoachScreen';
import SubscribeScreen from 'screens/LoggedIn/SubscribeScreen';

import WebViewScreen from 'screens/LoggedIn/WebViewScreen';
import LogoutScreen from 'screens/LoggedIn/LogoutScreen';

// constants
import {Routes} from './Routes';

// types
import {Platform} from 'react-native';
import {
  DrawerNavigatorParamList,
  StackNavigatorParamList,
} from './navigation.types';
import CompleteRegistration from 'screens/LoggedIn/CompleteRegistration';
import CoachPortalScreen from 'screens/LoggedIn/CoachPortalSceen';

const Stack = createNativeStackNavigator<StackNavigatorParamList>();
const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

const LoggedInNavigationOptions = () => ({
  header: (props: any) => <NavigationHeader {...props} />,
  BackButtonstyles: {
    padding: 0,
  },
});

const ConnectedAppsNavigation = () => {
  return (
    <Stack.Navigator screenOptions={LoggedInNavigationOptions}>
      <Stack.Screen
        name={Routes.List}
        component={ConnectedAppsScreen}
        options={{headerTitle: 'Connected Apps'}}
      />
      <Stack.Screen
        name={Routes.FitbitSync}
        component={FitbitSyncScreen}
        options={{headerTitle: 'Fitbit'}}
      />
      <Stack.Screen
        name={Routes.HealthkitSync}
        component={HealthkitSyncScreen}
        options={{headerTitle: 'HealthKit'}}
      />
    </Stack.Navigator>
  );
};

const PreferencesNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={LoggedInNavigationOptions}
      initialRouteName={Routes.Menu}>
      <Stack.Screen
        name={Routes.Menu}
        component={PreferencesMenuScreen}
        options={{
          headerTitle: 'Preferences',
        }}
      />
      <Stack.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={{headerTitle: 'My Track Profile'}}
      />
      <Stack.Screen
        name={Routes.DailyCalories}
        component={DailyCaloriesScreen}
        options={{headerTitle: 'Calculate Daily Calories'}}
      />
      <Stack.Screen
        name={Routes.ConnectedApps}
        component={ConnectedAppsNavigation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Routes.Notifications}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name={Routes.GroceryAgentSettings}
        options={{headerTitle: 'Grocery Agent Preferences'}}
        component={GroceryAgentSettingsScreen}
      />
      <Stack.Screen
        name={Routes.DeveloperSettings}
        component={DeveloperSettingsScreen}
      />
    </Stack.Navigator>
  );
};

const LoggedInNavigation = () => {
  const created_at = useSelector(state => state.auth.userData.created_at);
  const justCreated = moment().diff(created_at, 'seconds') <= 90;
  return (
    <Stack.Navigator
      screenOptions={LoggedInNavigationOptions}
      initialRouteName={
        justCreated ? Routes.CompleteRegistration : Routes.Dashboard
      }>
      <Stack.Screen
        name={Routes.Dashboard}
        component={DashboardScreen}
        options={{
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Stack.Screen
        name={Routes.Basket}
        component={BasketScreen}
        options={{
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name={Routes.Food}
        component={FoodScreen}
        options={{
          headerTitle: 'Edit Food',
          animation: Platform.select({
            ios: 'default',
            android: 'none',
          }),
        }}
      />
      <Stack.Screen
        name={Routes.Autocomplete}
        component={AutocompleteScreen}
        options={{
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name={Routes.TrackFoods} component={TrackFoodsScreen} />
      <Stack.Screen
        name={Routes.BarcodeScanner}
        component={BarcodeScannerScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Routes.CustomFoods}
        component={CustomFoodsScreen}
        options={{
          headerTitle: 'Custom Foods',
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
          headerTitle: 'My Recipes 2.0',
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
          headerShown: false,
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
          headerTitle: 'Product Suggestions',
        }}
      />
      <Stack.Screen
        name={Routes.Totals}
        component={TotalsScreen}
        options={{
          headerTitle: 'Totals',
          animation: Platform.select({
            ios: 'default',
            android: 'none',
          }),
        }}
      />
      <Stack.Screen
        name={Routes.Camera}
        component={CameraScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={Routes.PhotoUpload}
        component={PhotoUploadScreen}
        options={{
          headerTitle: 'User Photo Upload',
        }}
      />
      <Stack.Screen
        name={Routes.Stats}
        component={StatsScreen}
        options={{
          headerTitle: 'Stats',
        }}
      />
      <Stack.Screen
        name={Routes.WebView}
        component={WebViewScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Routes.GroceryAgentMode}
        component={GroceryAgentModeScreen}
        options={{
          headerTitle: 'Grocery Agent Mode',
        }}
      />
      <Stack.Screen
        name={Routes.CompleteRegistration}
        component={CompleteRegistration}
        options={{
          headerTitle: 'Signup',
        }}
      />
      <Stack.Screen
        name={Routes.MyCoach}
        component={MyCoachScreen}
        options={{
          headerTitle: 'My Coach',
        }}
      />
      <Stack.Screen
        name={Routes.CoachPortal}
        component={CoachPortalScreen}
        options={{
          headerTitle: 'Coach Portal',
        }}
      />
      <Stack.Screen
        name={Routes.Subscribe}
        component={SubscribeScreen}
        options={{
          headerTitle: 'Subscribe',
        }}
      />
      <Stack.Screen
        name={Routes.Logout}
        component={LogoutScreen}
        options={{
          headerShown: false,
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
      initialRouteName={Routes.Home}
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
      <Stack.Screen name={Routes.Signin} component={SigninScreen} />
      <Stack.Screen name={Routes.Signup} component={SignupScreen} />
    </Stack.Navigator>
  );
};

export const Navigation = () => {
  const isSignedIn = useSelector(state => !!state.auth.userJWT);
  return (
    <Stack.Navigator
    // screenOptions={{ ...TransitionPresets.FadeFromBottomAndroid }}
    >
      <Stack.Screen
        name={Routes.Startup}
        component={StartupScreen}
        options={{headerShown: false}}
      />
      {!isSignedIn ? (
        <Stack.Screen
          name={Routes.LoginScreens}
          component={LoginNavigation}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name={Routes.LoggedIn}
          component={SideDrawerNavigation}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};
