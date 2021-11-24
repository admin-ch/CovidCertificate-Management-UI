import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ObliqueTestingModule} from '@oblique/oblique';
import {WhoCheckboxComponent} from './who-checkbox.component';

describe('DateTimePickerComponent', () => {
	let component: WhoCheckboxComponent;
	let fixture: ComponentFixture<WhoCheckboxComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObliqueTestingModule, ReactiveFormsModule],
				declarations: [WhoCheckboxComponent],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WhoCheckboxComponent);
		component = fixture.componentInstance;
		component.formControl = new FormControl('', Validators.required);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('hasError', () => {
		it('should show error on invalid', () => {
			component.formControl.markAllAsTouched();

			expect(component.hasError).toBeTruthy();

			component.formControl.setValue(undefined);
			expect(component.hasError).toBeTruthy();

			component.formControl.setValue(null);
			expect(component.hasError).toBeTruthy();
		});

		it('should not show error if untouched', () => {
			expect(component.hasError).toBeFalsy();

			component.formControl.setValue(undefined);
			expect(component.hasError).toBeFalsy();

			component.formControl.setValue(null);
			expect(component.hasError).toBeFalsy();
		});

		it('should not show error if valid', () => {
			component.formControl.markAllAsTouched();

			component.formControl.setValue(true);
			expect(component.hasError).toBeFalsy();
		});
	});
});
