import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ReportService} from '../../report.service';
import {ReportType} from 'shared/model';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../auth/auth.service";

export enum CertificateType {
	// EU compatible certs
	T = "T",       // Tested
	V = "V",       // Vaccinated
	R = "R",       // Recovered
	RREU = "RREU", // Recovered (Rapid Antigen Test EU)

	// CH certs
	ME = "ME",     // Medical Exception
	A = "A",       // Antibody
	RR = "RR",     // Recovered (Rapid Antigen Test)
	VT = "VT",     // Vaccinated Tourists
}

@Component({
	selector: 'ec-report-a7',
	templateUrl: './report-a7.component.html',
	styleUrls: ['./report-a7.component.scss']
})
export class ReportA7Component implements OnInit, OnDestroy {
	readonly ReportType = ReportType;

	readonly CERTIFICATE_TYPES: CertificateType[] = Object.values(CertificateType)
	a7FormGroup: FormGroup;
	isSelectAllChecked = false
	isSelectAllIndeterminate = false

	constructor(public readonly reportService: ReportService,
				public readonly auth: AuthService,
				public readonly translate: TranslateService) {
	}

	ngOnInit(): void {
		this.a7FormGroup = this.reportService.formGroup.get(ReportType.A7) as FormGroup
		this.a7FormGroup.enable()
	}

	ngOnDestroy() {
		this.a7FormGroup.disable()
	}

	certTypeCheckboxChanged(checked: boolean, certType: CertificateType) {
		if (checked) {
			this.a7FormGroup.get('types').setValue([...this.a7FormGroup.get('types').value, certType])
		} else {
			const toRemoveIndex = this.a7FormGroup.get('types').value.indexOf(certType);
			if (toRemoveIndex >= 0) {
				const newCertTypes = [...this.a7FormGroup.get('types').value]
				newCertTypes.splice(toRemoveIndex, 1)
				this.a7FormGroup.get('types').setValue(newCertTypes);
			}
		}
		this.setSelectAllCheckboxState()
	}

	checkAllCertTypes(checked: boolean) {
		const value = checked ? this.CERTIFICATE_TYPES : []
		this.a7FormGroup.get('types').setValue(value)
		this.setSelectAllCheckboxState()
	}

	resetInput(): void {
		this.a7FormGroup.reset({
			from: '',
			to: '',
			dataRoom: '',
			types: []
		});
		this.setSelectAllCheckboxState()
		this.a7FormGroup.markAsUntouched()
	}

	private setSelectAllCheckboxState() {
		this.isSelectAllChecked = this.a7FormGroup.get('types').value.length === this.CERTIFICATE_TYPES.length
		this.isSelectAllIndeterminate = this.a7FormGroup.get('types').value.length > 0 && this.a7FormGroup.get('types').value.length < this.CERTIFICATE_TYPES.length

	}
}
