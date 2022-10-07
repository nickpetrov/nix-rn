import {StyleSheet} from 'react-native';
import {Colors} from 'constants';

export const styles = StyleSheet.create({
  nixButton: {
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
    alignSelf: 'stretch',
    borderRadius: 5,
    overflow: 'hidden',
  },
  contentWrapper: {
    padding: 10,
    flexDirection: 'row',
  },
  icon: {
    position: 'absolute',
    top: 6,
    left: 10,
    fontSize: 26,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
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
    backgroundColor: '#ef473a',
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
