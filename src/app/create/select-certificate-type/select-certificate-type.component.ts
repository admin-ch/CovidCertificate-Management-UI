import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GenerationType} from 'shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreationDataService} from '../utils/creation-data.service';

@Component({
	selector: 'ec-select-certificate-type',
	templateUrl: './select-certificate-type.component.html',
	styleUrls: ['./select-certificate-type.component.scss']
})
export class SelectCertificateTypeComponent implements OnInit {
	@Output() next = new EventEmitter<void>();

	certificateTypeSelectionForm: FormGroup;
	typeSelection: string[] = Object.values(GenerationType);

	constructor(private readonly formBuilder: FormBuilder, private readonly dataService: CreationDataService) {}

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

	private createForm(): void {
		this.certificateTypeSelectionForm = this.formBuilder.group({
			type: [GenerationType.VACCINATION, Validators.required]
		});
	}

	private resetForm(): void {
		this.certificateTypeSelectionForm.reset({type: GenerationType.VACCINATION});
	}
}
