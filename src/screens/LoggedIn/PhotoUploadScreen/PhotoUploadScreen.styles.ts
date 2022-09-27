import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    padding: 10,
  },
  tryAgainButtonWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -30,
    zIndex: 99,
  },
  previewImageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '50%',
    height: 160,
  },
  pleaseWaitText: {
    width: '100%',
    textAlign: 'center',
    height: 40,
    alignSelf: 'center',
  },
  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mb20: {
    marginBottom: 20,
  },
  w50: {
    width: '50%',
  },
});
