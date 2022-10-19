import React from 'react';
function useStateWithCallback<S>(
  initialValue: S,
): [value: S, setValueWithCallback: (v: S, callback?: () => void) => void] {
  const callbackRef = React.useRef<(() => void) | null>(null);

  const [value, setValue] = React.useState<S>(initialValue);

  React.useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current();

      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = React.useCallback(
    (newValue: S, callback?: any) => {
      callbackRef.current = callback;

      setValue(newValue);
    },
    [],
  );

  return [value, setValueWithCallback];
}

export default useStateWithCallback;
