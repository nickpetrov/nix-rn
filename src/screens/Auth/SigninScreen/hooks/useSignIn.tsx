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
import {setInfoMessage} from 'store/base/base.actions';

export const useSignIn = (
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Signin>,
) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
      .then(result => {
        console.log(result);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        dispatch(
          setInfoMessage({
            title: 'Login Failed',
            text: 'The login credentials you provided do not match our records. Please try again.',
            btnText: 'Ok',
          }),
        );
      });
  };

  const createAccountHandler = () => {
    navigation.navigate('Signup');
  };

  return {
    isLoading,
    loginValidationSchema,
    loginHandler,
    createAccountHandler,
  };
};
