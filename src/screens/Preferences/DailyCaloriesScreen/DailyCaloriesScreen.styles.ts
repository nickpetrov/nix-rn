import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    marginVertical: 5,
    padding: 10,
  },
  fields: {
    borderRadius: 10,
    borderColor: Colors.LightGray,
    borderWidth: 1,
    marginBottom: 20,
  },
  panel: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 10,
    marginBottom: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    backgroundColor: '#fff',
  },
  elevation: {
    elevation: 5,
  },
  panelHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomColor: Colors.BgGray,
    backgroundColor: '#eee',
  },
  panelBody: {
    padding: 20,
  },
  recommendedKcal: {
    fontWeight: '800',
    marginLeft: 20,
    width: '15%',
  },
  hyperlink: {
    marginTop: 2,
    color: Colors.Info,
  },
  input: {
    flexGrow: 0,
    minWidth: 40,
    maxWidth: 40,
    paddingHorizontal: 0,
  },
  question: {
    padding: 5,
  },
  selectIcon: {
    color: Colors.Secondary,
    alignSelf: 'center',
    marginLeft: 10,
    top: -2,
  },
  labelContainerStyle: {
    paddingHorizontal: 0,
  },
  labelContainerStyleFull: {
    flex: 1,
    paddingHorizontal: 0,
    width: 'auto',
  },
  inputIcon: {
    color: Colors.Secondary,
  },
  unit: {
    color: '#000',
    width: 'auto',
    flex: 1,
    paddingHorizontal: 0,
  },
  errorStyles: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
    color: Colors.Red,
  },
  kcalInput: {
    flex: 0,
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 2,
    width: 100,
    paddingHorizontal: 5,
    textAlign: 'right',
  },
  kcalLabelContainer: {
    width: 'auto',
    paddingHorizontal: 0,
    marginRight: 10,
  },
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    minWidth: 50,
  },
  saveBtn: {
    backgroundColor: Colors.Primary,
    padding: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  disclaimer: {
    paddingHorizontal: 10,
    marginBottom: 80,
  },
  disclaimerText: {
    color: Colors.Gray8,
  },
  infoCircle: {
    position: 'absolute',
    left: '35%',
    width: 25,
    height: 25,
    top: 15,
    zIndex: 10,
  },
  infoCircleIcon: {
    color: Colors.Gray6,
  },
  updateCalorieMessage: {
    color: 'green',
    textAlign: 'center',
    fontWeight: '500',
    alignSelf: 'center',
    padding: 5,
  },
  flex1: {
    flex: 1,
  },
  textBold: {
    fontWeight: 'bold',
  },
  initValueTextStyle: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
  optionTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  selectedItemTextStyle: {
    fontSize: 16,
    color: Colors.Info,
    fontWeight: '500',
  },
  textRight: {
    textAlign: 'right',
  },
  ageInputStyle: {
    borderBottomWidth: 0,
  },
  recommendedKcalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
