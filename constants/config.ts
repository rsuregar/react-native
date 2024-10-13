// const APP_URL = 'https://simanis.test';
// const API_PREFIX = '/api';

// export const API_URL: string = APP_URL + API_PREFIX;

// eslint-disable-next-line import/no-extraneous-dependencies, import/no-extraneous-dependencies
import { API_PREFIX, APP_URL } from 'react-native-dotenv';

export const API_URL: string = `${APP_URL}${API_PREFIX}`;
