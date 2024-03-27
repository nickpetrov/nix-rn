// utils
import React, {useState} from 'react';

// components
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NixButton} from 'components/NixButton';
import {
  Asset,
  launchCamera,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

// hooks
import {useSelector, useDispatch} from 'hooks/useRedux';
// @ts-ignore
import AWS from 'aws-sdk/dist/aws-sdk-react-native';

// actions
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './PhotoUploadScreen.styles';

// constants
import {Routes} from 'navigation/Routes';

// types
import {RouteProp} from '@react-navigation/native';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native';
import {aws_config, grocery_photo_upload} from 'config/index';

import * as Sentry from '@sentry/react-native';

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
  const dispatch = useDispatch();
  const [frontPackagePicture, setFrontPackagePicture] = useState<Asset | null>(
    null,
  );
  const [nutritionPackagePicture, setNutritionPackagePicture] =
    useState<Asset | null>(null);
  const barcode = route.params?.barcode;
  const new_product = route.params?.new_product;
  const from = route.params?.from;
  const [uploadInProgress1, setUploadInProgress1] = useState(false);
  const [uploadInProgress2, setUploadInProgress2] = useState(false);

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
    aws_config.aws_access_key_id,
    aws_config.aws_secret_access_key,
  );
  AWS.config.region = aws_config.region;

  const uploadBucket = new AWS.S3({
    params: {
      Bucket: aws_config.bucket,
      region: aws_config.region,
    },
  });

  const uploadFinished = () => {
    setFrontPackagePicture(null);
    setNutritionPackagePicture(null);
    const infoMessage = new_product
      ? 'We will have this product added to our database. To add a comparable food to your log right now, use the "Freeform" tab and enter the calories of the food, followed by a generic name of the food. Examples: 100 cal greek yogurt, 150 cal granola bar, 250 cal lean cuisine'
      : 'We will have this product updated in our database.';
    if (from) {
      navigation.navigate(from);
    } else {
      navigation.navigate(Routes.Dashboard);
    }
    dispatch(setInfoMessage({title: 'Thank you!', text: infoMessage}));
  };

  const uploadPhotos = async () => {
    const timestamp = new Date().getTime();
    const filename1 = `${barcode}-1-TRACK${userData.id}-${timestamp}.jpg`;
    const filename2 = `${barcode}-2-TRACK${userData.id}-${timestamp}.jpg`;

    try {
      const blob1 = await fetch(frontPackagePicture?.uri || '').then(res => {
        console.log(res);
        return res.blob();
      });
      const blob2 = await fetch(nutritionPackagePicture?.uri || '').then(
        res => {
          console.log(res);
          return res.blob();
        },
      );

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

      const uploadPromise1 = new Promise((resolve, reject) => {
        uploadBucket.upload(params1, (err: any, data: any) => {
          if (err) {
            console.log('upload error: ', err);
            reject(err);
          } else {
            console.log('upload success: ' + data.Location);
            resolve(data);
          }
        });
      });

      const uploadPromise2 = new Promise((resolve, reject) => {
        uploadBucket.upload(params2, (err: any, data: any) => {
          if (err) {
            console.log('upload error', err);
            reject(err);
          } else {
            console.log('upload success: ' + data.Location);
            resolve(data);
          }
        });
      });

      setUploadInProgress1(true);
      const uploadPromise1Result = await uploadPromise1;
      console.log(' uploadPromise1Result', uploadPromise1Result);
      setUploadInProgress1(false);

      setUploadInProgress2(true);
      const uploadPromise2Result = await uploadPromise2;
      console.log(' uploadPromise2Result', uploadPromise2Result);
      setUploadInProgress2(false);

      uploadFinished();
    } catch (err) {
      console.log(err);
      Sentry.captureException(err, scope => {
        scope.setTag('nix_photo_upload', 'error');
        return scope;
      });
      uploadFinished();
    }
  };

  const takePictureHandler = (picType: number) => {
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
      maxWidth: grocery_photo_upload.max_photo_width,
      maxHeight: grocery_photo_upload.max_photo_height,
      quality: 0.9 as PhotoQuality,
    };
    launchCamera(options, response => {
      if (response) {
        if (response.assets?.length) {
          if (picType === 1) {
            setFrontPackagePicture(response.assets[0]);
          } else {
            setNutritionPackagePicture(response.assets[0]);
          }
        }
      }
    });
  };

  return (
    <>
      <ScrollView style={styles.root}>
        <View style={styles.container}>
          <View style={styles.mb20}>
            <Text>
              {!new_product
                ? 'Thanks for helping us to keep Nutritionix database up-to-date!'
                : 'Congratulations! You found a product we do not yet have in the Nutritionix database. Can you help us by taking 2 photos of the product?'}
            </Text>
          </View>
          <View style={styles.mb5}>
            <View style={styles.titleContainer}>
              <Text>1. Front Package Photo:</Text>
              {frontPackagePicture?.uri && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  style={styles.chekmarkIcon}
                />
              )}
            </View>
            {!frontPackagePicture?.uri ? (
              <View style={styles.mb20}>
                <NixButton
                  onPress={() => takePictureHandler(1)}
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
                    uri: frontPackagePicture?.uri,
                  }}
                />
                <TouchableOpacity
                  style={styles.btnRetake}
                  onPress={() => takePictureHandler(1)}>
                  <Ionicons name="reload" size={20} style={styles.retakeIcon} />
                  <Text>Retake</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.mb10}>
            <View style={styles.titleContainer}>
              <Text>2. Nutrition Label Photo:</Text>
              {nutritionPackagePicture?.uri && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  style={styles.chekmarkIcon}
                />
              )}
            </View>
            {!nutritionPackagePicture?.uri ? (
              <View style={styles.mb20}>
                <NixButton
                  onPress={() => takePictureHandler(2)}
                  title="Take Nutrition Label Photo"
                  iconName="camera"
                />
              </View>
            ) : (
              <View style={styles.previewImageWrapper}>
                <Image
                  resizeMode="contain"
                  style={styles.previewImage}
                  source={{
                    uri: nutritionPackagePicture?.uri,
                  }}
                />
                <TouchableOpacity
                  style={styles.btnRetake}
                  onPress={() => takePictureHandler(2)}>
                  <Ionicons name="reload" size={20} style={styles.retakeIcon} />
                  <Text>Retake</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.mb10}>
            <Text>Barcode Scanned: {barcode}</Text>
          </View>
          <Text style={styles.noteText}>
            By submitting photos, you accept the{' '}
            <TouchableWithoutFeedback
              onPress={() =>
                Linking.openURL('https://www.nutritionix.com/privacy')
              }>
              <Text style={styles.noteTextLink}>
                Nutritionix Privacy Policy
              </Text>
            </TouchableWithoutFeedback>
          </Text>
          <View>
            <NixButton
              disabled={
                !nutritionPackagePicture?.uri || !frontPackagePicture?.uri
              }
              onPress={uploadPhotos}
              title="Submit photos to Nutritionix"
            />
          </View>
        </View>
      </ScrollView>
      {(uploadInProgress1 || uploadInProgress2) && (
        <View style={styles.loadContainer}>
          <View style={styles.loadTextContainer}>
            <Text style={styles.loadText}>
              Please hold while the photos are uploaded...
            </Text>
          </View>
        </View>
      )}
    </>
  );
};
