import {Injectable} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {ObNotificationService} from '@oblique/oblique';

export enum Caches {
	KeyIdentifier = 'KeyIdentifier',
	SigningInformation = 'SigningInformation',
	Rapidtests = 'Rapidtests',
	IssuableRapidtests = 'IssuableRapidtests',
	Vaccines = 'Vaccines',
	IssuableVaccines = 'IssuableVaccines',
	ApiIssuableVaccines = 'ApiIssuableVaccines',
	WebIssuableVaccines = 'WebIssuableVaccines',
	Valuesets = 'Valuesets',
	ExtendedValuesets = 'ExtendedValuesets',
	IssuableVaccineDTO = 'IssuableVaccineDTO',
	IssuableTestDTO = 'IssuableTestDTO',
	CountryCodes = 'CountryCodes',
	CountryCodeByLanguage = 'CountryCodeByLanguage'
}

@Injectable({
	providedIn: 'root'
})
export class CacheResetService {
	constructor(private readonly http: ApiService, private readonly notificationService: ObNotificationService) {}

	resetCache(selectedCaches: Caches[]) {
		this.http.post('caches/clear', selectedCaches).subscribe(() => {
			this.notificationService.success('cache.reset.success');
		});
	}
}
