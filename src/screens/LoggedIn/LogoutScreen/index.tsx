import {useEffect} from 'react';

// hooks
import {useDispatch} from 'hooks/useRedux';

// constants
import {Routes} from 'navigation/Routes';

// actions
import {logout} from 'store/auth/auth.actions';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface LogoutScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Logout>;
}

const LogoutScreen: React.FC<LogoutScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout()).then(() => {
      navigation.replace(Routes.LoginScreens, {screen: Routes.Login});
    });
  }, [dispatch, navigation]);
  return null;
};

export default LogoutScreen;
