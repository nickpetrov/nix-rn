import {StyleSheet} from 'react-native';
import {Colors} from 'constants';

export const styles = StyleSheet.create({
  nixButton: {
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
    alignSelf: 'stretch',
    borderRadius: 5,
    overflow: 'hidden',
    padding: 5,
    height: 40,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
    left: 0,
    marginRight: 10,
    fontSize: 26,
    color: '#fff',
  },
  titleContainer: {
    // flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#444',
    fontSize: 15,
  },
  facebookBtn: {
    backgroundColor: '#4267b2',
  },
  facebookBtnText: {
    color: '#fff',
  },
  assertive: {
    backgroundColor: Colors.Red,
  },
  assertiveText: {
    color: '#fff',
  },
  positive: {
    backgroundColor: '#387ef5',
  },
  positiveText: {
    color: '#fff',
  },
  calm: {
    backgroundColor: '#11c1f3',
  },
  calmText: {
    color: '#fff',
  },
  primary: {
    backgroundColor: Colors.Primary,
  },
  primaryText: {
    color: '#fff',
  },
  energized: {
    backgroundColor: '#ffc900',
  },
  energizedText: {
    color: '#fff',
  },
  blue: {
    backgroundColor: Colors.Blue,
  },
  blueText: {
    color: '#fff',
  },
  dark: {
    backgroundColor: '#444',
  },
  darkText: {
    color: '#fff',
  },
  outline: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
  },
  outlineText: {
    color: '#444',
  },
  gray: {
    backgroundColor: Colors.LightGray,
  },
  grayText: {
    color: '#444',
  },
  defaultTextStyles: {
    color: '#444',
  },
  defaultBtnBgColor: {
    backgroundColor: '#f8f8f8',
  },
  mt10: {
    marginTop: 10,
  },
});
