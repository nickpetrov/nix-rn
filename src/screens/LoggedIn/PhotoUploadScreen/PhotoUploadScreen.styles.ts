import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
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
});
