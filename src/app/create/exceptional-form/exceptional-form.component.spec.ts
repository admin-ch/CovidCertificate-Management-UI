import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExceptionalFormComponent} from './exceptional-form.component';
import {DateTimePickerComponent} from "../date-time-picker/date-time-picker.component";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ObliqueTestingModule, ObNestedFormModule} from "@oblique/oblique";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ExceptionalFormComponent', () => {
	let component: ExceptionalFormComponent;
	let fixture: ComponentFixture<ExceptionalFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExceptionalFormComponent, DateTimePickerComponent],
			imports: [
				NoopAnimationsModule,
				ObliqueTestingModule,
				ObNestedFormModule,
				ReactiveFormsModule,
				MatSelectModule,
				MatFormFieldModule,
				MatInputModule,
				MatAutocompleteModule
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExceptionalFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
