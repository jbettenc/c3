import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useStateWithSessionStorage<T>(
  storageKey: string,
  initialValue: T
): [boolean, T, Dispatch<SetStateAction<T>>] {
  const [initialized, handleInitialized] = useState(false);
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const storedVal = sessionStorage.getItem(storageKey);
    setValue(storedVal ? JSON.parse(storedVal) : initialValue);
    handleInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value, initialized]);

  return [initialized, value, setValue];
}
