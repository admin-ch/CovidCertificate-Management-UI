import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ReportService} from '../../report.service';
import {DataRoomCode, ReportType} from 'shared/model';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../auth/auth.service";
import {take, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";

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

	authorizedDataRooms$: Observable<DataRoomCode[]>

	subscription: Subscription

	constructor(public readonly reportService: ReportService,
				private readonly auth: AuthService,
				public readonly translate: TranslateService) {
	}

	ngOnInit(): void {
		this.a7FormGroup = this.reportService.formGroup.get(ReportType.A7) as FormGroup
		this.a7FormGroup.enable()
		this.subscription = this.reportService.reset$.subscribe(() => this.resetInput())
		this.setSelectAllCheckboxState()
		this.authorizedDataRooms$ = this.auth.authorizedDataRooms$.pipe(
			tap(dataRooms => {
				// Pre-select the canton if there is only one available.
				if (dataRooms?.length === 1) {
					this.a7FormGroup.get('canton').setValue(dataRooms[0])
				}
			})
		)
	}

	ngOnDestroy() {
		this.a7FormGroup.disable()
		this.subscription?.unsubscribe()
	}

	certTypeCheckboxChanged(checked: boolean, certType: CertificateType) {
		const typesFormArray: FormArray = this.a7FormGroup.get('types') as FormArray;

		if (checked) {
			typesFormArray.push(new FormControl(certType));
		} else {
			typesFormArray.controls.forEach((ctrl: FormControl, i) => {
				if (ctrl.value === certType) {
					typesFormArray.removeAt(i);
				}
			});
		}
		this.a7FormGroup.get('types').markAsTouched()
		this.setSelectAllCheckboxState()
	}

	checkAllCertTypes(checked: boolean) {
		const certTypeFormArray: FormArray = this.a7FormGroup.get('types') as FormArray
		certTypeFormArray.clear()
		if (checked) {
			this.CERTIFICATE_TYPES.forEach((certType, i) => {
				certTypeFormArray.insert(i, new FormControl(certType))
			})
		}
		certTypeFormArray.markAsTouched()
		this.setSelectAllCheckboxState()
	}

	resetInput(): void {
		this.a7FormGroup.reset({
			from: '',
			to: '',
			canton: '',
			types: new FormArray([])
		});

		// The `tap()` function defined in the constructor takes care of populating the the `canton` formControl.
		this.authorizedDataRooms$.pipe(take(1)).subscribe()
		this.checkAllCertTypes(false)
		this.setSelectAllCheckboxState()
		this.a7FormGroup.markAsUntouched()
	}

	private setSelectAllCheckboxState() {
		const typesFormArray = this.a7FormGroup.get('types') as FormArray;
		this.isSelectAllChecked = typesFormArray.value.length === this.CERTIFICATE_TYPES.length
		this.isSelectAllIndeterminate = typesFormArray.value.length > 0 && typesFormArray.value.length < this.CERTIFICATE_TYPES.length

	}
}
