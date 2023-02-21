import {useState, useRef, useCallback, useEffect} from 'react';

function useAsyncState<T>(
  initialState: T,
): [state: T, setState: React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(initialState);
  const resolveState = useRef<(value: T) => void>();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (resolveState.current) {
      resolveState.current(state);
    }
  }, [state]);

  const setAsyncState = useCallback(
    (newState: any) =>
      new Promise(resolve => {
        if (isMounted.current) {
          resolveState.current = resolve;
          setState(newState);
        }
      }),
    [],
  );

  return [state, setAsyncState];
}

export default useAsyncState;
