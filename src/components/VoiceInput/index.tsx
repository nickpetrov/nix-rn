// utils
import React, {useState, useEffect, useCallback} from 'react';

// components
import {View, TextInput, TouchableWithoutFeedback} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Voice from '@react-native-voice/voice';

// styles
import {styles} from './VoiceInput.styles';

interface VoiceRecognitionControlsProps {
  onPress: () => void;
  iconName: string;
  style?: {
    [key: string]: string | number;
  };
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
        <FontAwesome name={props.iconName} size={20} style={{color: '#666'}} />
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
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
}) => {
  // const [pitch, setPitch] = useState('');
  // const [error, setError] = useState('');
  // const [end, setEnd] = useState('');
  // const [started, setStarted] = useState('');
  // const [results, setResults] = useState([]);
  // const [partialResults, setPartialResults] = useState([]);
  const [speechRecognitionInProgress, setSpeechRecognitionInProgress] =
    useState(false);

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

  const onSpeechError = (e: any) => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    setSpeechRecognitionInProgress(false);
    // setError(JSON.stringify(e.error));
  };

  const onSpeechResults = useCallback(
    (e: any) => {
      //Invoked when SpeechRecognizer is finished recognizing
      console.log('onSpeechResults: ', e);
      // setResults(e.value);
      onChangeText(e.value[0]);
    },
    [onChangeText],
  );

  const onSpeechPartialResults = (e: any) => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    // setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = (e: any) => {
    //Invoked when pitch that is recognized changed
    console.log('onSpeechVolumeChanged: ', e);
    // setPitch(e.value);
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
  }, [onSpeechResults]);

  const startRecognizing = async () => {
    // setPitch('');
    // setError('');
    // setEnd('');
    // setStarted('');
    // setResults([]);
    // setPartialResults([]);

    try {
      await Voice.start('en-US', {
        RECOGNIZER_ENGINE: 'services',
        EXTRA_PARTIAL_RESULTS: true,
      });
    } catch (e) {
      //eslint-disable-next-line
      console.error('start voice', e);
    }
  };

  const stopRecognizing = async () => {
    try {
      console.log('here');
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
      onChangeText('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  return (
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
          <VoiceRecognitionControls onPress={stopRecognizing} iconName="stop" />
          <VoiceRecognitionControls
            onPress={cancelRecognizing}
            iconName="ban"
            style={{right: 60}}
          />
        </>
      ) : (
        <VoiceRecognitionControls
          onPress={startRecognizing}
          iconName="microphone"
        />
      )}
    </View>
  );
};

export default VoiceInput;
