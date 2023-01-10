import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  header: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  input: {
    width: 140,
    borderRadius: 2,
    height: 32,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.LightGray,
    textTransform: 'uppercase',
  },
  inputError: {
    borderColor: '#f00',
    borderWidth: 1,
  },
  btn: {
    width: 80,
    maxWidth: 80,
    alignSelf: 'center',
    marginLeft: 10,
  },
  errors: {},
  error: {
    color: '#f00',
    fontSize: 13,
    textAlign: 'center',
  },
  alert: {
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: 320,
    marginVertical: 0,
    marginHorizontal: 'auto',
    backgroundColor: '#d9edf7',
    borderWidth: 1,
    borderColor: '#bce8f1',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  alertHeader: {
    color: '#31708f',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  alertText: {
    color: '#31708f',
    marginBottom: 10,
  },
  alertLink: {
    color: Colors.Primary,
  },
  alertBtn: {
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  subscribeNow: {
    paddingTop: 85,
    paddingHorizontal: 30,
    paddingBottom: 35,
  },
  subscribeNowTitle: {
    color: '#01B3E4',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  subscribeNowBtn: {
    backgroundColor: '#01B3E4',
  },
  alertBubble: {
    backgroundColor: '#FFA600',
    borderRadius: 4,
    padding: 10,
    width: 300,
    position: 'absolute',
    left: '50%',
    marginLeft: -150,
    top: 50,
  },
  alertBubbleAfter: {
    bottom: '100%',
    left: '50%',
    top: 35,
    content: '',
    height: 0,
    width: 0,
    position: 'absolute',
    borderColor: 'rgba(255, 166, 0, 0)',
    borderBottomColor: '#FFA600',
    borderWidth: 8,
    marginLeft: -8,
  },
  alertBubbleText: {
    textAlign: 'center',
    color: '#fff',
  },
  alertBubbleLink: {
    textDecorationLine: 'underline',
  },
  coachesTitle: {
    padding: 10,
  },
  coachItem: {
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachItemNote: {
    backgroundColor: '#fff',
    color: '#999',
    padding: 10,
  },
  coachItemPhoto: {
    width: 40,
    height: 40,
  },
  coachItemText: {
    marginLeft: 10,
  },
});
