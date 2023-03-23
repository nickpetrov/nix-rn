// utils
import React, {useState, useEffect} from 'react';

// hooks
import useStateWithCallback from 'hooks/useStateWithCallback';
import {useSelector, useDispatch} from 'hooks/useRedux';

// components
import {
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';

// styles
import {styles} from './AddPhotoView.styles';
import {showAgreementPopup} from 'store/base/base.actions';
import {PhotoProps} from 'store/autoComplete/autoComplete.types';
import requestCameraPermission from 'helpers/cameraPermision';
import {Modal, SafeAreaView} from 'react-native';
import {grocery_photo_upload} from 'config/index';

interface AddPhotoViewProps {
  image?: PhotoProps;
  emptyText?: string;
  deletePhoto: () => void;
  isUploadPhotoLoading?: boolean;
  changePhoto: (image: Asset) => void;
}

const AddPhotoView: React.FC<AddPhotoViewProps> = ({
  image,
  emptyText,
  changePhoto,
  deletePhoto,
  isUploadPhotoLoading,
}) => {
  const dispatch = useDispatch();
  const {agreedToUsePhoto} = useSelector(state => state.base);
  const [showChooseGetPhoto, setShowChooseGetPhoto] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useStateWithCallback<Asset | null>(
    null,
  );
  const [photoVisible, setPhotoVisible] = useState<boolean>(false);

  const lauchImageFromGallery = () => {
    setShowChooseGetPhoto(false);
    const options = {
      mediaType: 'photo' as MediaType,
      maxWidth: grocery_photo_upload.max_photo_width,
      maxHeight: grocery_photo_upload.max_photo_height,
      quality: 0.9 as PhotoQuality,
    };

    launchImageLibrary(options, response => {
      if (response) {
        if (response.assets?.length) {
          setUploadPhoto(response.assets[0]);
          console.log('choosen image', response.assets[0]);
          setPhotoVisible(true);
        }
      }
    });
  };
  const lauchImageFromCamera = () => {
    setShowChooseGetPhoto(false);
    const options = {
      mediaType: 'photo' as MediaType,
      noData: true,
      maxWidth: grocery_photo_upload.max_photo_width,
      maxHeight: grocery_photo_upload.max_photo_height,
      quality: 0.9 as PhotoQuality,
    };

    requestCameraPermission().then(result => {
      if (result) {
        launchCamera(options, response => {
          if (response) {
            if (response.assets?.length) {
              setUploadPhoto(response.assets[0]);
              console.log('choosen image', response.assets[0]);
              setPhotoVisible(true);
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    if (uploadPhoto) {
      changePhoto(uploadPhoto);
    }
  }, [uploadPhoto, changePhoto]);

  return (
    <>
      <View style={styles.root}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (!uploadPhoto) {
              setPhotoVisible(!photoVisible);
            }
          }}>
          <View style={styles.photoBtnContainer}>
            <View style={styles.photoBtn}>
              <FontAwesome name="camera" color="#000" size={20} />
              <Text style={styles.photoBtnText}>Photo</Text>
              {!uploadPhoto && (
                <FontAwesome
                  name={photoVisible ? 'chevron-down' : 'chevron-right'}
                  color="#000"
                  size={15}
                />
              )}
            </View>
            {!uploadPhoto && (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (agreedToUsePhoto) {
                    setShowChooseGetPhoto(!showChooseGetPhoto);
                  } else {
                    dispatch(showAgreementPopup());
                  }
                }}>
                <View style={styles.photoBtn}>
                  <FontAwesome
                    name={image ? 'refresh' : 'plus'}
                    color="#000"
                    size={11}
                  />
                  <Text style={styles.photoBtnText}>
                    {image ? 'Change Photo' : 'Add Photo'}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </TouchableWithoutFeedback>
        {photoVisible && (
          <>
            {!uploadPhoto && !image ? (
              <Text style={styles.noPhoto}>
                {emptyText ? emptyText : 'This food has no photo.'}
              </Text>
            ) : null}
            <View style={styles.imageContainer}>
              {!!uploadPhoto && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    setUploadPhoto(null);
                    deletePhoto();
                  }}>
                  <FontAwesome name="trash" color="#fff" size={16} />
                </TouchableOpacity>
              )}
              {!!uploadPhoto || !!image ? (
                <Image
                  style={styles.image}
                  source={{
                    uri: uploadPhoto
                      ? uploadPhoto.uri
                      : image?.highres || image?.thumb || '',
                  }}
                  resizeMode="cover"
                />
              ) : null}
              {isUploadPhotoLoading && (
                <View style={styles.uploadPhotoLoading}>
                  <FontAwesome name="spinner" color="#fff" size={16} />
                </View>
              )}
            </View>
          </>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showChooseGetPhoto}
        onRequestClose={() => {
          setShowChooseGetPhoto(false);
        }}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.photoChoose}>
            <TouchableOpacity
              style={[styles.photoChooseItem, styles.photoChooseItemBorder]}
              onPress={lauchImageFromGallery}>
              <View style={styles.photoChooseItemRow}>
                <Text style={styles.photoChooseItemText}>Choose File</Text>
                <Ionicons name="folder-outline" color="#000" size={20} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoChooseItem}
              onPress={lauchImageFromCamera}>
              <View style={styles.photoChooseItemRow}>
                <Text style={styles.photoChooseItemText}>Take photo</Text>
                <Ionicons name="camera-outline" color="#000" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default AddPhotoView;
