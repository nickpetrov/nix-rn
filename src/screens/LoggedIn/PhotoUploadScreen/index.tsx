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
import {Asset, launchCamera, MediaType} from 'react-native-image-picker';
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
  const redirectStateKey = route.params?.redirectStateKey;
  const [uploadInProgress1, setUploadInProgress1] = useState(false);
  const [uploadInProgress2, setUploadInProgress2] = useState(false);

  const userData = useSelector(state => state.auth.userData);
  console.log('new_product', new_product);
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
    const infoMessage = new_product
      ? 'We will have this product added to our database in the next three business days. To add a comparable food to your log right now, use the "Freeform" tab and enter the calories of the food, followed by a generic name of the food. Examples: 100 cal greek yogurt, 150 cal granola bar, 250 cal lean cuisine'
      : 'We will have this product updated in our database in the next three business days.';
    if (redirectStateKey) {
      navigation.navigate({
        key: redirectStateKey,
      });
    } else {
      navigation.navigate(Routes.Dashboard);
    }
    dispatch(setInfoMessage(infoMessage));
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

    const blob1 = await fetch(frontPackagePicture?.uri || '').then(res => {
      console.log(res);
      return res.blob();
    });
    const blob2 = await fetch(nutritionPackagePicture?.uri || '').then(res => {
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

  const takePictureHandler = (picType: number) => {
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
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
            <Text style={styles.noteTextLink}>Nutritionix Privacy Policy</Text>
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
      {(uploadInProgress1 || uploadInProgress2) && (
        <View style={styles.loadContainer}>
          <View style={styles.loadTextContainer}>
            <Text style={styles.loadText}>
              Please hold while the photos are uploaded...
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
