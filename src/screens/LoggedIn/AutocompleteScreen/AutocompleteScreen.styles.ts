import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  main: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginTop: 3,
  },
  tab: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bebebe',
    borderBottomWidth: 0,
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginRight: 4,
  },
  footerText: {
    textAlign: 'center',
    padding: 16,
    fontSize: 16,
  },
  note: {
    textAlign: 'center',
  },
  sectionTitle: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    fontSize: 12,
    textTransform: 'uppercase',
    color: Colors.Gray7,
    minHeight: 20,
  },
  noNet: {
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  noNetText: {
    textAlign: 'center',
  },
  showHint: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 70,
  },
  showHintText: {
    textAlign: 'center',
    marginTop: 10,
    color: Colors.Secondary,
  },
});
