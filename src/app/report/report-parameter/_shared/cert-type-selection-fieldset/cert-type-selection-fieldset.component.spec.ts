import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {CertTypeSelectionFieldsetComponent, CertificateType} from './cert-type-selection-fieldset.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {TranslateModule} from '@ngx-translate/core';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReportService} from '../../../report.service';

describe('CertTypeSelectionFieldsetComponent', () => {
	let component: CertTypeSelectionFieldsetComponent;
	let fixture: ComponentFixture<CertTypeSelectionFieldsetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, TranslateModule, FormsModule, ReactiveFormsModule],
			declarations: [CertTypeSelectionFieldsetComponent],
			providers: [{provide: ReportService, useClass: ReportService}],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CertTypeSelectionFieldsetComponent);
		component = fixture.componentInstance;
		const parentFormGroup = new FormGroup({
			types: new FormArray([])
		});
		component.certTypesFormArray = parentFormGroup.get('types') as FormArray;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('certTypeCheckboxChanged', () => {
		beforeEach(() => {
			component.certTypesFormArray.clear();
		});

		it('should should add passed certificate to the formGroup if checked is true', () => {
			component.certTypesFormArray.insert(0, new FormControl(CertificateType.A));
			component.certTypesFormArray.insert(1, new FormControl(CertificateType.RR));
			component.certTypeCheckboxChanged(true, CertificateType.ME);

			expect(component.certTypesFormArray.value).toEqual([CertificateType.A, CertificateType.RR, CertificateType.ME]);
		});
		it('should should remove passed certificate from the formGroup if checked is false', () => {
			component.certTypesFormArray.insert(0, new FormControl(CertificateType.A));
			component.certTypesFormArray.insert(1, new FormControl(CertificateType.RR));
			component.certTypeCheckboxChanged(false, CertificateType.RR);

			expect(component.certTypesFormArray.value).toEqual([CertificateType.A]);
		});
	});

	describe('checkAllCertTypes', () => {
		beforeEach(() => {
			component.certTypesFormArray.clear();
		});

		it('should should add all certificate types to the formGroup if checked is true', () => {
			component.checkAllCertTypes(true);

			expect(component.certTypesFormArray.value).toEqual(Object.values(CertificateType));
		});
		it('should should remove all certificate types from the formGroup if checked is false', () => {
			Object.values(CertificateType).forEach((type, index) => {
				component.certTypesFormArray.insert(index, new FormControl(type));
			});
			component.checkAllCertTypes(false);
			expect(component.certTypesFormArray.value).toEqual([]);
		});
	});

	describe('isSelectAllChecked', () => {
		it('should be true if all types have been selected', fakeAsync(() => {
			component.isSelectAllChecked = false;
			Object.values(CertificateType).forEach((type, index) => {
				component.certTypesFormArray.insert(index, new FormControl(type));
			});
			tick();

			expect(component.isSelectAllChecked).toBe(true);
		}));
		it('should be false if not all types have been selected', fakeAsync(() => {
			component.isSelectAllChecked = true;
			Object.values(CertificateType)
				.filter((_, i) => i !== 0)
				.forEach((type, index) => {
					component.certTypesFormArray.insert(index, new FormControl(type));
				});
			tick();

			expect(component.isSelectAllChecked).toBe(false);
		}));
		it('should should remove all certificate types from the formGroup if checked is false', () => {
			Object.values(CertificateType).forEach((type, index) => {
				component.certTypesFormArray.insert(index, new FormControl(type));
			});
			component.checkAllCertTypes(false);

			expect(component.certTypesFormArray.value).toEqual([]);
		});
	});

	describe('isSelectAllIndeterminate', () => {
		it('should be true if at least one type has been selected', fakeAsync(() => {
			component.isSelectAllIndeterminate = false;
			component.certTypesFormArray.insert(0, new FormControl(CertificateType.A));
			tick();

			expect(component.isSelectAllIndeterminate).toBe(true);
		}));
		it('should be false if no type has been selected', fakeAsync(() => {
			component.isSelectAllIndeterminate = true;
			component.certTypesFormArray.setValue([]);
			tick();

			expect(component.isSelectAllIndeterminate).toBe(false);
		}));
	});
});
