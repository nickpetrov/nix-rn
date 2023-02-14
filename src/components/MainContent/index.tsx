// utils
import React, {useState, useEffect} from 'react';
import InAppReview from 'react-native-in-app-review';
import moment from 'moment-timezone';
import SQLite from 'react-native-sqlite-storage';

// components
import {Linking, Platform, View, Text} from 'react-native';
import {Navigation} from 'navigation';
import InfoModal from 'components/InfoModal';
import ChooseModal from 'components/ChooseModal';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';
import {batch} from 'react-redux';

// actions
import {
  mergeReviewCheck,
  setAgreedToUsePhoto,
  setAskForReview,
  setInfoMessage,
  showAgreementPopup,
} from 'store/base/base.actions';
import {checkSubscriptions} from 'store/coach/coach.actions';
import {setDB} from 'store/base/base.actions';

// styles
import {styles} from './MainContent.styles';
import TooltipView from 'components/TooltipView';

const MainContent = () => {
  const dispatch = useDispatch();
  const {agreementPopup, infoMessage, askForReview, reviewCheck, offline, db} =
    useSelector(state => state.base);
  const [showRatePopup, setShowRatePopup] = useState(false);

  const handleAcceptAgreement = () => {
    dispatch(setAgreedToUsePhoto(true)).then(() =>
      dispatch(showAgreementPopup()),
    );
  };

  useEffect(() => {
    if (infoMessage?.loadTime) {
      setTimeout(() => {
        dispatch(setInfoMessage(null));
      }, infoMessage?.loadTime);
    }
  }, [infoMessage, dispatch]);

  useEffect(() => {
    if (askForReview) {
      if (InAppReview.isAvailable()) {
        console.log('inappreview available');
        InAppReview.RequestInAppReview()
          .then(hasFlowFinishedSuccessfully => {
            if (hasFlowFinishedSuccessfully) {
              dispatch(
                mergeReviewCheck({
                  rateClicked: 1,
                }),
              );
            } else {
              dispatch(
                mergeReviewCheck({
                  rateClicked:
                    !!reviewCheck.scheduleDate && !!reviewCheck.popupShown
                      ? 1
                      : 0,
                  scheduleDate: moment().add(1, 'month').format('DD-MM-YYYY'),
                }),
              );
            }
          })
          .catch(error => {
            //we continue our app flow.
            // we have some error could happen while lanuching InAppReview,
            console.log(error);
          });
      } else {
        console.log('not inappreview  available');
        setShowRatePopup(true);
      }
      batch(() => {
        dispatch(
          mergeReviewCheck({
            popupShown: 1,
          }),
        );
        dispatch(setAskForReview(false));
      });
    }
  }, [
    askForReview,
    dispatch,
    reviewCheck.popupShown,
    reviewCheck.scheduleDate,
  ]);

  useEffect(() => {
    if (!db?.transaction) {
      dispatch(
        setDB(
          SQLite.openDatabase(
            {
              name: 'track_db',
              // createFromLocation: 1,
              location: Platform.OS === 'ios' ? 'default' : 'Shared',
            },
            () => {
              console.log('Re-open connection success!');
            },
            error => {
              console.log('error open db', error);
            },
          ),
        ),
      );
    }
  }, [db?.transaction, dispatch]);

  useEffect(() => {
    if (db?.transaction) {
      dispatch(checkSubscriptions());
    }
  }, [db?.transaction, dispatch]);

  return (
    <>
      {offline && (
        <View style={styles.offline}>
          <TooltipView
            eventName="firstOfflineMode"
            step={0}
            childrenWrapperStyle={{alignItems: 'stretch'}}>
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineText}>Offline Mode</Text>
            </View>
          </TooltipView>
        </View>
      )}
      <Navigation />
      <InfoModal
        modalVisible={agreementPopup}
        setModalVisible={handleAcceptAgreement}
        title="Info box"
        btn={{
          title: 'I understand',
          type: 'positive',
        }}
        text="All meal photos uploaded become public and viewable on Nutritionix.com. No other personal information is shared with the photo. By uploading a photo, you are agreeing to make it public."
      />
      <InfoModal
        modalVisible={!!infoMessage}
        setModalVisible={() => {
          dispatch(setInfoMessage(null));
        }}
        loadingType={infoMessage?.loadingType}
        title={infoMessage?.title || 'Thank you!'}
        text={infoMessage?.text || ''}
        btn={{
          type: infoMessage?.btnType || 'blue',
          title: infoMessage?.btnText ? infoMessage?.btnText : 'Close',
        }}>
        {infoMessage?.child && infoMessage?.child}
      </InfoModal>
      <ChooseModal
        modalVisible={showRatePopup}
        hideModal={() => setShowRatePopup(false)}
        title="Enjoying Nutritionix Track?"
        text="★ Please rate the Track app now ★"
        btns={[
          {
            type: 'gray',
            title: 'Not now',
            onPress: () => {
              setShowRatePopup(false);
              dispatch(
                mergeReviewCheck({
                  rateClicked:
                    !!reviewCheck.scheduleDate && !!reviewCheck.popupShown
                      ? 1
                      : 0,
                  scheduleDate: moment().add(1, 'month').format('DD-MM-YYYY'),
                }),
              );
            },
          },
          {
            type: 'primary',
            title: 'Rate',
            onPress: () => {
              setShowRatePopup(false);
              dispatch(
                mergeReviewCheck({
                  rateClicked: 1,
                }),
              );
              const GOOGLE_PACKAGE_NAME =
                process.env.REACT_APP_GOOGLE_PACKAGE_NAME;
              // provide here app id from https://appstoreconnect.apple.com/
              const APPLE_APP_ID = process.env.REACT_APP_APPLE_APP_ID;
              const url =
                Platform.OS === 'android'
                  ? `market://details?id=${GOOGLE_PACKAGE_NAME}`
                  : `itms://itunes.apple.com/us/app/apple-store/${APPLE_APP_ID}?mt=8&action=write-review`;
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  console.log("Don't know how to open URI: " + url);
                }
              });
            },
          },
        ]}
      />
    </>
  );
};

export default MainContent;
