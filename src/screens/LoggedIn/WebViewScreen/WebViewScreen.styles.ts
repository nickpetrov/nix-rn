import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
    width: '100%',
    // says it's prevent crush when navigate from page with webview
    opacity: 0.99,
    overflow: 'hidden',
  },
});
