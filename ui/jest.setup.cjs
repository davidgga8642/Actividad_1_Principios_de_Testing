// ui/jest.setup.cjs
require('@testing-library/jest-dom');
require('whatwg-fetch');
// Polyfill TextEncoder/TextDecoder for environments where they're not defined
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
	global.TextDecoder = TextDecoder;
}