import {TestBed} from '@angular/core/testing';
import {ObLanguageService} from 'shared/language.service';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '@oblique/oblique';
import {Observable} from 'rxjs';
import {DateAdapter} from '@angular/material/core';

describe('LanguageService', () => {
	let service: ObLanguageService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		});
		service = TestBed.inject(ObLanguageService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should have a locales property', () => {
		expect(ObLanguageService.locales).toBeTruthy();
	});

	describe('locale$', () => {
		it('should be an observable', () => {
			expect(service.locale$ instanceof Observable).toBe(true);
		});

		it('should emit a locale when language changes to defined one', done => {
			const translate = TestBed.inject(TranslateService);
			translate.onLangChange.emit({lang: 'fr', translations: null});
			service.locale$.subscribe(locale => {
				expect(locale).toBe('fr-CH');
				done();
			});
		});

		it('should emit a language when language changes to undefined one', done => {
			const translate = TestBed.inject(TranslateService);
			translate.onLangChange.emit({lang: 'es', translations: null});
			service.locale$.subscribe(locale => {
				expect(locale).toBe('es');
				done();
			});
		});
	});

	describe('setAdapter', () => {
		it('should subscribe to locale change', () => {
			jest.spyOn(service.locale$, 'subscribe');
			service.setAdapter(null);
			expect(service.locale$.subscribe).toHaveBeenCalled();
		});

		it('should set the locale on the adapter', () => {
			const adapter = {setLocale: jest.fn()} as unknown as DateAdapter<unknown>;
			service.setAdapter(adapter);
			expect(adapter.setLocale).toHaveBeenCalled();
		});
	});
});
