// utils
import React, {useEffect, useState} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {FullOptions, Searcher} from 'fast-fuzzy';

// components
import {
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Share,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NixButton} from 'components/NixButton';

// actions
import {setInfoMessage} from 'store/base/base.actions';
import {getClients} from 'store/coach/coach.actions';
import {stopBeingCoach} from 'store/coach/coach.actions';
import {getUserDataFromAPI} from 'store/auth/auth.actions';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {User} from 'store/auth/auth.types';

// styles
import {styles} from './CoachPortalSceen.styles';

interface CoachPortalScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.MyCoach
  >;
}

const CoachPortalScreen: React.FC<CoachPortalScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const {coach, grocery_agent} = useSelector(state => state.auth.userData);
  const coachCode = coach?.code;
  const clientList = useSelector(state => state.coach.clientList);
  const [filteredClientList, setFilteredClientList] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [clientListSearcher, setClientListSearcher] =
    useState<Searcher<User, FullOptions<User>>>();

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    const filteredList =
      clientListSearcher && clientList.length && query.length
        ? clientListSearcher.search(query)
        : clientList;
    setFilteredClientList(filteredList);
  }, [query, clientListSearcher, clientList]);

  useEffect(() => {
    setClientListSearcher(
      new Searcher(clientList, {
        keySelector: obj => `${obj.first_name} ${obj.last_name}`,
        threshold: 1,
      }),
    );
  }, [clientList]);

  const copyToClipboard = () => {
    if (coachCode) {
      Clipboard.setString(coachCode.replace(/(.{3})/, '$1-'));
      dispatch(
        setInfoMessage({
          title: 'Coach ID copied to the clipboard.',
          btnText: 'Ok',
          btnType: 'primary',
        }),
      );
    }
  };
  const handleShare = () => {
    Share.share({
      message: `With Nutritionix Track, you can share your food log directly with a coach. To make me your coach, use this coach ID: ${coachCode?.replace(
        /(.{3})/,
        '$1-',
      )}

      New to Nutritionix Track?
      Download the app here:
      www.nutritionix.com/app`,
      title: 'Pick an app',
    });
  };

  const handleStopBeingCoach = () => {
    dispatch(stopBeingCoach()).then(() => {
      dispatch(getUserDataFromAPI())
        .then(() => {
          navigation.navigate(Routes.MyCoach);
        })
        .catch(() => {
          console.log('err update user after stop being a coach');
        });
    });
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.bar}>
        <TouchableWithoutFeedback onPress={copyToClipboard}>
          <View>
            <Text style={styles.code}>
              Coach ID:{' '}
              <Text style={styles.codeStrong}>
                {coachCode && coachCode.replace(/(.{3})/, '$1-')}
              </Text>
            </Text>
            <Text style={styles.disclaimer}>Tap to copy your ID</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleShare}>
          <View style={styles.share}>
            <FontAwesome
              style={styles.shareIcon}
              name="share-square-o"
              color="#444"
              size={24}
            />
            <Text style={styles.shareText}>Share ID</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={'Search my clients'}
          style={styles.input}
          value={query}
          onChangeText={text => setQuery(text)}
        />
        <Text onPress={() => setQuery('')}>Cancel</Text>
      </View>
      {filteredClientList.map(user => {
        return (
          <TouchableHighlight
            key={user.id}
            underlayColor={Colors.Highlight}
            onPress={() =>
              navigation.navigate(Routes.ViewClient, {
                client: user,
                clientId: user.id,
              })
            }>
            <View style={styles.patient}>
              <Text>{`${user.last_name ? `${user.last_name},` : ''} ${
                user.first_name
              }`}</Text>
              <FontAwesome
                style={styles.shareIcon}
                name="angle-right"
                size={24}
              />
            </View>
          </TouchableHighlight>
        );
      })}
      {!!grocery_agent && (
        <View style={styles.btnContainer}>
          <NixButton
            type="blue"
            title="Stop being a coach"
            onPress={handleStopBeingCoach}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default CoachPortalScreen;
