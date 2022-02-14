import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from 'shared/api.service';
import {FeatureToggle, GenerationType} from './model';
import {CertificateCreateDtoMappingService} from '../create/utils/certificate-create-dto-mapping.service';

@Injectable({
	providedIn: 'root'
})
export class FeatureToggleService {
	private readonly featureToggle = 'feature-toggle/features';
	private featureToggleGroup: FeatureToggle[] = [];

	constructor(
		private readonly http: ApiService,
		private readonly dtoMappingService: CertificateCreateDtoMappingService
	) {}

	getFeatureToggle(): Observable<FeatureToggle[]> {
		console.log('theGet' + this.http.get<FeatureToggle[]>(this.featureToggle));
		return this.http.get<FeatureToggle[]>(this.featureToggle, {withCredentials: true});
	}

	setFeatureToggleGroup(featureToggleGroup: FeatureToggle[]) {
		this.featureToggleGroup = featureToggleGroup;
	}

	isActive(generationType: GenerationType): boolean {
		switch (generationType) {
			case GenerationType.VACCINATION:
				return true;
			case GenerationType.TOURIST_VACCINATION:
				return true;
			case GenerationType.TEST:
				return true;
			case GenerationType.RECOVERY:
				return true;
			case GenerationType.RAPID:
				return true;
			case GenerationType.ANTIBODY:
				return true;
			case GenerationType.EXCEPTIONAL:
				return false;
			default:
				return true;
		}
	}
}
