// utils
import React, {useState, useEffect, useCallback} from 'react';

// components
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  Platform,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Voice from '@react-native-voice/voice';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {setIsVoiceDisclaimerVisible} from 'store/base/base.actions';

// styles
import {styles} from './VoiceInput.styles';
import ChooseModal from 'components/ChooseModal';

interface VoiceRecognitionControlsProps {
  onPress: () => void;
  iconName: string;
  style?: {
    [key: string]: string | number;
  };
  text?: string;
}
const VoiceRecognitionControls: React.FC<
  VoiceRecognitionControlsProps
> = props => {
  return (
    <View style={{position: 'absolute', bottom: 10, right: 10, ...props.style}}>
      <TouchableWithoutFeedback
        style={{...styles.voiceRecognitionControls}}
        onPress={() => {
          props.onPress();
        }}>
        <View style={styles.voiceRecognitionControlsIconView}>
          <FontAwesome name={props.iconName} size={20} color="#fff" />
          {props.text && <Text>{props.text}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

interface VoiceInputProps {
  style: {
    [key: string]: string | number;
  };
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  withDisclaymore?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
  withDisclaymore,
}) => {
  const dispatch = useDispatch();
  const hideVoiceRecognitionDisclaimer = useSelector(
    state => state.base.hideVoiceRecognitionDisclaimer,
  );
  const [speechRecognitionInProgress, setSpeechRecognitionInProgress] =
    useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const onSpeechStart = (e: any) => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    setSpeechRecognitionInProgress(true);
    // setStarted('√');
  };

  const onSpeechEnd = (e: any) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    setSpeechRecognitionInProgress(false);
    // setEnd('√');
  };

  const onSpeechError = useCallback((err: any) => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', err);
    setSpeechRecognitionInProgress(false);
    // setError(JSON.stringify(e.error));
    if (!Voice.isAvailable()) {
      setShowPopup(true);
    }
  }, []);

  const onSpeechResults = useCallback(
    (e: any) => {
      //Invoked when SpeechRecognizer is finished recognizing
      console.log('onSpeechResults: ', e);
      onChangeText(e.value[0]);
      setSpeechRecognitionInProgress(false);
    },
    [onChangeText],
  );

  const onSpeechPartialResults = useCallback((e: any) => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    // onChangeText(value + e.value[0]);
  }, []);

  const onSpeechVolumeChanged = (e: any) => {
    //Invoked when pitch that is recognized changed
    console.log('onSpeechVolumeChanged: ', e);
  };

  const showDisclaimer = () => {
    if (Platform.OS !== 'android') {
      return;
    }
    if (hideVoiceRecognitionDisclaimer) {
      return;
    }
    dispatch(setIsVoiceDisclaimerVisible(true));
  };

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSpeechResults, onSpeechPartialResults, onSpeechError]);

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US', {
        RECOGNIZER_ENGINE: 'services',
        EXTRA_PARTIAL_RESULTS: true,
      });
    } catch (e) {
      console.error('start voice', e);
    }
  };

  const stopRecognizing = async () => {
    try {
      console.log('here');
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
      onChangeText('');
      if (withDisclaymore) {
        showDisclaimer();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <View style={styles.voiceContainer}>
        <TextInput
          style={[styles.input, style]}
          multiline
          numberOfLines={4}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
        {speechRecognitionInProgress ? (
          <>
            <VoiceRecognitionControls
              onPress={stopRecognizing}
              iconName="stop"
            />
            <VoiceRecognitionControls
              onPress={cancelRecognizing}
              iconName="ban"
              style={{right: 50}}
            />
          </>
        ) : (
          <VoiceRecognitionControls
            onPress={startRecognizing}
            iconName="microphone"
          />
        )}
      </View>
      <ChooseModal
        modalVisible={showPopup}
        hideModal={() => setShowPopup(false)}
        title="Voice recognition error"
        subtitle="You're almost there! To use this feature, download and setup Google Voice Search, and then restart the app. To get Google Voice Search from the Play Market now, click 'Download'"
        btns={[
          {
            type: 'gray',
            title: 'Cancel',
            onPress: () => setShowPopup(false),
          },
          {
            type: 'primary',
            title: 'Download',
            onPress: () => {
              setShowPopup(false);
              Linking.openURL(
                'market://details?id=com.google.android.googlequicksearchbox',
              );
            },
          },
        ]}
      />
    </>
  );
};

export default VoiceInput;
