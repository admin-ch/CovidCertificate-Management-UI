import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TouristVaccineFormComponent} from './tourist-vaccine-form.component';
import {ObliqueTestingModule, ObNestedFormModule} from '@oblique/oblique';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ValueSetsService} from '../utils/value-sets.service';
import {DateTimePickerComponent} from '../date-time-picker/date-time-picker.component';
import * as moment from 'moment';
import {CreationDataService} from '../utils/creation-data.service';
import {GenerationType} from 'shared/model';

describe('TouristVaccineFormComponent', () => {
	let component: TouristVaccineFormComponent;
	let fixture: ComponentFixture<TouristVaccineFormComponent>;
	let creationDataService: CreationDataService;

	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2000-04-29');
	const dateToOld: Date = new Date('1899-12-31');

	const mockValueSetsService = {
		getCertificateLanguages: jest.fn().mockReturnValue([]),
		getVaccines: jest.fn().mockReturnValue([]),
		getCountryOptions: jest.fn().mockReturnValue([{code: 'CH', display: 'TEST-CH'}])
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TouristVaccineFormComponent, DateTimePickerComponent],
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
		fixture = TestBed.createComponent(TouristVaccineFormComponent);
		creationDataService = TestBed.inject(CreationDataService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get the certificate languages from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getCertificateLanguages();
		expect(mockValueSetsService.getCertificateLanguages).toHaveBeenCalledTimes(1);
	});

	it('should get the countries of vaccination from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getCountriesOfVaccination();
		expect(mockValueSetsService.getCountryOptions).toHaveBeenCalledTimes(1);
	});

	it('should get the medical products from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getVaccines();
		expect(mockValueSetsService.getVaccines).toHaveBeenCalledTimes(1);
	});

	describe('Form validation', () => {
		describe('firstName validation', () => {
			it('should marks the firstName as invalid if empty', () => {
				component.vaccineForm.get('firstName').setValue('');
				expect(component.vaccineForm.get('firstName').invalid).toBeTruthy();
			});

			it('should marks the firstName as invalid if length is over 50', () => {
				component.vaccineForm.get('firstName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.vaccineForm.get('firstName').invalid).toBeTruthy();
			});

			it('should marks the firstName as valid if filled correctly', () => {
				component.vaccineForm.get('firstName').setValue('John');
				expect(component.vaccineForm.get('firstName').invalid).toBeFalsy();
			});
		});

		describe('surName validation', () => {
			it('should marks the surName as invalid if empty', () => {
				component.vaccineForm.get('surName').setValue('');
				expect(component.vaccineForm.get('surName').invalid).toBeTruthy();
			});

			it('should marks the surName as invalid if length is over 50', () => {
				component.vaccineForm.get('surName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.vaccineForm.get('surName').invalid).toBeTruthy();
			});

			it('should marks the surName as valid if filled correctly', () => {
				component.vaccineForm.get('surName').setValue('Doe');
				expect(component.vaccineForm.get('surName').invalid).toBeFalsy();
			});
		});

		describe('birthdate validation', () => {
			it('should marks the birthdate as invalid if empty', () => {
				component.vaccineForm.get('birthdate').setValue({date: ''});
				expect(component.vaccineForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as invalid if in the future', () => {
				component.vaccineForm.get('birthdate').setValue({date: dateFuture});
				expect(component.vaccineForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as invalid if to old', () => {
				component.vaccineForm.get('birthdate').setValue({date: dateToOld});
				expect(component.vaccineForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as valid if set correctly', () => {
				component.vaccineForm.get('birthdate').setValue({date: datePast});
				expect(component.vaccineForm.get('birthdate').invalid).toBeFalsy();
			});

			it('should allow valid short date', () => {
				component.vaccineForm.get('birthdate').setValue({date: '2000-01'});
				expect(component.vaccineForm.get('birthdate').invalid).toBeFalsy();

				component.vaccineForm.get('birthdate').setValue({date: '2000'});
				expect(component.vaccineForm.get('birthdate').invalid).toBeFalsy();
			});
		});

		describe('certificateLanguage validation', () => {
			it('should marks the certificateLanguage as invalid if empty', () => {
				component.vaccineForm.get('certificateLanguage').setValue('');
				expect(component.vaccineForm.get('certificateLanguage').invalid).toBeTruthy();
			});

			it('should marks the certificateLanguage as valid if filled', () => {
				component.vaccineForm.get('certificateLanguage').setValue('DE');
				expect(component.vaccineForm.get('certificateLanguage').invalid).toBeFalsy();
			});
		});

		describe('medicalProduct validation', () => {
			it('should marks the medicalProduct as invalid if empty', () => {
				component.vaccineForm.get('medicalProduct').setValue('');
				expect(component.vaccineForm.get('medicalProduct').invalid).toBeTruthy();
			});

			it('should marks the medicalProduct as valid if filled', () => {
				component.vaccineForm.get('medicalProduct').setValue('testproduct');
				expect(component.vaccineForm.get('medicalProduct').invalid).toBeFalsy();
			});
		});

		describe('doseNumber validation', () => {
			it('should marks the doseNumber as invalid if empty', () => {
				component.vaccineForm.get('doseNumber').setValue('');
				expect(component.vaccineForm.get('doseNumber').invalid).toBeTruthy();
			});

			it('should marks the doseNumber as invalid if below 1', () => {
				component.vaccineForm.get('doseNumber').setValue(0);
				expect(component.vaccineForm.get('doseNumber').invalid).toBeTruthy();
			});

			it('should marks the doseNumber as invalid if above 9', () => {
				component.vaccineForm.get('doseNumber').setValue(10);
				expect(component.vaccineForm.get('doseNumber').invalid).toBeTruthy();
			});

			it('should marks the doseNumber as valid if filled correctly', () => {
				component.vaccineForm.get('doseNumber').setValue(2);
				component.vaccineForm.get('totalDoses').setValue(2);
				expect(component.vaccineForm.get('doseNumber').invalid).toBeFalsy();
			});
		});

		describe('totalDoses validation', () => {
			it('should marks the totalDoses as invalid if empty', () => {
				component.vaccineForm.get('totalDoses').setValue('');
				expect(component.vaccineForm.get('totalDoses').invalid).toBeTruthy();
			});

			it('should marks the totalDoses as invalid if below 1', () => {
				component.vaccineForm.get('totalDoses').setValue(0);
				expect(component.vaccineForm.get('totalDoses').invalid).toBeTruthy();
			});

			it('should marks the totalDoses as invalid if above 9', () => {
				component.vaccineForm.get('totalDoses').setValue(10);
				expect(component.vaccineForm.get('totalDoses').invalid).toBeTruthy();
			});

			it('should marks the totalDoses as valid if filled correctly', () => {
				component.vaccineForm.get('totalDoses').setValue(2);
				expect(component.vaccineForm.get('totalDoses').invalid).toBeFalsy();
			});
		});

		describe('dateOfVaccination validation', () => {
			it('should marks the dateOfVaccination as invalid if empty', () => {
				component.vaccineForm.get('dateOfVaccination').setValue({date: ''});
				expect(component.vaccineForm.get('dateOfVaccination').parent.invalid).toBeTruthy();
			});

			it('should marks the dateOfVaccination as invalid if in the future', () => {
				component.vaccineForm.get('dateOfVaccination').setValue({date: dateFuture});
				expect(component.vaccineForm.get('dateOfVaccination').invalid).toBeTruthy();
			});

			it('should mark the dateOfVaccination as invalid if too old', () => {
				component.vaccineForm.get('dateOfVaccination').setValue({date: dateToOld});
				expect(component.vaccineForm.get('dateOfVaccination').invalid).toBeTruthy();
			});

			it('should marks the dateOfVaccination as valid if set correctly', () => {
				component.vaccineForm.get('dateOfVaccination').setValue({date: datePast});
				expect(component.vaccineForm.get('dateOfVaccination').invalid).toBeFalsy();
			});
		});

		describe('countryOfVaccination validation', () => {
			it('should marks the countryOfVaccination as invalid if empty', () => {
				component.vaccineForm.get('countryOfVaccination').setValue('');
				expect(component.vaccineForm.get('countryOfVaccination').invalid).toBeTruthy();
			});

			it('should marks the countryOfVaccination as valid if filled', () => {
				component.vaccineForm.get('countryOfVaccination').setValue('CH');
				expect(component.vaccineForm.get('countryOfVaccination').invalid).toBeFalsy();
			});
		});

		describe('Cross field validation', () => {
			it('should marks the form as valid if all fields are filled correctly', () => {
				component.vaccineForm.get('firstName').setValue('John');
				component.vaccineForm.get('surName').setValue('Doe');
				component.vaccineForm.get('birthdate').setValue({date: datePast});
				component.vaccineForm.get('certificateLanguage').setValue('DE');
				component.vaccineForm.get('medicalProduct').setValue('testproduct');
				component.vaccineForm.get('doseNumber').setValue(2);
				component.vaccineForm.get('totalDoses').setValue(2);
				component.vaccineForm.get('dateOfVaccination').setValue({date: datePast});
				component.vaccineForm.get('countryOfVaccination').setValue('CH');
				component.vaccineForm.get('checkBox').setValue(true);

				expect(component.vaccineForm.invalid).toBeFalsy();
			});

			it('should marks the form as invalid if doseNumber > totalDoses', () => {
				component.vaccineForm.get('firstName').setValue('John');
				component.vaccineForm.get('surName').setValue('Doe');
				component.vaccineForm.get('birthdate').setValue({date: datePast});
				component.vaccineForm.get('certificateLanguage').setValue('DE');
				component.vaccineForm.get('medicalProduct').setValue('testproduct');
				component.vaccineForm.get('doseNumber').setValue(42);
				component.vaccineForm.get('totalDoses').setValue(2);
				component.vaccineForm.get('dateOfVaccination').setValue({date: datePast});
				component.vaccineForm.get('countryOfVaccination').setValue('CH');

				expect(component.vaccineForm.invalid).toBeTruthy();
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

		it('should emit next if the type is selected', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.vaccineForm.get('firstName').setValue('John');
			component.vaccineForm.get('surName').setValue('Doe');
			component.vaccineForm.get('birthdate').setValue({date: moment(datePast)});
			component.vaccineForm.get('certificateLanguage').setValue('DE');
			component.vaccineForm.get('medicalProduct').setValue('testproduct');
			component.vaccineForm.get('doseNumber').setValue(2);
			component.vaccineForm.get('totalDoses').setValue(2);
			component.vaccineForm.get('dateOfVaccination').setValue({date: moment(datePast)});
			component.vaccineForm.get('countryOfVaccination').setValue('CH');
			component.vaccineForm.get('checkBox').setValue(true);

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the CreationDataService for setting the new patient data', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.vaccineForm.get('firstName').setValue('John');
			component.vaccineForm.get('surName').setValue('Doe');
			component.vaccineForm.get('birthdate').setValue({date: moment(datePast)});
			component.vaccineForm.get('certificateLanguage').setValue({code: 'DE'});
			component.vaccineForm.get('medicalProduct').setValue({code: '42', display: 'test-product'});
			component.vaccineForm.get('doseNumber').setValue(2);
			component.vaccineForm.get('totalDoses').setValue(2);
			component.vaccineForm.get('dateOfVaccination').setValue({date: moment(datePast)});
			component.vaccineForm.get('countryOfVaccination').setValue({code: 'CH', display: 'test-CH'});

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});

		it('should map the new patient data correctly', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.vaccineForm.get('firstName').setValue('John');
			component.vaccineForm.get('surName').setValue('Doe');
			component.vaccineForm.get('birthdate').setValue({date: moment(datePast)});
			component.vaccineForm.get('certificateLanguage').setValue({code: 'DE'});
			component.vaccineForm.get('medicalProduct').setValue({code: '42', display: 'test-product'});
			component.vaccineForm.get('doseNumber').setValue(2);
			component.vaccineForm.get('totalDoses').setValue(2);
			component.vaccineForm.get('dateOfVaccination').setValue({date: moment(datePast)});
			component.vaccineForm.get('countryOfVaccination').setValue({code: 'CH', display: 'test-CH'});

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledWith({
				firstName: 'John',
				surName: 'Doe',
				birthdate: moment(datePast).toDate(),
				language: 'DE',
				vaccination: {
					countryOfVaccination: {code: 'CH', display: 'test-CH'},
					dateOfVaccination: moment(datePast).toDate(),
					doseNumber: 2,
					medicalProduct: {code: '42', display: 'test-product'},
					totalDoses: 2
				},
				certificateType: GenerationType.TOURIST_VACCINATION
			});
		});
	});
	describe('Form reset', () => {
		it('should reset the firstName correctly', () => {
			component.vaccineForm.get('firstName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.firstName).toBeNull();
		});

		it('should reset the surName correctly', () => {
			component.vaccineForm.get('surName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.surName).toBeNull();
		});

		it('should reset the birthdate correctly', () => {
			component.vaccineForm.get('birthdate').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.birthdate).toEqual({date: null, time: null});
		});

		it.skip('should reset the certificateLanguage correctly', () => {
			component.vaccineForm.get('certificateLanguage').setValue({display: 'TEST', code: 'lang'});
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.certificateLanguage).toEqual({display: 'TEST', code: 'lang'});
		});

		it.skip('should reset the medicalProduct correctly', () => {
			component.vaccineForm.get('medicalProduct').setValue({display: 'TEST', code: 'medicalProduct'});
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.medicalProduct).toEqual({display: 'TEST', code: 'medicalProduct'});
		});

		it('should reset the doseNumber correctly', () => {
			component.vaccineForm.get('doseNumber').setValue(42);
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.doseNumber).toBeNull();
		});

		it('should reset the totalDoses correctly', () => {
			component.vaccineForm.get('totalDoses').setValue(42);
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.totalDoses).toBeNull();
		});

		it('should reset the dateOfVaccination correctly', () => {
			component.vaccineForm.get('dateOfVaccination').setValue(null);
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.dateOfVaccination).toBeDefined();
		});

		it.skip('should reset the countryOfVaccination correctly', () => {
			component.vaccineForm.get('countryOfVaccination').setValue(null);
			creationDataService.emitResetCalled();
			expect(component.vaccineForm.value.countryOfVaccination).toEqual({display: 'TEST-CH', code: 'CH'});
		});
	});
});
