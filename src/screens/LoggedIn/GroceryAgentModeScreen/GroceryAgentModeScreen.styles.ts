import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  scanContainer: {
    flexGrow: 1,
  },
  iconStyles: {
    position: 'relative',
    fontSize: 18,
    alignSelf: 'center',
    marginRight: 5,
    color: Colors.Gray9,
  },
  text: {
    marginBottom: 10,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  syncBtnContainer: {
    marginVertical: 20,
  },
  scanBtnContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  mb20: {
    marginBottom: 20,
  },
  mb5: {
    marginBottom: 5,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chekmarkIcon: {
    marginLeft: 5,
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
  btnContainer: {
    marginTop: 20,
  },
});
