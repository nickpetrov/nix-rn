// utils
import React, {useRef, useState, useEffect, useCallback} from 'react';

// components
import {
  View,
  ScrollView,
  Button,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

// styles
import {styles} from './CameraScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {RouteProp} from '@react-navigation/native';
import { IPhoto } from 'components/Scanner';


interface CameraScreenProps {
  navigation: NativeStackNavigationProp<StackNavigatorParamList, Routes.Camera>;
  route: RouteProp<StackNavigatorParamList, Routes.Camera>;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  navigation,
  route,
}) => {
  const [isActive, setActive] = useState(true);
  const [takenPicture, setTakenPicture] = useState<IPhoto | null>(null);
  const camera = useRef<Camera>(null);

  const tryAgainHandler = () => {
    setTakenPicture(null);
  };

  const takePhoto = async () => {    
    const photo = await camera.current?.capture();

    if (photo?.uri) {
      setTakenPicture((prev: IPhoto | null) => {
        if (!prev) {
          return photo;
        } else {
          return prev;
        }
      });
    }
  };

  const onError = useCallback((error: any) => {
    console.error(error);
  }, []);

  const usePictureHandler = () => {
    setTakenPicture(null);
    navigation.navigate(Routes.PhotoUpload, {
      picture: takenPicture as any,
      barcode: route.params?.barcode,
      picType: route.params?.picType,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setActive(false);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.cameraPopupWrapper}>
      <ScrollView>
        {/* <Pressable
            style={styles.buttonClose}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable> */}
        {takenPicture ? (
          <Image
            style={styles.image}
            source={{
              uri:
                Platform.OS === 'ios'
                  ? takenPicture?.uri
                  : `file://${takenPicture?.uri}`,
            }}
            resizeMode="contain"
          />
        ) : (
          <Camera
          style={{flex :1}}
          ref={camera}
          cameraType={CameraType.Back} // front/back(default)
          flashMode='auto'
          isActive={isActive}
          onError={onError}
          photo={true}
        />
        )}
        <View>
          {takenPicture?.uri ? (
            <View>
              <Button title="Re-Take" onPress={tryAgainHandler} />
              <Button title="Use Picture" onPress={usePictureHandler} />
            </View>
          ) : (
            <Button title="Take picture" onPress={takePhoto} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
