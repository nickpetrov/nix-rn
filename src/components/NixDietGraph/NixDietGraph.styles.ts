import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    padding: 10,
  },
  titleContainer: {
    backgroundColor: Colors.Highlight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 2,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  btnsContainer: {
    width: 90,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  btn: {
    flex: 1,
  },
  mr3: {
    marginRight: 3,
  },
  ml3: {
    marginLeft: 3,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#666',
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    borderTopColor: Colors.LightGray,
    borderTopWidth: 1,
  },
  footerItem: {
    flex: 1,
    padding: 10,
  },
  flex1: {
    flex: 1,
  },
  fz12: {
    fontSize: 12,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: Colors.LightGray,
  },
  bold: {
    fontSize: 16,
    fontWeight: '500',
  },
  alignCenter: {
    alignItems: 'center',
  },
  footerCenteredText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footerNote: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
    marginBottom: 30,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  marginV10: {
    marginVertical: 10,
  },
  iconStyle: {
    position: 'relative',
    alignSelf: 'center',
    marginRight: 0,
    fontSize: 16,
    color: '#11c1f3',
  },
  colorMarkers: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
