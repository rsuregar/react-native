/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useReducer } from 'react';
// eslint-disable-next-line unused-imports/no-unused-imports
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (
      _state: [boolean, T | null],
      action: T | null = null,
    ): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(
  key: string,
  value: any | null,
): Promise<void> {
  if (value === null) {
    // If the value is null, remove the item from the appropriate storage
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } else {
    // Serialize the value before storing it
    const serializedValue = JSON.stringify(value);
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, serializedValue);
    } else {
      await SecureStore.setItemAsync(key, serializedValue);
    }
  }
}

export async function getStorageItemAsync<T>(key: string): Promise<T | null> {
  if (Platform.OS === 'web') {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(
        `Error retrieving item from AsyncStorage for key "${key}":`,
        error,
      );
      return null; // Return null if an error occurs
    }
  } else {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(
        `Error retrieving item from SecureStore for key "${key}":`,
        error,
      );
      return null; // Return null if an error occurs
    }
  }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
  // Public
  const [state, setState] = useAsyncState<T>();

  // Get
  useEffect(() => {
    getStorageItemAsync<T>(key).then((value) => {
      setState(value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [state, setValue];
}
