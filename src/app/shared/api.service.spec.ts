import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ApiService} from './api.service';

describe('ApiService', () => {
	let service: ApiService;
	let http: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, ObliqueTestingModule],
			providers: [{provide: 'HOST', useValue: 'host'}]
		});
		service = TestBed.inject(ApiService);
		http = TestBed.inject(HttpClient);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('get', () => {
		it('should call http get with correct url', () => {
			jest.spyOn(http, 'get');
			// @ts-ignore
			service.get('get');
			expect(http.get).toHaveBeenCalledWith('host/api/v1/get', undefined);
		});
	});

	describe('post', () => {
		it('should call http post with correct url', () => {
			jest.spyOn(http, 'post');
			// @ts-ignore
			service.post('post', {});
			expect(http.post).toHaveBeenCalledWith('host/api/v1/post', {}, undefined);
		});
	});

	describe('postBlob', () => {
		it('should call http post with correct url', () => {
			jest.spyOn(http, 'post');
			// @ts-ignore
			service.postBlob('post-blob', {});
			expect(http.post).toHaveBeenCalledWith('host/api/v1/post-blob', {}, {responseType: 'blob'});
		});
	});

	describe('postText', () => {
		it('should call http post with correct url', () => {
			jest.spyOn(http, 'post');
			// @ts-ignore
			service.postText('post-text', {});
			expect(http.post).toHaveBeenCalledWith('host/api/v1/post-text', {}, {responseType: 'text'});
		});
	});

	describe('delete', () => {
		it('should call http DELETE with correct url', () => {
			jest.spyOn(http, 'delete');
			// @ts-ignore
			service.delete('delete');
			expect(http.delete).toHaveBeenCalledWith('host/api/v1/delete', undefined);
		});
	});

	describe('head', () => {
		it('should call http HEAD with correct url', () => {
			jest.spyOn(http, 'head');
			// @ts-ignore
			service.head('head');
			expect(http.head).toHaveBeenCalledWith('host/api/v1/head', undefined);
		});
	});

	describe('options', () => {
		it('should call http OPTIONS with correct url', () => {
			jest.spyOn(http, 'options');
			// @ts-ignore
			service.options('options');
			expect(http.options).toHaveBeenCalledWith('host/api/v1/options', undefined);
		});
	});

	describe('put', () => {
		it('should call http PUT with correct url', () => {
			jest.spyOn(http, 'put');
			// @ts-ignore
			service.put('put', {});
			expect(http.put).toHaveBeenCalledWith('host/api/v1/put', {}, undefined);
		});
	});

	describe('patch', () => {
		it('should call http PATCH with correct url', () => {
			jest.spyOn(http, 'patch');
			// @ts-ignore
			service.patch('patch', {});
			expect(http.patch).toHaveBeenCalledWith('host/api/v1/patch', {}, undefined);
		});
	});

	describe('jsonp', () => {
		it('should call http JSONP with correct url', () => {
			jest.spyOn(http, 'jsonp');
			// @ts-ignore
			service.jsonp('jsonp', 'callback');
			expect(http.jsonp).toHaveBeenCalledWith('host/api/v1/jsonp', 'callback');
		});
	});

	describe('request', () => {
		it('should call http REQUEST with correct url', () => {
			jest.spyOn(http, 'request');
			// @ts-ignore
			service.request('post', 'request');
			expect(http.request).toHaveBeenCalledWith('post', 'host/api/v1/request', undefined);
		});
	});
});
