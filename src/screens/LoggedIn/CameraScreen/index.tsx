// utils
import React, {useRef, useState, useEffect, useCallback} from 'react';

// components
import {View, ScrollView, Button, ActivityIndicator} from 'react-native';
import {
  useCameraDevices,
  Camera,
  CameraRuntimeError,
  CameraCaptureError,
} from 'react-native-vision-camera';

// styles
import {styles} from './CameraScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {PictureProps} from 'screens/LoggedIn/PhotoUploadScreen/index';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp} from '@react-navigation/native';

interface CameraScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Camera>;
  route: RouteProp<StackNavigatorParamList, Routes.Camera>;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  navigation,
  route,
}) => {
  const [isActive, setActive] = useState(true);
  const [takenPicture, setTakenPicture] = useState<PictureProps | null>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);

  const tryAgainHandler = () => {
    setTakenPicture(null);
  };

  const takePictureHandler = async () => {
    try {
      const photo = await camera.current?.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'on',
        enableAutoRedEyeReduction: true,
      });
      console.log('photo', photo);
      if (photo) {
        setTakenPicture(photo);
      }
    } catch (e) {
      if (e instanceof CameraCaptureError) {
        switch (e.code) {
          case 'capture/file-io-error':
            console.error('Failed to write photo to disk!');
            break;
          default:
            console.error(e);
            break;
        }
      }
    }
  };

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const usePictureHandler = () => {
    setTakenPicture(null);
    navigation.navigate(Routes.PhotoUpload, {
      picture: takenPicture,
      barcode: route.params?.barcode,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setActive(false);
    });
    return unsubscribe;
  }, [navigation]);

  if (device == null) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.cameraPopupWrapper}>
      <ScrollView>
        {/* <Pressable
            style={styles.buttonClose}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable> */}
        <Camera
          style={styles.camera}
          ref={camera}
          onError={onError}
          photo={true}
          device={device}
          isActive={isActive}
        />
        <View>
          {takenPicture?.path ? (
            <View>
              <Button title="Re-Take" onPress={tryAgainHandler} />
              <Button title="Use Picture" onPress={usePictureHandler} />
            </View>
          ) : (
            <Button title="Take picture" onPress={takePictureHandler} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};
