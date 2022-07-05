import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CertificateType} from "../../report-a7/report-a7.component";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'ec-cert-type-selection-fieldset',
  templateUrl: './cert-type-selection-fieldset.component.html',
  styleUrls: ['./cert-type-selection-fieldset.component.scss']
})
export class CertTypeSelectionFieldsetComponent implements OnInit, OnDestroy {

	@Input()
	certTypesFormArray: FormArray

	formGroup: FormGroup
	certTypesFormArrayName: string

	readonly CERTIFICATE_TYPES: CertificateType[] = Object.values(CertificateType)

	isSelectAllChecked = false
	isSelectAllIndeterminate = false

	subscription: Subscription

	ngOnInit(): void {
        this.subscription = this.certTypesFormArray.valueChanges.subscribe(_ => this.setSelectAllCheckboxState());
		Object.entries((this.certTypesFormArray.parent as FormGroup).controls).some(([controlName, control]) => {
			if (control === this.certTypesFormArray) {
				this.certTypesFormArrayName = controlName
				return true
			}
			return false
		})
		if (!this.certTypesFormArrayName) {
			throw new Error('FormArrayName could not have been identified.')
		}

		if (this.certTypesFormArray.parent instanceof FormGroup) {
			this.formGroup = this.certTypesFormArray.parent;
		} else {
			throw new Error('Parent of certTypesFormArray is not a FormGroup.')
		}
    }

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}

	certTypeCheckboxChanged(checked: boolean, certType: CertificateType) {
		if (checked) {
			this.certTypesFormArray.push(new FormControl(certType));
		} else {
			this.certTypesFormArray.controls.forEach((ctrl: FormControl, i) => {
				if (ctrl.value === certType) {
					this.certTypesFormArray.removeAt(i);
				}
			});
		}
		this.certTypesFormArray.markAsTouched()
		this.setSelectAllCheckboxState()
	}

	checkAllCertTypes(checked: boolean) {
		this.certTypesFormArray.clear()
		if (checked) {
			this.CERTIFICATE_TYPES.forEach((certType, i) => {
				this.certTypesFormArray.insert(i, new FormControl(certType))
			})
		}
		this.certTypesFormArray.markAsTouched()
		this.setSelectAllCheckboxState()
	}

	private setSelectAllCheckboxState() {
		this.isSelectAllChecked = this.certTypesFormArray.value.length === this.CERTIFICATE_TYPES.length
		this.isSelectAllIndeterminate = this.certTypesFormArray.value.length > 0 && this.certTypesFormArray.value.length < this.CERTIFICATE_TYPES.length

	}
}
