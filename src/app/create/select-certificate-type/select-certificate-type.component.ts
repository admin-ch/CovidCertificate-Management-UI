import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GenerationType} from 'shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreationDataService} from '../utils/creation-data.service';
import {CertificateService} from 'shared/certificate.service';
import {AuthFunction} from '../../auth/auth.service';

@Component({
	selector: 'ec-select-certificate-type',
	templateUrl: './select-certificate-type.component.html',
	styleUrls: ['./select-certificate-type.component.scss']
})
export class SelectCertificateTypeComponent implements OnInit {
	@Output() next = new EventEmitter<void>();

	GenerationType = GenerationType;

	certificateTypeSelectionForm: FormGroup;
	typeSelection: string[] = Object.values(GenerationType);

	AuthFunction: typeof AuthFunction = AuthFunction;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly dataService: CreationDataService,
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
			this.certificateService.verifyFeatureAvailability(GenerationType.RECOVERY_RAT) ||
			this.certificateService.verifyFeatureAvailability(GenerationType.VACCINATION_TOURIST)
		);
	}

	private createForm(): void {
		this.certificateTypeSelectionForm = this.formBuilder.group({
			type: [GenerationType.VACCINATION, Validators.required]
		});
	}

	private resetForm(): void {
		const previousSelection: GenerationType = this.certificateTypeSelectionForm.value.type;
		this.certificateTypeSelectionForm.reset({type: previousSelection});
	}
}
