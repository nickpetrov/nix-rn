// utils
import React, {useState, useEffect} from 'react';
import _ from 'lodash';

// components
import {ScrollView, View, Text, TextInput} from 'react-native';
import {NixButton} from 'components/NixButton/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Swipeable} from 'react-native-gesture-handler';
import SwipeHiddenButtons from 'components/SwipeHiddenButtons';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';

// actions
import {
  becomeCoach,
  addCoach,
  removeCoach,
  getCoaches,
} from 'store/coach/coach.actions';

// constants
import {Routes} from 'navigation/Routes';
import {Colors} from 'constants/Colors';

// styles
import {styles} from './MyCoachScreen.styles';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';

interface MyCoachScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.MyCoach
  >;
}

const MyCoachScreen: React.FC<MyCoachScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  let rowRefs = new Map<string, Swipeable>();
  const {premium_user, coach} = useSelector(state => state.auth.userData);
  const myCoachCode = coach?.code;
  const coachesList = useSelector(state => state.coach.coachesList);
  const [coachCode, setCoachCode] = useState('');
  const [error, setError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [coachToAdd, setCoachToAdd] = useState<{
    first_name: string;
    last_name: string;
  } | null>(null);

  useEffect(() => {
    if (premium_user) {
      dispatch(getCoaches());
    }
  }, [dispatch, premium_user]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  }, [error]);

  const changeCode = (newVal: string) => {
    if (!newVal) {
      setCoachCode('');
      return;
    }
    let coachCodeView = newVal.toUpperCase();
    setCoachCode((oldVal: string) => {
      if (!oldVal || newVal.length > oldVal.length) {
        if (
          newVal.replace(/-/g, '').length > 2 &&
          newVal.replace(/-/g, '').length < 7
        ) {
          coachCodeView = (
            newVal.replace(/-/g, '').slice(0, 3) +
            '-' +
            newVal.replace(/-/g, '').slice(3, newVal.length)
          ).toUpperCase();
        } else if (newVal.replace(/-/g, '').length > 6) {
          let code = newVal.replace(/-/g, '');
          coachCodeView = [
            code.substring(0, 3),
            code.substring(3, 6),
            code.substring(6, 9),
          ]
            .join('-')
            .toUpperCase();
        }
      } else if (newVal.length < oldVal.length) {
        if (newVal.length === 4 || newVal.length === 8) {
          coachCodeView = newVal.slice(0, newVal.length - 1).toUpperCase();
        }
      }
      return coachCodeView;
    });
  };

  const handleBecomeCoach = () => {
    dispatch(becomeCoach());
  };
  const handleAddCoach = () => {
    const code = coachCode.replace(/-/g, '');
    if (!code || (code.length < 6 && code.length > 6)) {
      return;
    }

    if (_.find(coachesList, ['code', code.toUpperCase()])) {
      setError('Already shared.');
      return setTimeout(() => {
        setError('');
      }, 2000);
    }

    dispatch(addCoach(code))
      .then(() => {
        setAddSuccess(true);
        setCoachCode('');
        setTimeout(() => {
          setAddSuccess(false);
        }, 2000);
      })
      .catch(err => {
        console.log('addCoach err', err);
        if (err?.status === 400) {
          setError('No coach found.');
          setTimeout(() => {
            setError('');
          }, 2000);
        } else if (err.status === 402) {
          setShowSubscribePrompt(true);
          setCoachToAdd(err.data);
        }
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowSubscribePrompt(false);
      setError('');
      setCoachCode('');
    });
    return unsubscribe;
  }, [navigation]);

  const handleDeleteCoach = (code: string) => {
    dispatch(removeCoach(code));
  };

  return (
    <ScrollView style={styles.root}>
      <Text style={styles.header}>
        Please enter the Coach ID you received from your coach:
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Coach ID:</Text>
        <TextInput
          autoCapitalize={'characters'}
          style={[styles.input, error ? styles.inputError : {}]}
          value={coachCode}
          onChangeText={changeCode}
          placeholder="code"
        />
        {addSuccess && (
          <Ionicons name="checkmark" color={Colors.LightGreen} size={26} />
        )}
        <NixButton
          style={styles.btn}
          type="blue"
          onPress={handleAddCoach}
          title="Submit"
        />
        {!premium_user && showSubscribePrompt && (
          <>
            <View style={styles.alertBubbleAfter} />
            <View style={styles.alertBubble}>
              <Text style={styles.alertBubbleText}>
                Get access to this feature and more with a TrackPro account!{' '}
                <Text
                  style={styles.alertBubbleLink}
                  onPress={() => navigation.navigate(Routes.Subscribe)}>
                  Upgrade now!
                </Text>
              </Text>
            </View>
          </>
        )}
      </View>
      {!!error && (
        <View style={styles.errors}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
      {!!premium_user && (
        <View>
          <Text style={styles.coachesTitle}>My Coaches</Text>
          {!coachesList.length && (
            <Text style={styles.coachItemNote}>
              You are not currently sharing with any coaches.
            </Text>
          )}
          {!!coachesList.length && (
            <>
              {coachesList.map(coachItem => {
                return (
                  <Swipeable
                    key={coachItem.code}
                    renderRightActions={() => (
                      <SwipeHiddenButtons
                        buttons={[
                          {
                            type: 'delete',
                            onPress: () => {
                              handleDeleteCoach(coachItem.code);
                            },
                            icon: {
                              name: 'trash',
                              color: '#fff',
                              size: 24,
                            },
                          },
                        ]}
                        style={{
                          minWidth: 50,
                          paddingHorizontal: 5,
                        }}
                      />
                    )}
                    ref={ref => {
                      if (ref && !rowRefs.get(coachItem.code)) {
                        rowRefs.set(coachItem.code, ref);
                      }
                    }}
                    onSwipeableWillOpen={() => {
                      [...rowRefs.entries()].forEach(([key, ref]) => {
                        if (key !== coachItem.code && ref) {
                          ref.close();
                        }
                      });
                    }}>
                    <View style={styles.coachItem}>
                      <View style={styles.coachItemPhoto}>
                        {!coachItem.photo && (
                          <FontAwesome
                            name="user-circle"
                            color="#aaa"
                            size={40}
                          />
                        )}
                      </View>
                      <Text style={styles.coachItemText}>
                        {`${coachItem.first_name} ${
                          coachItem?.last_name ? coachItem?.last_name : ''
                        }`}
                      </Text>
                    </View>
                  </Swipeable>
                );
              })}
            </>
          )}
        </View>
      )}
      {!premium_user && showSubscribePrompt && (
        <View style={styles.subscribeNow}>
          <Text style={styles.subscribeNowTitle}>
            To share with{' '}
            {coachToAdd
              ? `${coachToAdd.first_name} ${
                  coachToAdd?.last_name ? coachToAdd?.last_name : ''
                }`
              : 'your coach'}
            , subscribe to Pro now:
          </Text>
          <NixButton
            type="blue"
            style={styles.subscribeNowBtn}
            onPress={() => navigation.navigate(Routes.Subscribe)}
            title="Subscribe"
          />
        </View>
      )}
      {!myCoachCode && (
        <View style={styles.alert}>
          <Text style={styles.alertHeader}>Are you a Coach?</Text>
          <Text style={styles.alertText}>
            Using a Coach ID, other Track users can share their food logs with
            you in real time.
          </Text>
          <Text style={styles.alertText}>
            Grab your Coach ID{' '}
            <Text onPress={() => handleBecomeCoach()} style={styles.alertLink}>
              here
            </Text>
          </Text>
        </View>
      )}
      {!!myCoachCode && (
        <View style={styles.alert}>
          <Text style={styles.alertHeader}>Hey there, coach!</Text>
          <Text style={styles.alertText}>View your Coach Portal:</Text>
          <NixButton
            style={styles.alertBtn}
            type="blue"
            onPress={() => navigation.navigate(Routes.CoachPortal)}
            title="View Coach Portal"
          />
        </View>
      )}
    </ScrollView>
  );
};

export default MyCoachScreen;
