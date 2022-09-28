// utils
import React, {useState, useEffect, useCallback} from 'react';

// components
import {View, Text, Image, Platform} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NixButton} from 'components/NixButton';

// hooks
import {useSelector} from 'hooks/useRedux';
// @ts-ignore
import AWS from 'aws-sdk/dist/aws-sdk-react-native';

// styles
import {styles} from './PhotoUploadScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface PhotoUploadScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.PhotoUpload
  >;
  route: RouteProp<StackNavigatorParamList, Routes.PhotoUpload>;
}

export interface PictureProps {
  path: string;
}

export const PhotoUploadScreen: React.FC<PhotoUploadScreenProps> = ({
  route,
  navigation,
}) => {
  const [frontPackagePicture, setFrontPackagePicture] =
    useState<PictureProps | null>(null);
  const [nutritionPackagePicture, setNutritionPackagePicture] =
    useState<PictureProps | null>(null);
  const barcode = route.params?.barcode;
  const [pictureType, setPictureType] = useState(1);
  const [uploadInProgress1, setUploadInProgress1] = useState(false);
  const [uploadInProgress2, setUploadInProgress2] = useState(false);
  // const [statusMessage, setStatusMessage] = useState('');

  const userData = useSelector(state => state.auth.userData);

  /*

  Photo file name template:

  `${barcode}-${photo_type}-TRACK${user.id}-${timestamp}`

  barcode: scanned barcode,
  photo_type: 1 - front package, 2 - nutrition label
  user.id: current user ID
  timestamp: new Date().getTime();

  */

  AWS.config.credentials = new AWS.Credentials(
    'AKIAICGAVNR5YBUYKE4A',
    'g6AqkzfSL5vMm6bjfOPsmmWPopUVOpxoOHxDdvER',
  );
  AWS.config.region = 'us-east-1';

  const uploadBucket = new AWS.S3({
    params: {
      Bucket: 'nix-ios-upload',
      region: 'us-east-1',
    },
  });

  const uploadFinished = () => {
    setFrontPackagePicture(null);
    setNutritionPackagePicture(null);
    // setStatusMessage('success');
    navigation.navigate(Routes.Dashboard, {infoMessage: 'success'});
  };

  const uploadPhotos = async () => {
    // const s3bucket = new AWS.S3({
    //   params: {
    //     accessKeyId: "AKIAICGAVNR5YBUYKE4A",
    //     secretAccessKey: "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",
    //     Bucket: 'nix-ios-upload',
    //   }
    // });
    const timestamp = new Date().getTime();
    const filename1 = `${barcode}-1-TRACK${userData.id}-${timestamp}.jpg`;
    const filename2 = `${barcode}-2-TRACK${userData.id}-${timestamp}.jpg`;

    const blob1 = await fetch(
      (Platform.OS === 'ios'
        ? frontPackagePicture?.path
        : `file://${frontPackagePicture?.path}`) || '',
    ).then(res => {
      console.log(res);
      return res.blob();
    });
    const blob2 = await fetch(
      (Platform.OS === 'ios'
        ? nutritionPackagePicture?.path
        : `file://${nutritionPackagePicture?.path}`) || '',
    ).then(res => {
      console.log(res);
      return res.blob();
    });
    try {
      const params1 = {
        Key: filename1,
        Body: blob1,
        ContentType: 'image/jpeg',
      };
      const params2 = {
        Key: filename2,
        Body: blob2,
        ContentType: 'image/jpeg',
      };
      setUploadInProgress1(true);
      uploadBucket.upload(params1, (err: any, data: any) => {
        if (err) {
          console.log('error in callback', err);
          setUploadInProgress1(false);
          throw err;
        }
        setUploadInProgress1(false);
        if (!uploadInProgress2) {
          uploadFinished();
        }
        console.log('Response URL : ' + data.Location);
      });
      setUploadInProgress2(true);
      uploadBucket.upload(params2, (err: any, data: any) => {
        if (err) {
          console.log('error in callback', err);
          setUploadInProgress2(false);
          throw err;
        }
        setUploadInProgress2(false);
        if (!uploadInProgress1) {
          uploadFinished();
        }
        console.log('Response URL : ' + data.Location);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const recievePicture = useCallback((picture: any, picType: number) => {
    console.log(picType);
    if (picType === 1) {
      setFrontPackagePicture({...picture});
    } else if (picType === 2) {
      setNutritionPackagePicture({...picture});
    } else {
      console.log('wrong picture type:', picType);
    }
  }, []);

  useEffect(() => {
    if (route.params?.picture) {
      recievePicture(
        route.params?.picture,
        route.params?.picType || pictureType,
      );
    }
  }, [
    route.params?.picture,
    route.params?.picType,
    recievePicture,
    pictureType,
  ]);

  const showCameraPopupHandler = (picType: number) => {
    setPictureType(picType);
    navigation.navigate(Routes.Camera, {
      barcode: route.params?.barcode,
      picType,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.mb20}>
          <Text>
            Congratulations! You found a product we do not yet have in the
            Nutritionix database. Can you help us by taking 2 photos of the
            product?
          </Text>
        </View>
        <View style={styles.mb5}>
          <Text style={styles.mb10}>1. Front Package Photo:</Text>
          {!frontPackagePicture?.path ? (
            <View>
              <NixButton
                onPress={() => showCameraPopupHandler(1)}
                title="Take Front Package Photo"
                iconName="camera"
              />
            </View>
          ) : (
            <View style={styles.previewImageWrapper}>
              <Image
                resizeMode="contain"
                style={styles.previewImage}
                source={{
                  uri:
                    Platform.OS === 'ios'
                      ? frontPackagePicture?.path
                      : `file://${frontPackagePicture?.path}`,
                }}
              />
              <View style={styles.w50}>
                <NixButton
                  onPress={() => showCameraPopupHandler(1)}
                  title="Retake"
                  iconName="refresh"
                />
              </View>
            </View>
          )}
        </View>
        <View style={styles.mb10}>
          <Text style={styles.mb10}>2. Nutrition Label Photo:</Text>
          {!nutritionPackagePicture?.path ? (
            <NixButton
              onPress={() => showCameraPopupHandler(2)}
              title="Take Nutrition Label Photo"
              iconName="camera"
            />
          ) : (
            <View style={styles.previewImageWrapper}>
              <Image
                resizeMode="contain"
                style={styles.previewImage}
                source={{
                  uri:
                    Platform.OS === 'ios'
                      ? nutritionPackagePicture?.path
                      : `file://${nutritionPackagePicture?.path}`,
                }}
              />
              <View style={styles.w50}>
                <NixButton
                  onPress={() => showCameraPopupHandler(2)}
                  title="Retake"
                  iconName="refresh"
                />
              </View>
            </View>
          )}
        </View>
        <View style={styles.mb10}>
          <Text>Barcode Scanned: {barcode}</Text>
        </View>
        <View style={styles.mb10}>
          <Text>
            By submitting photos, you accept the Nutritionix Privacy Policy
          </Text>
        </View>
        <View>
          {!uploadInProgress1 && !uploadInProgress2 ? (
            <NixButton
              disabled={
                !nutritionPackagePicture?.path || !frontPackagePicture?.path
              }
              onPress={uploadPhotos}
              title="Submit photos to Nutritionix"
            />
          ) : (
            <Text style={styles.pleaseWaitText}>Please wait</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
