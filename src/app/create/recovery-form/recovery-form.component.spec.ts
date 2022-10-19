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
import {PersonalDataComponent} from "../components/personal-data/personal-data.component";

describe('RecoveryFormComponent', () => {
	let component: RecoveryFormComponent;
	let fixture: ComponentFixture<RecoveryFormComponent>;
	let creationDataService: CreationDataService;

	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2000-04-29');
	const dateToOld: Date = new Date('1899-12-31');
	const timeNoon = '12:00';

	const mockValueSetsService = {
		getCertificateLanguages: jest.fn().mockReturnValue([]),
		getCountryOptions: jest.fn().mockReturnValue([{code: 'CH', display: 'TEST-CH'}, {code: 'DE', display: 'TEST-DE'}])
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RecoveryFormComponent, DateTimePickerComponent, PersonalDataComponent],
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

			it('should mark the dateFirstPositiveTestResult as invalid if set before birthdate', () => {
				const dateAhead = moment(datePast).clone().add({days: 1})
				component.recoveryForm.get(PersonalDataComponent.FORM_GROUP_NAME + '.birthdate').setValue({date: dateAhead.toDate(), time: timeNoon});
				component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: datePast, time: timeNoon});
				expect(component.recoveryForm.get('dateFirstPositiveTestResult').invalid).toBeTruthy();
			});

			it('should mark the dateFirstPositiveTestResult as valid if set after/equal birthdate', () => {
				component.recoveryForm.get(PersonalDataComponent.FORM_GROUP_NAME + '.birthdate').setValue(datePast);
				component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: datePast, time: timeNoon});
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

			component.recoveryForm.get('personalData.firstName').setValue('John');
			component.recoveryForm.get('personalData.surName').setValue('Doe');
			component.recoveryForm.get('personalData.birthdate').setValue({date: datePast});
			component.recoveryForm.get('personalData.certificateLanguage').setValue('DE');

			component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: moment(datePast)});
			component.recoveryForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the CreationDataService for setting the new patient data', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.recoveryForm.get('personalData.firstName').setValue('John');
			component.recoveryForm.get('personalData.surName').setValue('Doe');
			component.recoveryForm.get('personalData.birthdate').setValue({date: datePast});
			component.recoveryForm.get('personalData.certificateLanguage').setValue('DE');

			component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: moment(datePast)});
			component.recoveryForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});

		it('should map the new patient data correctly', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.recoveryForm.get('personalData.firstName').setValue('John');
			component.recoveryForm.get('personalData.surName').setValue('Doe');
			component.recoveryForm.get('personalData.birthdate').setValue({date: datePast});
			component.recoveryForm.get('personalData.certificateLanguage').setValue('DE');

			component.recoveryForm.get('dateFirstPositiveTestResult').setValue({date: moment(datePast)});
			component.recoveryForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Form reset', () => {
		it('should reset the firstName correctly', () => {
			component.recoveryForm.get(PersonalDataComponent.FORM_GROUP_NAME + '.firstName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.recoveryForm.value[PersonalDataComponent.FORM_GROUP_NAME].firstName).toBeNull();
		});

		it('should reset the surName correctly', () => {
			component.recoveryForm.get(PersonalDataComponent.FORM_GROUP_NAME + '.surName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.recoveryForm.value[PersonalDataComponent.FORM_GROUP_NAME].surName).toBeNull();
		});

		it('should reset the birthdate correctly', () => {
			component.recoveryForm.get(PersonalDataComponent.FORM_GROUP_NAME + '.birthdate').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.recoveryForm.value[PersonalDataComponent.FORM_GROUP_NAME].birthdate).toEqual({date: null, time: null});
		});

		it('should reset the certificateLanguage correctly', () => {
			component.recoveryForm.get(PersonalDataComponent.FORM_GROUP_NAME + '.certificateLanguage').setValue({display: 'TEST', code: 'lang'});
			creationDataService.emitResetCalled();
			expect(component.recoveryForm.value[PersonalDataComponent.FORM_GROUP_NAME].certificateLanguage).toEqual({display: 'TEST', code: 'lang'});
		});

		it('should reset the dateFirstPositiveTestResult correctly', () => {
			component.recoveryForm.get('dateFirstPositiveTestResult').setValue(datePast);
			creationDataService.emitResetCalled();
			expect(component.recoveryForm.value.dateFirstPositiveTestResult).toEqual({date: null, time: null});
		});

		it('should reset the countryOfTest correctly', () => {
			component.recoveryForm.get('countryOfTest').setValue('DE');
			creationDataService.emitResetCalled();
			expect(component.recoveryForm.value.countryOfTest).toEqual({code: 'CH', display: 'TEST-CH'});
		});
	});
});
