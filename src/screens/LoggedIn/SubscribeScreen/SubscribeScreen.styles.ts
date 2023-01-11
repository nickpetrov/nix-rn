import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 15,
  },
  intro: {
    fontSize: 16,
    marginBottom: 15,
  },
  item: {
    backgroundColor: '#f2f9ff',
    borderWidth: 2,
    borderColor: '#fff',
    padding: 10,
  },
  itemHeader: {
    flexDirection: 'row',
  },
  itemPrice: {
    backgroundColor: '#1EA548',
    height: 60,
    width: 60,
    borderRadius: 60,
    marginTop: -5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemPriceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemPriceText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#fff',
  },
  itemPriceSup: {
    fontSize: 10,
    lineHeight: 18,
    color: '#fff',
  },
  itemPriceSub: {
    fontSize: 11,
    marginTop: -5,
    color: '#fff',
  },
  itemTerm: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  itemInfo: {
    fontSize: 13,
    color: Colors.Gray6,
  },
  itemBtn: {
    backgroundColor: '#01B3E4',
    marginTop: 10,
    marginBottom: 3,
  },
  restoreBtn: {
    marginVertical: 30,
    height: 30,
  },
  restoreBtnText: {
    fontSize: 12,
  },
  note: {
    fontSize: 12,
    color: Colors.Gray8,
    marginTop: 20,
    marginBottom: 10,
  },
  noteLink: {
    color: Colors.Primary,
  },
  subscribeDescriptionTitle: {
    fontWeight: '700',
    color: Colors.Gray8,
    fontSize: 12,
  },
  subscribeDescriptionText: {
    fontSize: 12,
    color: Colors.Gray8,
  },
  subscribeDescriptionLink: {
    color: Colors.Blue,
  },
  welcome: {
    color: Colors.Gray7,
    paddingVertical: 15,
  },
  dark: {
    color: '#000',
  },
  pro: {
    color: Colors.Primary,
  },
  proItem: {
    backgroundColor: '#5bc0de',
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
  },
  proItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  proItemText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#fff',
    marginRight: 5,
  },
  proItemSup: {
    color: '#ff0',
    fontStyle: 'italic',
    lineHeight: 14,
    fontSize: 12,
  },
  unsubscribeBtn: {
    borderWidth: 2,
    borderColor: '#5bc0de',
    minHeight: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  unsubscribeBtnText: {
    color: '#5bc0de',
  },
});
