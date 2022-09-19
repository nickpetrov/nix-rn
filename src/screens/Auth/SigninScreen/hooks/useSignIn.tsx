// utils
import {useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as yup from 'yup';

// hooks
import {useDispatch} from 'hooks/useRedux';

// actions
import {signin} from 'store/auth/auth.actions';

// constants
import {Routes} from 'navigation/Routes';

// types
import {StackNavigatorParamList} from 'navigation/navigation.types';

export const useSignIn = (
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Signin>,
) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorTextServer, setErrorTextServer] = useState('');

  const showErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'server error':
        setErrorTextServer(
          'Something went wrong. Please make sure You have entered valid Email and Password',
        );
        break;
      default:
        setErrorTextServer('Something went wrong.');
    }
  };

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(6, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  const loginHandler = (values: {email: string; password: string}) => {
    setIsLoading(true);
    dispatch(signin(values.email, values.password))
      .then(() => {
        navigation.navigate(Routes.LoggedIn, {
          screen: Routes.Home,
          params: {
            screen: Routes.Dashboard,
            params: {
              justLoggedIn: true,
            },
          },
        });
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        showErrorMessage('server error');
      });
  };

  const createAccountHandler = () => {
    navigation.navigate('Signup');
  };

  return {
    isLoading,
    errorTextServer,
    loginValidationSchema,
    loginHandler,
    createAccountHandler,
  };
};
