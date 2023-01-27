// utils
import React, {useState, useLayoutEffect, useEffect, useCallback} from 'react';
import {launchCamera} from 'react-native-image-picker';
import {NetInfoStateType, useNetInfo} from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import {useIsFocused} from '@react-navigation/native';

// components
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Scanner from 'components/Scanner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NixButton} from 'components/NixButton';

// hooks
import {useDispatch, useSelector} from 'hooks/useRedux';

// actions
import {
  barcodeExistsInExistingBarcodes,
  checkBarcodeExistsInRecordForSync,
  mergeCurrentSession,
  resetCurrentSession,
  mergePhotoByKey,
  needToUpdateExistingBarcodes,
  checkRecordsForSyncTableExists,
  saveRecordsForSync,
  sequentialSync,
} from 'store/groceryAgentMode/groceryAgentMode.actions';
import {setInfoMessage} from 'store/base/base.actions';

// styles
import {styles} from './GroceryAgentModeScreen.styles';

// constants
import {Routes} from 'navigation/Routes';
import {grocery_photo_upload, pictureFolder} from 'config/index';

// types
import {photoTemplateKeys} from 'store/groceryAgentMode/groceryAgentMode.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from 'navigation/navigation.types';
import {MediaType} from 'react-native-image-picker/lib/typescript/types';

interface GroceryAgentModeScreenProps {
  navigation: NativeStackNavigationProp<
    StackNavigatorParamList,
    Routes.Dashboard
  >;
}

const GroceryAgentModeScreen: React.FC<GroceryAgentModeScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const netInfo = useNetInfo();
  const wiFiNetworkIsInUse =
    netInfo.isConnected && netInfo.type === NetInfoStateType.wifi;
  const userId = useSelector(state => state.auth.userData.id);
  const {currentSession, barcodesForSyncCount, existingBarcodesCount} =
    useSelector(state => state.groceryAgentMode);
  const [activeScan, setActiveScan] = useState(false);

  useEffect(() => {
    dispatch(needToUpdateExistingBarcodes());
    dispatch(checkRecordsForSyncTableExists());
  }, [dispatch]);

  useLayoutEffect(() => {
    if (activeScan) {
      navigation.setOptions({
        headerShown: false,
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        headerTitle: 'Grocery Agent Mode',
      });
    }
  }, [navigation, activeScan]);

  const takePhoto = (key: photoTemplateKeys) => {
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
    };
    launchCamera(options, response => {
      if (response) {
        if (response.assets?.length) {
          const timestamp = new Date().getTime();
          const photo_name =
            currentSession.barcode +
            '-' +
            currentSession.photos[key].photo_type +
            '-' +
            'TRACK' +
            currentSession.userId +
            '-' +
            timestamp +
            '.jpg';
          const photo = response.assets[0];
          if (photo.height && photo.width) {
            photo.height =
              photo.height *
              (grocery_photo_upload.max_photo_width / photo.width);
          }
          photo.width = grocery_photo_upload.max_photo_width;
          dispatch(
            mergePhotoByKey(key, {
              photo_src: photo.uri,
              photo_name,
            }),
          ).then(() => {
            RNFS.mkdir(pictureFolder)
              .then(() => {
                if (Platform.OS === 'ios') {
                  RNFS.copyAssetsFileIOS(
                    photo.uri || '',
                    `${pictureFolder}/${photo_name}`,
                    photo.width || 0,
                    photo.height || 0,
                  );
                } else {
                  RNFS.copyFile(
                    photo.uri || '',
                    `${pictureFolder}/${photo_name}`,
                  );
                }
              })
              .then(() => RNFS.scanFile(`${pictureFolder}/${photo_name}`));
          });
        }
      }
    });
  };

  const scanBarcode = useCallback(
    async (barcode: string) => {
      if (barcode) {
        const barcodeExistsInTableExistingBarcodes =
          await barcodeExistsInExistingBarcodes(barcode);
        const checkBarcodeExistsInTableRecordForSync =
          await checkBarcodeExistsInRecordForSync(barcode);
        const barcodeExists =
          barcodeExistsInTableExistingBarcodes ||
          checkBarcodeExistsInTableRecordForSync;
        if (!barcodeExists) {
          dispatch(mergeCurrentSession({barcode: barcode, userId: userId}));
        } else {
          dispatch(
            setInfoMessage({
              text: 'Looks like we already have this product in our DB.',
              loadingType: true,
              loadTime: 3000,
            }),
          );
        }
      }
      setActiveScan(false);
    },
    [dispatch, userId],
  );

  const cancel = () => {
    dispatch(resetCurrentSession());
  };

  const handleSaveRecordsForSync = () => {
    dispatch(saveRecordsForSync());
  };

  const handleSequentialSync = () => {
    dispatch(sequentialSync());
  };

  return (
    <>
      {activeScan ? (
        <View style={styles.scanContainer}>
          {isFocused && (
            <Scanner callBack={scanBarcode} isFocused={isFocused} />
          )}
        </View>
      ) : (
        <ScrollView style={styles.root}>
          {!currentSession.barcode ? (
            <View style={styles.container}>
              <Text style={[styles.text, styles.textAlignCenter]}>
                To upload your photos, please connect to wifi!
              </Text>
              <Text style={[styles.text, styles.textAlignCenter]}>
                {barcodesForSyncCount} Barcodes Waiting to Sync (
                {barcodesForSyncCount * 2} photos)
              </Text>
              <View style={styles.syncBtnContainer}>
                <NixButton
                  iconName="reload"
                  iosIcon
                  iconStyles={styles.iconStyles}
                  title="Sync Photos to Cloud"
                  type="gray"
                  disabled={!barcodesForSyncCount || !wiFiNetworkIsInUse}
                  onPress={handleSequentialSync}
                />
              </View>
              <Text>
                Remember, for every product your scan follow this order:
              </Text>
              <Text>1. Take front of package photo</Text>
              <Text>2. Take nutrition label photo</Text>
              <View style={styles.scanBtnContainer}>
                <NixButton
                  iconName="barcode"
                  iconStyles={styles.iconStyles}
                  title="Start Scanning"
                  type="gray"
                  onPress={() => setActiveScan(true)}
                />
              </View>
              <Text style={[styles.textAlignCenter, styles.text, styles.mb20]}>
                to stop scanning mode, hit "cancel" button to return to this
                screen.
              </Text>
              <Text>Tips:</Text>
              <Text style={styles.mb20}>
                - Align products parallel to the shelf to avoid glare from
                ceiling lights
              </Text>
              <Text>Barcode Database: {existingBarcodesCount}</Text>
            </View>
          ) : (
            <View style={styles.container}>
              <Text style={styles.mb20}>UPC: {currentSession.barcode}</Text>
              <>
                {Object.entries(currentSession.photos).map(
                  ([key, value], index) => {
                    if (value.show) {
                      return (
                        <View style={styles.mb5} key={key}>
                          <View style={styles.titleContainer}>
                            <Text>
                              {index + 1}. {value.title} Photo:
                            </Text>
                            {value?.photo_src && (
                              <Ionicons
                                name="checkmark"
                                size={20}
                                style={styles.chekmarkIcon}
                              />
                            )}
                          </View>
                          {!value?.photo_src ? (
                            <View style={styles.mb20}>
                              <NixButton
                                onPress={() =>
                                  takePhoto(key as photoTemplateKeys)
                                }
                                title={`Take ${value.title} Photo`}
                                iconName="camera"
                                iconStyles={styles.iconStyles}
                              />
                            </View>
                          ) : (
                            <View style={styles.previewImageWrapper}>
                              <Image
                                resizeMode="contain"
                                style={styles.previewImage}
                                source={{
                                  uri: value?.photo_src,
                                }}
                              />
                              <TouchableOpacity
                                style={styles.btnRetake}
                                onPress={() =>
                                  takePhoto(key as photoTemplateKeys)
                                }>
                                <Ionicons
                                  name="reload"
                                  size={20}
                                  style={styles.retakeIcon}
                                />
                                <Text>Retake</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      );
                    }
                    return null;
                  },
                )}
              </>
              <View style={styles.btnContainer}>
                <NixButton
                  onPress={handleSaveRecordsForSync}
                  title="Save"
                  disabled={!currentSession.canSave}
                />
              </View>
              <View style={styles.btnContainer}>
                <NixButton onPress={cancel} title="Cancel" />
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default GroceryAgentModeScreen;
