import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestFormComponent} from './test-form.component';
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

describe('TestFormComponent', () => {
	let component: TestFormComponent;
	let fixture: ComponentFixture<TestFormComponent>;
	let creationDataService: CreationDataService;

	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2000-04-29');
	const dateToOld: Date = new Date('1899-12-31');
	const timeNoon = '12:00';

	const mockValueSetsService = {
		getCertificateLanguages: jest.fn().mockReturnValue([]),
		getCountryOptions: jest.fn().mockReturnValue([{code: 'CH', display: 'TEST-CH'}]),
		getTypeOfTests: jest.fn().mockReturnValue([]),
		getManufacturerOfTest: jest.fn().mockReturnValue([])
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestFormComponent, DateTimePickerComponent],
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
		fixture = TestBed.createComponent(TestFormComponent);
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

	it('should get the countries of test from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getCountriesOfTest();
		expect(mockValueSetsService.getCountryOptions).toHaveBeenCalledTimes(1);
	});

	it('should get the types of test from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getTypesOfTest();
		expect(mockValueSetsService.getTypeOfTests).toHaveBeenCalledTimes(1);
	});

	it('should get the manufacturers of test from the ValueSetsService', () => {
		jest.clearAllMocks();
		component.getManufacturerOfTest();
		expect(mockValueSetsService.getManufacturerOfTest).toHaveBeenCalledTimes(1);
	});

	describe('Form validation', () => {
		describe('firstName validation', () => {
			it('should marks the firstName as invalid if empty', () => {
				component.testForm.get('firstName').setValue('');
				expect(component.testForm.get('firstName').invalid).toBeTruthy();
			});

			it('should marks the firstName as invalid if length is over 50', () => {
				component.testForm.get('firstName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.testForm.get('firstName').invalid).toBeTruthy();
			});

			it('should marks the firstName as valid if filled correctly', () => {
				component.testForm.get('firstName').setValue('John');
				expect(component.testForm.get('firstName').invalid).toBeFalsy();
			});
		});

		describe('surName validation', () => {
			it('should marks the surName as invalid if empty', () => {
				component.testForm.get('surName').setValue('');
				expect(component.testForm.get('surName').invalid).toBeTruthy();
			});

			it('should marks the surName as invalid if length is over 50', () => {
				component.testForm.get('surName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.testForm.get('surName').invalid).toBeTruthy();
			});

			it('should marks the surName as valid if filled correctly', () => {
				component.testForm.get('surName').setValue('Doe');
				expect(component.testForm.get('surName').invalid).toBeFalsy();
			});
		});

		describe('birthdate validation', () => {
			it('should marks the birthdate as invalid if empty', () => {
				component.testForm.get('birthdate').setValue({date: ''});
				expect(component.testForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as invalid if in the future', () => {
				component.testForm.get('birthdate').setValue({date: dateFuture});
				expect(component.testForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as invalid if to old', () => {
				component.testForm.get('birthdate').setValue({date: dateToOld});
				expect(component.testForm.get('birthdate').invalid).toBeTruthy();
			});

			it('should marks the birthdate as valid if set correctly', () => {
				component.testForm.get('birthdate').setValue({date: datePast});
				expect(component.testForm.get('birthdate').invalid).toBeFalsy();
			});
		});

		describe('certificateLanguage validation', () => {
			it('should marks the certificateLanguage as invalid if empty', () => {
				component.testForm.get('certificateLanguage').setValue('');
				expect(component.testForm.get('certificateLanguage').invalid).toBeTruthy();
			});

			it('should marks the certificateLanguage as valid if filled', () => {
				component.testForm.get('certificateLanguage').setValue('DE');
				expect(component.testForm.get('certificateLanguage').invalid).toBeFalsy();
			});
		});

		describe('typeOfTest validation', () => {
			it('should marks the typeOfTest as invalid if empty', () => {
				component.testForm.get('typeOfTest').setValue('');
				expect(component.testForm.get('typeOfTest').invalid).toBeTruthy();
			});

			it('should marks the typeOfTest as valid if filled', () => {
				component.testForm.get('typeOfTest').setValue({
					code: 'LP6464-4',
					display: 'Nucleic acid amplification with probe detection'
				});
				expect(component.testForm.get('typeOfTest').invalid).toBeFalsy();
			});
		});

		describe('manufacturer validation', () => {
			it('should marks the manufacturer as invalid if empty', () => {
				component.testForm.get('manufacturer').setValue('');
				expect(component.testForm.get('manufacturer').invalid).toBeTruthy();
			});

			it('should marks the manufacturer as valid if filled', () => {
				component.testForm.get('manufacturer').setValue({
					code: '1304',
					display: 'AMEDA Labordiagnostik GmbH'
				});
				expect(component.testForm.get('manufacturer').invalid).toBeFalsy();
			});

			it('should marks the manufacturer as disabled if the type of test is PCR', () => {
				component.testForm.get('typeOfTest').setValue({
					code: 'LP6464-4',
					display: 'Nucleic acid amplification with probe detection'
				});
				expect(component.testForm.get('manufacturer').enabled).toBeFalsy();
			});

			it('should set the manufacturer as empty string if the type of test is PCR', () => {
				component.testForm.get('typeOfTest').setValue({
					code: 'LP6464-4',
					display: 'Nucleic acid amplification with probe detection'
				});
				expect(component.testForm.get('manufacturer').value).toBe('');
			});
		});

		describe('sampleDate validation', () => {
			it('should marks the sampleDate as invalid if empty', () => {
				component.testForm.get('sampleDate').setValue({date: '', time: ''});
				expect(component.testForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should marks the sampleDate as invalid if in the future', () => {
				component.testForm.get('sampleDate').setValue({date: dateFuture, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate as invalid if too old', () => {
				component.testForm.get('sampleDate').setValue({date: dateToOld, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeTruthy();
			});

			it('should mark the sampleDate one hour in the future as valid', () => {
				const testDate: Date = new Date();
				testDate.setTime(testDate.getTime() + 60 * 60 * 1000);
				const time = `${testDate.getHours()}:${testDate.getMinutes()}`;
				component.testForm.get('sampleDate').setValue({date: testDate.toDateString(), time});
				expect(component.testForm.get('sampleDate').invalid).toBeFalsy();
			});

			it('should mark the sampleDate today as valid', () => {
				const testDate: Date = new Date();
				const time = `${testDate.getHours()}:${testDate.getMinutes()}`;
				component.testForm.get('sampleDate').setValue({date: testDate.toDateString(), time});
				expect(component.testForm.get('sampleDate').invalid).toBeFalsy();
			});

			it('should marks the sampleDate as valid if set correctly', () => {
				component.testForm.get('sampleDate').setValue({date: datePast, time: timeNoon});
				expect(component.testForm.get('sampleDate').invalid).toBeFalsy();
			});
		});

		describe('center validation', () => {
			it('should marks the center as invalid if empty', () => {
				component.testForm.get('center').setValue('');
				expect(component.testForm.get('center').invalid).toBeTruthy();
			});

			it('should marks the center as invalid if length is over 50', () => {
				component.testForm.get('center').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.testForm.get('center').invalid).toBeTruthy();
			});

			it('should marks the center as valid if filled correctly', () => {
				component.testForm.get('center').setValue('John');
				expect(component.testForm.get('center').invalid).toBeFalsy();
			});
		});

		describe('countryOfTest validation', () => {
			it('should marks the countryOfTest as invalid if empty', () => {
				component.testForm.get('countryOfTest').setValue('');
				expect(component.testForm.get('countryOfTest').invalid).toBeTruthy();
			});

			it('should marks the countryOfTest as valid if filled', () => {
				component.testForm.get('countryOfTest').setValue('CH');
				expect(component.testForm.get('countryOfTest').invalid).toBeFalsy();
			});
		});
	});

	describe('Handling of goBack()', () => {
		it('should emit back', () => {
			const nextMock = jest.spyOn(component.back, 'emit');

			component.goBack();

			expect(nextMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('Handling of goNext()', () => {
		it('should not emit next if the form is invalid', () => {
			const nextMock = jest.spyOn(component.next, 'emit');

			component.goNext();

			expect(nextMock).toHaveBeenCalledTimes(0);
		});

		it('should emit next if the type is selected', () => {
			const nextMock = jest.spyOn(component.next, 'emit');

			component.testForm.get('firstName').setValue('John');
			component.testForm.get('surName').setValue('Doe');
			component.testForm.get('birthdate').setValue({date: moment(datePast)});
			component.testForm.get('certificateLanguage').setValue('DE');
			component.testForm.get('typeOfTest').setValue({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection'
			});
			component.testForm.get('manufacturer').setValue('');
			component.testForm.get('sampleDate').setValue({date: moment(datePast), time: timeNoon});
			component.testForm.get('center').setValue('Testcenter');
			component.testForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(nextMock).toHaveBeenCalledTimes(1);
		});

		it('should call the CreationDataService for setting the new patient data', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.testForm.get('firstName').setValue('John');
			component.testForm.get('surName').setValue('Doe');
			component.testForm.get('birthdate').setValue({date: moment(datePast)});
			component.testForm.get('certificateLanguage').setValue('DE');
			component.testForm.get('typeOfTest').setValue({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection'
			});
			component.testForm.get('manufacturer').setValue('');
			component.testForm.get('sampleDate').setValue({date: moment(datePast), time: timeNoon});
			component.testForm.get('center').setValue('Testcenter');
			component.testForm.get('countryOfTest').setValue('CH');

			component.goNext();

			expect(setNewPatientSpy).toHaveBeenCalledTimes(1);
		});

		it('should map the new patient data correctly', () => {
			const setNewPatientSpy = jest.spyOn(creationDataService, 'setNewPatient');

			component.testForm.get('firstName').setValue('John');
			component.testForm.get('surName').setValue('Doe');
			component.testForm.get('birthdate').setValue({date: moment(datePast)});
			component.testForm.get('certificateLanguage').setValue({code: 'DE'});
			component.testForm.get('typeOfTest').setValue({
				code: 'LP6464-4',
				display: 'Nucleic acid amplification with probe detection'
			});
			component.testForm.get('manufacturer').setValue('');
			component.testForm.get('sampleDate').setValue({date: moment(datePast), time: timeNoon});
			component.testForm.get('center').setValue('Testcenter');
			component.testForm.get('countryOfTest').setValue({code: 'CH', display: 'test-CH'});

			component.goNext();

			const sampleDate: Date = moment(datePast).toDate();
			sampleDate.setHours(12);

			expect(setNewPatientSpy).toHaveBeenCalledWith({
				firstName: 'John',
				surName: 'Doe',
				birthdate: datePast,
				language: 'DE',
				test: {
					center: 'Testcenter',
					countryOfTest: {code: 'CH', display: 'test-CH'},
					manufacturer: undefined,
					sampleDate,
					typeOfTest: {
						code: 'LP6464-4',
						display: 'Nucleic acid amplification with probe detection'
					}
				}
			});
		});
	});

	describe('Form reset', () => {
		it('should reset the firstName correctly', () => {
			component.testForm.get('firstName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.testForm.value.firstName).toBeNull();
		});

		it('should reset the surName correctly', () => {
			component.testForm.get('surName').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.testForm.value.surName).toBeNull();
		});

		it('should reset the birthdate correctly', () => {
			component.testForm.get('birthdate').setValue('TEST');
			creationDataService.emitResetCalled();
			expect(component.testForm.value.birthdate).toEqual({date: null, time: null});
		});

		it('should reset the certificateLanguage correctly', () => {
			component.testForm.get('certificateLanguage').setValue({display: 'TEST', code: 'lang'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value.certificateLanguage).toEqual({display: 'TEST', code: 'lang'});
		});

		it('should reset the typeOfTest correctly', () => {
			component.testForm.get('typeOfTest').setValue({display: 'TEST', code: 'typeOfTest'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value.typeOfTest).toEqual({display: 'TEST', code: 'typeOfTest'});
		});

		it('should reset the manufacturer correctly', () => {
			component.testForm.get('manufacturer').setValue({display: 'TEST', code: 'manufacturer'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value.manufacturer).toEqual({display: 'TEST', code: 'manufacturer'});
		});

		it('should reset the sampleDate correctly', () => {
			const dateString = '2021-08-24T08:00:00.482Z';
			const date = new Date(dateString);
			Date.now = jest.fn().mockReturnValue(date);
			component.testForm.get('sampleDate').setValue('TEST');
			creationDataService.emitResetCalled();
			const momentDate: moment.Moment = component.testForm.value.sampleDate.date;
			expect(momentDate.toISOString()).toEqual(dateString);
			expect(component.testForm.value.sampleDate.time).toEqual('10:00');
		});

		it('should reset the center correctly', () => {
			component.testForm.get('center').setValue('Testcenter');
			creationDataService.emitResetCalled();
			expect(component.testForm.value.center).toBe('Testcenter');
		});

		it('should reset the countryOfTest correctly', () => {
			component.testForm.get('countryOfTest').setValue({display: 'TEST', code: 'country'});
			creationDataService.emitResetCalled();
			expect(component.testForm.value.countryOfTest).toEqual({display: 'TEST-CH', code: 'CH'});
		});
	});
});
