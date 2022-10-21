import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginTop: 3,
    position: 'absolute',
    top: 0,
    height: 40,
    width: '100%',
  },
  emptySpaceForTabs: {
    marginTop: 40,
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
    paddingHorizontal: 10,
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
  footer: {
    padding: 10,
  },
  showMore: {
    width: 140,
    backgroundColor: '#eee',
    alignSelf: 'center',
    padding: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMoreText: {
    color: Colors.Gray6,
    fontSize: 11,
  },
  showMoreIcon: {
    fontSize: 14,
    textAlignVertical: 'center',
    marginLeft: 5,
    color: Colors.Gray6,
  },
  noMatch: {
    padding: 10,
    textAlign: 'center',
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    lineHeight: 35,
    fontStyle: 'italic',
  },
});
