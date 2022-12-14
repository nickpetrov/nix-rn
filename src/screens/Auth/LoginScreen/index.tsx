// utils
import React, {useEffect} from 'react';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// components
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {NixButton} from 'components/NixButton';

// hooks
import {useDispatch} from 'hooks/useRedux';

// actions
import {appleLogin, fbLogin} from 'store/auth/auth.actions';

// constants
import {Routes} from 'navigation/Routes';

//styles
import {styles} from './LoginScreen.styles';

// types
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Login>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  useEffect(() => {
    return () => {
      if (appleAuth.isSupported) {
        appleAuth.onCredentialRevoked(async () => {
          console.warn(
            'If this function executes, User Credentials have been Revoked',
          );
        });
      }
    };
  }, []);

  const dispatch = useDispatch();

  const fbLoginHandler = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions?.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data?.accessToken.toString());
            dispatch(fbLogin(data?.accessToken.toString() || '')).catch(
              (err: Error) => {
                console.log(err);
              },
            );
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const appleLoginHandler = async () => {
    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {user, email, realUserStatus, identityToken /* etc */} =
        appleAuthRequestResponse;

      // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      if (identityToken) {
        // works only with bundle indetifier from ionic app - ??om.nutritionix.nixtrack
        dispatch(appleLogin(appleAuthRequestResponse)).catch(err => {
          console.log(err);
        });
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.loginWrapper}>
      <ScrollView style={styles.scrollView} alwaysBounceVertical={false}>
        <View style={styles.contentWrapper}>
          <View style={styles.logo}>
            <Image
              style={styles.logoImage}
              source={require('assets/images/icon.png')}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Track</Text>
          <Text style={styles.subtitle}>Food Tracker by Nutritionix</Text>
          {Platform.OS === 'ios' ? (
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              style={styles.appleButton}
              onPress={() => appleLoginHandler()}
            />
          ) : null}
          <NixButton
            title="Sign in with Facebook"
            type="facebook"
            iconName="facebook-square"
            onTap={fbLoginHandler}
            withMarginTop={Platform.OS === 'ios' ? true : false}
          />
          <Text style={{...styles.noteText, ...styles.fbDisclamer}}>
            The app does not post to Facebook
          </Text>
          <NixButton
            title="Login via Email"
            onTap={() => navigation.navigate(Routes.Signin)}
            withMarginTop
          />
          <NixButton
            title="Create Account"
            onTap={() => navigation.navigate(Routes.Signup)}
            withMarginTop
          />
          <View style={styles.disclaimerWrapper}>
            <Text style={styles.noteText}>Need help?</Text>
            <Text style={styles.noteText}>
              Contact us at{' '}
              <Text style={styles.highlightText}>support@nutritionix.com</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
