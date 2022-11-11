import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GenerationType} from 'shared/model';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {CreationDataService} from '../utils/creation-data.service';
import {CertificateService} from 'shared/certificate.service';
import {AuthFunction, AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';

const AUTH_FUNCTION_GEN_TYPE_MAP = {
	[AuthFunction.CREATE_VACCINATION_CERTIFICATE]: GenerationType.VACCINATION,
	[AuthFunction.CREATE_TEST_CERTIFICATE]: GenerationType.TEST,
	[AuthFunction.CREATE_RECOVERY_CERTIFICATE]: GenerationType.RECOVERY,
	[AuthFunction.CREATE_RECOVERY_RAT_CERTIFICATE]: GenerationType.RECOVERY_RAT,
	[AuthFunction.CREATE_ANTIBODY_CERTIFICATE]: GenerationType.ANTIBODY,
	[AuthFunction.CREATE_VACCINATION_TOURIST]: GenerationType.VACCINATION_TOURIST,
	[AuthFunction.CREATE_EXCEPTIONAL_CERTIFICATE]: GenerationType.EXCEPTIONAL
};

@Component({
	selector: 'ec-select-certificate-type',
	templateUrl: './select-certificate-type.component.html',
	styleUrls: ['./select-certificate-type.component.scss']
})
export class SelectCertificateTypeComponent implements OnInit {
	@Output() next = new EventEmitter<void>();

	GenerationType = GenerationType;

	certificateTypeSelectionForm: UntypedFormGroup;
	typeSelection: string[] = Object.values(GenerationType);

	AuthFunction: typeof AuthFunction = AuthFunction;

	constructor(
		private readonly formBuilder: UntypedFormBuilder,
		private readonly dataService: CreationDataService,
		private readonly authService: AuthService,
		private readonly certificateService: CertificateService
	) {}

	ngOnInit(): void {
		this.createForm();
		this.dataService.resetCalled.subscribe(() => {
			this.resetForm();
		});
	}

	goNext(): void {
		if (this.certificateTypeSelectionForm.valid) {
			this.dataService.setNewCertificateType(this.certificateTypeSelectionForm.get('type').value);
			this.next.emit();
		}
	}

	verifyFeatureAvailability(generationType: GenerationType) {
		return this.certificateService.verifyFeatureAvailability(generationType);
	}

	isAnyChOnlyCertificateAvailable(): boolean {
		return (
			this.certificateService.verifyFeatureAvailability(GenerationType.ANTIBODY) ||
			this.certificateService.verifyFeatureAvailability(GenerationType.EXCEPTIONAL) ||
			this.certificateService.verifyFeatureAvailability(GenerationType.VACCINATION_TOURIST)
		);
	}

	private createForm(): void {
		this.authService.authorizedFunctions$.pipe(take(1)).subscribe(authFunctions => {
			const authFunction = (Object.keys(AUTH_FUNCTION_GEN_TYPE_MAP) as AuthFunction[]).find(key =>
				authFunctions.includes(key)
			);

			const type = AUTH_FUNCTION_GEN_TYPE_MAP[authFunction];
			this.certificateTypeSelectionForm = this.formBuilder.group({
				type: [type, Validators.required]
			});
		});
	}

	private resetForm(): void {
		const previousSelection: GenerationType = this.certificateTypeSelectionForm.value.type;
		this.certificateTypeSelectionForm.reset({type: previousSelection});
	}
}
