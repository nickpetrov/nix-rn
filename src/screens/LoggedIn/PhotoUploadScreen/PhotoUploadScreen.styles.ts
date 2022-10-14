import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '30%',
    height: 120,
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
  noteText: {
    fontSize: 12,
    marginBottom: 20,
  },
  noteTextLink: {
    color: Colors.Info,
  },
  btnRetake: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  retakeIcon: {
    fontWeight: '600',
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chekmarkIcon: {
    marginLeft: 5,
  },
  loadContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadTextContainer: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  loadText: {
    textAlign: 'center',
    color: '#fff',
  },
});
