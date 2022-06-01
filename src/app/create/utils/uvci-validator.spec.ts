import {FormControl} from '@angular/forms';
import {uvciValidator} from './uvci-validator';

describe('UvciValidator', () => {
	it.each([
		[null, 'urn:uvci:01:CH:123456789123456789123456'],
		[null, 'urn:uvci:01:CH:000000000000000000000000'],
		[null, 'urn:uvci:01:CH:132195F10059B681BS459DB4'],
		[{format: true}, 'urn:uvci:02:CH:000000000000000000000000'],
		[{format: true}, 'urn:uvci:01:DE:000000000000000000000000'],
		[{format: true}, 'urn:uvci:01:CH:12345678912345678912345'],
		[{format: true}, 'urn:uvci:01:CH:1234567891234567891234511'],
		[{format: true}, 'urn:uvci:01:CH:132195F10059B681BS459DB41'],
		[{format: true}, 'urn:uvci:01:CH:132195F10059B681BS459DB']
	])('should return %p for uvci %p', (expectedReturnValue, uvciTotest) => {
		expect(uvciValidator(new FormControl(uvciTotest))).toEqual(expectedReturnValue);
	});
});
