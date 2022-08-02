import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DateFromToFieldsetComponent} from './date-from-to-fieldset.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {ObliqueTestingModule} from "@oblique/oblique";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {REPORT_ERROR_STATE_MATCHER} from "../../../errorStateMatcher";
import {ErrorStateMatcher} from "@angular/material/core";

describe('DateFromToFieldsetComponent', () => {
	let component: DateFromToFieldsetComponent;
	let fixture: ComponentFixture<DateFromToFieldsetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, TranslateModule],
			declarations: [DateFromToFieldsetComponent],
			providers: [
				{provide: REPORT_ERROR_STATE_MATCHER, useClass: ErrorStateMatcher}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DateFromToFieldsetComponent);
		component = fixture.componentInstance;
		component.dateFromFormControl = new FormControl()
		component.dateToFormControl = new FormControl()
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
