import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  camera: {
    display: 'flex',
    flex: 1,
  },
  qrCodeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  qrCodeTitleContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  qrCodeTitle: {
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  snapshot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
