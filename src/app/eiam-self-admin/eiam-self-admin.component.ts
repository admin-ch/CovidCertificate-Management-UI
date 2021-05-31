import {Component, Inject, Input, OnChanges, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
	selector: 'ec-eiam-self-admin',
	templateUrl: './eiam-self-admin.component.html'
})
export class EiamSelfAdminComponent implements OnChanges, OnDestroy {
	@Input() page: string;
	@Input() name: string;
	url: string;
	private readonly unsubscribe = new Subject();

	constructor(
		@Inject('EIAM_SELF_ADMIN') private readonly eIAMSelfAdmin: string,
		private readonly translate: TranslateService
	) {
		translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.ngOnChanges());
	}

	ngOnChanges(): void {
		this.url = this.eIAMSelfAdmin
			.replace('CURRENT_PAGE', this.page)
			.replace('LANGUAGE', this.translate.currentLang);
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
