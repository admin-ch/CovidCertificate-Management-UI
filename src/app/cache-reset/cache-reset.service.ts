import {Injectable} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {ObNotificationService} from '@oblique/oblique';

export enum Caches {
	KeyIdentifier = 'Key Identifier',
	SigningInformation = 'Signing Information',
	Rapidtests = 'Rapidtests',
	IssuableRapidtests = 'Issuable Rapidtests',
	Vaccines = 'Vaccines',
	IssuableVaccines = 'Issuable Vaccines',
	ApiIssuableVaccines = 'Api Issuable Vaccines',
	WebIssuableVaccines = 'Web Issuable Vaccines',
	Valuesets = 'Valuesets',
	ExtendedValuesets = 'Extended Valuesets',
	IssuableVaccineDTO = 'Issuable Vaccine DTO',
	IssuableTestDTO = 'Issuable Test DTO',
	CountryCodes = 'Country Codes',
	CountryCodeByLanguage = 'Country Code By Language'
}

@Injectable({
	providedIn: 'root'
})
export class CacheResetService {
	constructor(private readonly http: ApiService, private readonly notificationService: ObNotificationService) {}

	resetCache(selectedCaches: Caches[]) {
		const cacheNames = selectedCaches.map(cache => cache.replace(/ /g,''));
		this.http.post('caches/clear', cacheNames).subscribe(() => {
			this.notificationService.success('cache.reset.success');
		});
	}
}
