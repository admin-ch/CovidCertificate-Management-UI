import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroupDirective, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ObNestedFormModule} from '@oblique/oblique';
import {DateTimePickerComponent} from '../../date-time-picker/date-time-picker.component';
import {CreationDataService} from '../../utils/creation-data.service';
import {PersonalDataComponent} from './personal-data.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('PersonalDataComponent', () => {
	let component: PersonalDataComponent;
	let fixture: ComponentFixture<PersonalDataComponent>;
	let creationDataService: CreationDataService;

	const dateFuture: Date = new Date('9999-04-29');
	const datePast: Date = new Date('2000-04-29');
	const dateToOld: Date = new Date('1899-12-31');

	beforeEach(async () => {
		const fb = new FormBuilder();
		const formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = fb.group({
			test: fb.control(null)
		});

		await TestBed.configureTestingModule({
			declarations: [PersonalDataComponent, DateTimePickerComponent],
			imports: [
				NoopAnimationsModule,
				ObNestedFormModule,
				ReactiveFormsModule,
				MatSelectModule,
				MatFormFieldModule,
				MatInputModule,
				MatAutocompleteModule,
				HttpClientTestingModule,
				TranslateModule.forRoot()
			],
			providers: [FormGroupDirective, {provide: FormGroupDirective, useValue: formGroupDirective}],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PersonalDataComponent);
		creationDataService = TestBed.inject(CreationDataService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Form validation', () => {
		describe('firstName validation', () => {
			it('It should marks the firstName as invalid if empty', () => {
				component.vaccineForm.get('firstName').setValue('');
				expect(component.vaccineForm.get('firstName').invalid).toBeTruthy();
			});

			it('It should marks the firstName as invalid if length is over 50', () => {
				component.vaccineForm.get('firstName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.vaccineForm.get('firstName').invalid).toBeTruthy();
			});

			it('It should marks the firstName as valid if filled correctly', () => {
				component.vaccineForm.get('firstName').setValue('John');
				expect(component.vaccineForm.get('firstName').invalid).toBeFalsy();
			});
		});

		describe('surName validation', () => {
			it('It should marks the surName as invalid if empty', () => {
				component.vaccineForm.get('surName').setValue('');
				expect(component.vaccineForm.get('surName').invalid).toBeTruthy();
			});

			it('It should marks the surName as invalid if length is over 50', () => {
				component.vaccineForm.get('surName').setValue('012345678901234567890123456789012345678901234567891');
				expect(component.vaccineForm.get('surName').invalid).toBeTruthy();
			});

			it('should marks the surName as valid if filled correctly', () => {
				component.vaccineForm.get('surName').setValue('Doe');
				expect(component.vaccineForm.get('surName').invalid).toBeFalsy();
			});
		});

		describe('birthdate validation', () => {
			it('It should marks the birthdate as invalid if empty', () => {
				component.vaccineForm.get('birthdate').setValue({date: ''});
				expect(component.vaccineForm.get('birthdate').invalid).toBeTruthy();
			});

			it('It  should marks the birthdate as invalid if in the future', () => {
				component.vaccineForm.get('birthdate').setValue({date: dateFuture});
				expect(component.vaccineForm.get('birthdate').invalid).toBeTruthy();
			});

			it('It should marks the birthdate as invalid if to old', () => {
				component.vaccineForm.get('birthdate').setValue({date: dateToOld});
				expect(component.vaccineForm.get('birthdate').invalid).toBeTruthy();
			});

			it('It should marks the birthdate as valid if set correctly', () => {
				component.vaccineForm.get('birthdate').setValue({date: datePast});
				expect(component.vaccineForm.get('birthdate').invalid).toBeFalsy();
			});

			it('It should allow valid short date', () => {
				component.vaccineForm.get('birthdate').setValue({date: '2000-01'});
				expect(component.vaccineForm.get('birthdate').invalid).toBeFalsy();
				component.vaccineForm.get('birthdate').setValue({date: '2000'});
				expect(component.vaccineForm.get('birthdate').invalid).toBeFalsy();
			});
		});

		describe('certificateLanguage validation', () => {
			it('It  should marks the certificateLanguage as invalid if empty', () => {
				component.vaccineForm.get('certificateLanguage').setValue('');
				expect(component.vaccineForm.get('certificateLanguage').invalid).toBeTruthy();
			});

			it('should marks the certificateLanguage as valid if filled', () => {
				component.vaccineForm.get('certificateLanguage').setValue('DE');
				expect(component.vaccineForm.get('certificateLanguage').invalid).toBeFalsy();
			});
		});

		describe('Form reset', () => {
			it('It should reset the firstName correctly', () => {
				component.vaccineForm.get('firstName').setValue('TEST');
				creationDataService.emitResetCalled();
				expect(component.vaccineForm.value.firstName).toBeNull();
			});

			it('It should reset the surName correctly', () => {
				component.vaccineForm.get('surName').setValue('TEST');
				creationDataService.emitResetCalled();
				expect(component.vaccineForm.value.surName).toBeNull();
			});

			it('It should reset the birthdate correctly', () => {
				component.vaccineForm.get('birthdate').setValue('TEST');
				creationDataService.emitResetCalled();
				expect(component.vaccineForm.value.birthdate).toEqual({date: null, time: null});
			});

			it('It should reset the certificateLanguage correctly', () => {
				component.vaccineForm.get('certificateLanguage').setValue({display: 'TEST', code: 'lang'});
				creationDataService.emitResetCalled();
				expect(component.vaccineForm.value.certificateLanguage).toEqual({display: 'TEST', code: 'lang'});
			});
		});
		describe('Field validation', () => {
			it('It should marks the form as valid if all fields are filled correctly', () => {
				component.vaccineForm.get('firstName').setValue('John');
				component.vaccineForm.get('surName').setValue('Doe');
				component.vaccineForm.get('birthdate').setValue({date: datePast});
				component.vaccineForm.get('certificateLanguage').setValue('DE');

				expect(component.vaccineForm.invalid).toBeFalsy();
			});
		});
	});
});
