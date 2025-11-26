import '@testing-library/jest-dom/extend-expect'
import './i18n'
import { server } from './mocks/server'

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())
