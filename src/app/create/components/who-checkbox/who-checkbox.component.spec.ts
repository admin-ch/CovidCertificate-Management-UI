import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {WhoCheckboxComponent} from './who-checkbox.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

describe('WhoCheckboxComponent', () => {
	let component: WhoCheckboxComponent;
	let fixture: ComponentFixture<WhoCheckboxComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, MatCheckboxModule],
			declarations: [WhoCheckboxComponent],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WhoCheckboxComponent);
		component = fixture.componentInstance;
		component.control = new FormControl('', Validators.required);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('hasError', () => {
		it('should show error on invalid', () => {
			component.control.markAllAsTouched();

			expect(component.hasError).toBeTruthy();

			component.control.setValue(undefined);
			expect(component.hasError).toBeTruthy();

			component.control.setValue(null);
			expect(component.hasError).toBeTruthy();
		});

		it('should not show error if untouched', () => {
			expect(component.hasError).toBeFalsy();

			component.control.setValue(undefined);
			expect(component.hasError).toBeFalsy();

			component.control.setValue(null);
			expect(component.hasError).toBeFalsy();
		});

		it('should not show error if valid', () => {
			component.control.markAllAsTouched();

			component.control.setValue(true);
			expect(component.hasError).toBeFalsy();
		});
	});
});
