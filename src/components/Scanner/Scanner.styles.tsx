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
  zoom: {
    // position: 'absolute',
    bottom: '30%',
    flexDirection: 'row',
    backgroundColor: '#999',
    borderRadius: 20,
    opacity: 0.9,
    zIndex: 3,
    alignSelf: 'center',
    maxWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 5
  },
  activeZoomButton: {
    width: 40,
    height: 40,
  }
});
