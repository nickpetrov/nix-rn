import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: '#fff',
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
  qrCodeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  camera: {
    display: 'flex',
    flexGrow: 1,
  },
  btnContainer: {
    padding: 5,
  },
  qrCodeTitleContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  qrCodeTitle: {
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  alert: {
    position: 'absolute',
    top: '50%',
    padding: 10,
    flexDirection: 'column',
  },
  alertTitle: {
    fontWeight: '500',
    marginBottom: 10,
  },
  alertText: {
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  snapshot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.5,
  },
});
