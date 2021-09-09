import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RecoveryFormComponent} from './recovery-form.component';
import {DateTimePickerComponent} from '../date-time-picker/date-time-picker.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ObliqueTestingModule, ObNestedFormModule} from '@oblique/oblique';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ValueSetsService} from '../utils/value-sets.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CreationDataService} from '../utils/creation-data.service';
import * as moment from 'moment';

describe('RecoveryFormComponent', () => {
	let component: RecoveryFormComponent;
	let fixture: ComponentFixture<RecoveryFormComponent>;
	let creationDataService: CreationDataService;

	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2000-04-29');
	const dateToOld: Date = new Date('1899-12-31');

	const mockValueSetsService = {
		getCertificateLanguages: jest.fn().mockReturnValue([]),
		getCountryOptions: jest.fn().mockReturnValue([])
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RecoveryFormComponent, DateTimePickerComponent],
			imports: [
				NoopAnimationsModule,
				ObliqueTestingModule,
				ObNestedFormModule,
				ReactiveFormsModule,
				MatSelectModule,
				MatFormFieldModule,
				MatInputModule
			],
			providers: [
				{
					provide: ValueSetsService,
					useValue: mockValueSetsService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecoveryFormComponent);
		creationDataService = TestBed.inject(CreationDataService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get the certificate languages from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getCertificateLanguages();
		expect(mockValueSetsService.getCertificateLanguages).toHaveBeenCalledTimes(1);
	});

	it('should get the countries of recovery from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getCountriesOfRecovery();
		expect(mockValueSetsService.getCountryOptions).toHaveBeenCalledTimes(1);
	});

	describe('Form validation', () => {
		describe('firstName validation', () => {
			it('should marks the firstName as invalid if empty', () => {
				component.recoveryForm.get('firstName').setValue('');
				expect(component.recoveryForm.get('firstName').invalid).toBeTruthy();
			});

			it('should marks the firstName as invalid if length is over 50', () => {
				component.recoveryForm.get('firstName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.recoveryForm.get('firstName').invalid).toBeTruthy();
			});

			it('should marks the firstName as valid if filled correctly', () => {
				component.recoveryForm.get('firstName').setValue('John');
				expect(component.recoveryForm.get('firstName').invalid).toBeFalsy();
			});
		});

		describe('surName validation', () => {
			it('should marks the surName as invalid if empty', () => {
				component.recoveryForm.get('surName').setValue('');
				expect(component.recoveryForm.get('surName').invalid).toBeTruthy();
			});

			it('should marks the surName as invalid if length is over 50', () => {
				component.recoveryForm.get('surName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.recoveryForm.get('surName').invalid).toBeTruthy();
			});

			it('should marks the surName as valid if filled correctly', () => {
				component.recoveryForm.get('surName').setValue('Doe');
				expect(component.recoveryForm.get('surName').invalid).toBeFalsy();
			});
		});

		describe('birthdate validation', () => {
			it('should marks the birthdate as invalid if empty', () => {
				component.recoveryForm.get('birthdate').setValue({date: ''});
				expect(component.recoveryForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as invalid if in the future', () => {
				component.recoveryForm.get('birthdate').setValue({date: dateFuture});
				expect(component.recoveryForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as invalid if to old', () => {
				component.recoveryForm.get('birthdate').setValue({date: dateToOld});
				expect(component.recoveryForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as valid if set correctly', () => {
				component.recoveryForm.get('birthdate').setValue({date: datePast});
				expect(component.recoveryForm.get('birthdate').invalid).toBeFalsy();
			});

			it('should allow valid short date', () => {
				component.recoveryForm.get('birthdate').setValue({date: '2000-01'});
				expect(component.recoveryForm.get('birthdate').invalid).toBeFalsy();

				component.recoveryForm.get('birthdate').setValue({date: '2000'});
				expect(component.recoveryForm.get('birthdate').invalid).toBeFalsy();
			});
		});

		describe('certificateLanguage validation', () => {
			it('should marks the certificateLanguage as invalid if empty', () => {
				component.recoveryForm.get('certificateLanguage').setValue('');
				expect(component.recoveryForm.get('certificateLanguage').invalid).toBeTruthy();
			});

			it('should marks the certificateLanguage as valid if filled', () => {
				component.recoveryForm.get('certificateLanguage').setValue('DE');
				expect(component.recoveryForm.get('certificateLanguage').invalid).toBeFalsy();
			});
		});

		describe('dateFirstPositiveTestResult validation', () => {
			it('should marks the dateFirstPositiveTestResult as invalid if empty', () => {
				// default value is empty
				expect(component.recoveryForm.get('dateFirstPositiveTestResult').invalid).toBeTruthy();
			});

			it('should marks the dateFirstPositiveTestResult as invalid if in the future', () => {
				component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: dateFuture});
				expect(component.recoveryForm.get('dateFirstPositiveTestResult').invalid).toBeTruthy();
			});

			it('should mark the dateFirstPositiveTestResult as invalid if too old', () => {
				component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: dateToOld});
				expect(component.recoveryForm.get('dateFirstPositiveTestResult').invalid).toBeTruthy();
			});

			it('should marks the dateFirstPositiveTestResult as valid if set correctly', () => {
				component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: datePast});
				expect(component.recoveryForm.get('dateFirstPositiveTestResult').invalid).toBeFalsy();
			});
		});

		describe('countryOfTest validation', () => {
			it('should marks the countryOfTest as invalid if empty', () => {
				component.recoveryForm.get('countryOfTest').setValue('');
				expect(component.recoveryForm.get('countryOfTest').invalid).toBeTruthy();
			});

			it('should marks the countryOfTest as valid if filled', () => {
				component.recoveryForm.get('countryOfTest').setValue('CH');
				expect(component.recoveryForm.get('countryOfTest').invalid).toBeFalsy();
			});
		});
	});

	describe('Handling of goBack()', () => {
		it('should emit back', () => {
			const backSpy = jest.spyOn(component.back, 'emit');

			component.goBack();

			expect(backSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Handling of goNext()', () => {
		it('should not emit next if the form is invalid', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(0);
		});

		it('should emit next if the form is valid', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.recoveryForm.get('firstName').setValue('John');
			component.recoveryForm.get('surName').setValue('Doe');
			component.recoveryForm.get('birthdate').setValue({date: moment(datePast)});
			component.recoveryForm.get('certificateLanguage').setValue('DE');
			component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: moment(datePast)});
			component.recoveryForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the CreationDataService for setting the new patient data', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.recoveryForm.get('firstName').setValue('John');
			component.recoveryForm.get('surName').setValue('Doe');
			component.recoveryForm.get('birthdate').setValue({date: moment(datePast)});
			component.recoveryForm.get('certificateLanguage').setValue('DE');
			component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: moment(datePast)});
			component.recoveryForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});

		it('should map the new patient data correctly', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.recoveryForm.get('firstName').setValue('John');
			component.recoveryForm.get('surName').setValue('Doe');
			component.recoveryForm.get('birthdate').setValue({date: moment(datePast)});
			component.recoveryForm.get('certificateLanguage').setValue({code: 'DE'});
			component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: moment(datePast)});
			component.recoveryForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledWith({
				firstName: 'John',
				surName: 'Doe',
				birthdate: datePast,
				language: 'DE',
				recovery: {
					dateFirstPositiveTestResult: datePast,
					countryOfTest: 'CH'
				}
			});
		});
	});
});
