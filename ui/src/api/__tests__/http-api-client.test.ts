// ui/src/api/_tests_/http-api-client.test.ts
import HttpApiClient from '../http-api-client';
import { BadRequest, Unauthorized, Project } from '../api-client';
import { tokenKey } from '../../constants/config';

const BASE_URL = 'https://api.example.com';

describe('HttpApiClient', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn();
    localStorage.clear();
  });

  test('token envía las credenciales a /auth/login y devuelve el JSON', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ accessToken: 'abc123' })
    } as Response);

    const client = new HttpApiClient(BASE_URL);
    const result = await client.token('test@example.com', 'secret');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe(`${BASE_URL}/auth/login`);
    expect((options as any).method).toBe('POST');

    const body = (options as any).body as URLSearchParams;
    expect(body.toString()).toContain('email=test%40example.com');
    expect(body.toString()).toContain('password=secret');

    expect(result).toEqual({ accessToken: 'abc123' });
  });

  test('token lanza BadRequest cuando la API responde 400', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValue({
      ok: false,
      status: 400
    } as Response);

    const client = new HttpApiClient(BASE_URL);

    await expect(client.token('a', 'b')).rejects.toBeInstanceOf(BadRequest);
  });

  test('updateProject incluye el header Authorization con el token', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true })
    } as Response);

    const fakeToken = {
      accessToken: 'token-xyz',
      notBeforeTimestampInMillis: 0,
      expirationTimestampInMillis: Date.now() + 60_000
    };
    localStorage.setItem(tokenKey, JSON.stringify(fakeToken));

    const client = new HttpApiClient(BASE_URL);

    const project: Project = {
      _id: '1',
      title: 'Demo project',
      description: 'Descripción',
      version: '1.0.0',
      link: 'https://example.com',
      tag: 'tag',
      timestamp: Date.now()
    };

    await client.updateProject(project);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/v1/projects`);

    const headers = (options as any).headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer token-xyz');
  });

  test('getAboutMe lanza Unauthorized cuando la API devuelve 401', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValue({
      ok: false,
      status: 401
    } as Response);

    const client = new HttpApiClient(BASE_URL);

    await expect(client.getAboutMe()).rejects.toBeInstanceOf(Unauthorized);
  });
});