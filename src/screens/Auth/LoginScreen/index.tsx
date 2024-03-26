// utils
import React, {useEffect, useState} from 'react';
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
  Linking,
} from 'react-native';
import {NixButton} from 'components/NixButton';
import LoadIndicator from 'components/LoadIndicator';

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
  const [fbLoading, setFbLoading] = useState(false);

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
    const fbAuthFailureMessage = 'Authentication Failed';
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions?.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            setFbLoading(true);
            console.log(data?.accessToken.toString());
            dispatch(fbLogin(data?.accessToken.toString() || ''))
              .then(() => setFbLoading(false))
              .catch((err: Error) => {
                setFbLoading(false);
                // eslint-disable-next-line no-alert
                alert(fbAuthFailureMessage);
                console.log(err);
              });
          });
        }
      },
      error => {
        // eslint-disable-next-line no-alert
        alert(fbAuthFailureMessage);
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
        // works only with bundle indetifier from ionic app - сom.nutritionix.nixtrack
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
            <Text
              style={{...styles.noteText, minWidth: 100, textAlign: 'center'}}>
              Need help?
            </Text>
            <Text style={styles.noteText}>
              Contact us at&nbsp;
              <Text
                style={styles.highlightText}
                onPress={() =>
                  Linking.openURL('mailto:support@nutritionix.com')
                }>
                support@nutritionix.com
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
      {fbLoading && <LoadIndicator withShadow />}
    </SafeAreaView>
  );
};
