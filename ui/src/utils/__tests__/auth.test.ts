// ui/src/utils/_tests_/auth.test.ts
jest.mock('jwt-decode', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    _id: '1',
    email: 'a@b.com',
    iat: 1000,
    exp: 2000000000 // fecha en el futuro, en segundos
  }))
}));

import {
  setAuthToken,
  removeAuthToken,
  isTokenActive,
  getAccessToken,
  getCurrentUser
} from '../auth';
import { tokenKey } from '../../constants/config';

beforeEach(() => {
  localStorage.clear();
});

function putTokenInStorage({
  accessToken = 'token-xyz',
  notBeforeOffsetMs = -1000,
  expirationOffsetMs = 1000
}: {
  accessToken?: string;
  notBeforeOffsetMs?: number;
  expirationOffsetMs?: number;
}) {
  const now = Date.now();
  const value = {
    accessToken,
    notBeforeTimestampInMillis: now + notBeforeOffsetMs,
    expirationTimestampInMillis: now + expirationOffsetMs
  };
  localStorage.setItem(tokenKey, JSON.stringify(value));
}

test('setAuthToken guarda el token en localStorage', () => {
  setAuthToken('token-123');

  const raw = localStorage.getItem(tokenKey);
  expect(raw).not.toBeNull();

  const stored = JSON.parse(raw!);
  expect(stored.accessToken).toBe('token-123');
});

test('removeAuthToken borra el token almacenado', () => {
  putTokenInStorage({});
  removeAuthToken();
  expect(localStorage.getItem(tokenKey)).toBeNull();
});

test('isTokenActive devuelve true cuando el token está dentro de fechas', () => {
  putTokenInStorage({});
  expect(isTokenActive()).toBe(true);
});

test('isTokenActive devuelve false cuando no hay token', () => {
  localStorage.clear();
  expect(isTokenActive()).toBe(false);
});

test('getAccessToken devuelve el accessToken almacenado', () => {
  putTokenInStorage({ accessToken: 'AA' });
  expect(getAccessToken()).toBe('AA');
});

test('getCurrentUser devuelve falsy cuando no hay token activo', () => {
  localStorage.clear();
  expect(getCurrentUser()).toBeFalsy();
});