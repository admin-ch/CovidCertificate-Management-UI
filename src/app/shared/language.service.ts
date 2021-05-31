import {Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ObLanguageService {
	static readonly locales: {[key: string]: string} = {
		de: 'de-CH',
		fr: 'fr-CH',
		it: 'it-CH'
	};
	readonly locale$: Observable<string>;
	private readonly locale: BehaviorSubject<string>;

	constructor(translate: TranslateService) {
		this.locale = new BehaviorSubject<string>(ObLanguageService.getLocale(translate.currentLang));
		this.locale$ = this.locale.asObservable();
		translate.onLangChange
			.pipe(map(lang => ObLanguageService.getLocale(lang.lang)))
			.subscribe(locale => this.locale.next(locale));
	}

	private static getLocale(language: string): string {
		return ObLanguageService.locales[language] || language;
	}

	setAdapter(adapter: DateAdapter<any>): void {
		this.locale$.subscribe(locale => adapter.setLocale(locale));
	}
}
