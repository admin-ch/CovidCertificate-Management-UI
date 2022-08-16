import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ObliqueTestingModule} from '@oblique/oblique';
import {DateTimePickerComponent} from './date-time-picker.component';

describe('DateTimePickerComponent', () => {
	let component: DateTimePickerComponent;
	let fixture: ComponentFixture<DateTimePickerComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObliqueTestingModule, ReactiveFormsModule],
				declarations: [DateTimePickerComponent],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DateTimePickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have a form property', () => {
		expect(component.form instanceof FormGroup).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should set id if not present', () => {
			component.id = undefined;
			component.ngOnInit();
			expect(component.id.startsWith('datepicker-')).toBe(true);
		});
		it('should keep id if present', () => {
			component.id = 'test';
			component.ngOnInit();
			expect(component.id).toBe('test');
		});
		it('should apply default time', () => {
			const mockTime = new Date();
			component.defaultValue = {time: mockTime};
			component.ngOnInit();
			expect(component.form.value.time).toBe(mockTime);
		});
		it('should apply default date', () => {
			const mockDate = new Date();
			component.defaultValue = {date: mockDate};
			component.ngOnInit();
			expect(component.form.value.date).toBe(mockDate);
		});
		it('should have empty string as default value', () => {
			component.ngOnInit();
			expect(component.form.value.time).toBe('');
			expect(component.form.value.date).toBe('');
		});
	});

	describe('ngOnChanges', () => {
		describe('required', () => {
			beforeEach(() => {
				component.required = true;
			});
			it('should set required validator on date', () => {
				jest.spyOn(component.form.get('date'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('date').setValidators).toHaveBeenCalledWith(Validators.required);
			});

			it('should set required validator on time', () => {
				jest.spyOn(component.form.get('time'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('time').setValidators).toHaveBeenCalledWith(Validators.required);
			});
		});

		describe('not required', () => {
			beforeEach(() => {
				component.required = undefined;
			});
			it('should cancel validator on date', () => {
				jest.spyOn(component.form.get('date'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('date').setValidators).toHaveBeenCalledWith(null);
			});
			it('should cancel validator on time', () => {
				jest.spyOn(component.form.get('time'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('time').setValidators).toHaveBeenCalledWith(null);
			});
			it('should not change the label if undefined', () => {
				component.label = undefined;
				component.ngOnChanges();
				expect(component.label).toBeUndefined();
			});
		});

		describe('required, not showing date', () => {
			beforeEach(() => {
				component.required = true;
				component.showDate = false;
			});
			it('should not set validators on date', () => {
				jest.spyOn(component.form.get('date'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('date').setValidators).toHaveBeenCalledTimes(0);
			});
			it('should set required validator on time', () => {
				jest.spyOn(component.form.get('time'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('time').setValidators).toHaveBeenCalledWith(Validators.required);
			});
		});

		describe('required, not showing time', () => {
			beforeEach(() => {
				component.required = true;
				component.showTime = false;
			});
			it('should set required validators on date', () => {
				jest.spyOn(component.form.get('date'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('date').setValidators).toHaveBeenCalledWith(Validators.required);
			});
			it('should not set validators on time', () => {
				jest.spyOn(component.form.get('time'), 'setValidators');
				component.ngOnChanges();
				expect(component.form.get('time').setValidators).toHaveBeenCalledTimes(0);
			});
		});

		describe('Error handling', () => {
			describe('Invalid date', () => {
				beforeEach(() => {
					component.errors = {['date']: {required: true}};
					component.ngOnChanges();
				});

				it('should set error correctly in date field', () => {
					expect(component.form.get('date').errors).toEqual({date: {required: true}});
				});
				it('should set no errors in time field', () => {
					expect(component.form.get('time').errors).toBeNull();
				});
			});

			describe('Invalid after today', () => {
				beforeEach(() => {
					component.errors = {dateAfterToday: true};
					component.ngOnChanges();
				});

				it('should set error correctly in date field', () => {
					expect(component.form.get('date').errors).toEqual({dateAfterToday: true});
				});
				it('should set no errors in time field', () => {
					expect(component.form.get('time').errors).toBeNull();
				});
			});

			describe('Date too small', () => {
				beforeEach(() => {
					component.errors = {dateTooSmall: true};
					component.ngOnChanges();
				});

				it('should set error correctly in date field', () => {
					expect(component.form.get('date').errors).toEqual({dateTooSmall: true});
				});
				it('should set no errors in time field', () => {
					expect(component.form.get('time').errors).toBeNull();
				});
			});

			describe('Invalid time', () => {
				beforeEach(() => {
					component.errors = {['time']: {required: true}};
					component.ngOnChanges();
				});

				it('should set no errors in date field', () => {
					expect(component.form.get('date').errors).toBeNull();
				});

				it('should set error correctly in time field', () => {
					expect(component.form.get('time').errors).toEqual({time: {required: true}});
				});
			});

			describe('Invalid time', () => {
				beforeEach(() => {
					component.errors = {timeAfterToday: true};
					component.ngOnChanges();
				});

				it('should set no errors in date field', () => {
					expect(component.form.get('date').errors).toBeNull();
				});

				it('should set error correctly in time field', () => {
					expect(component.form.get('time').errors).toEqual({timeAfterToday: true});
				});
			});
		});
	});
});
