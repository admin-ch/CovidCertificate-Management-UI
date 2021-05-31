import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Component({
	selector: 'ec-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	lang$: Observable<string>;
	showWarning = environment.showWarning;
	isAuthenticated = false;

	constructor(translate: TranslateService) {
		this.lang$ = translate.onLangChange.pipe(
			map(lang => lang.lang),
			startWith(translate.currentLang)
		);
	}
}
