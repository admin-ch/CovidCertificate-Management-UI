import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SelectReportTypeComponent} from "./select-report-type.component";
import {AuthFunction, AuthService} from "../../auth/auth.service";
import {Subject} from "rxjs";
import {ReportType} from "shared/model";
import {SharedModule} from "shared/shared.module";

describe('SelectReportTypeComponent', () => {
	let component: SelectReportTypeComponent;
	let fixture: ComponentFixture<SelectReportTypeComponent>;

	const authServiceMock = {
		authorizedFunctions$: new Subject()
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, SharedModule],
			providers: [
				{
					provide: AuthService,
					useValue: authServiceMock
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [SelectReportTypeComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectReportTypeComponent);
		component = fixture.componentInstance;
	});

	describe('initializing form', () => {
		describe('type of reportTypeSelectionForm', () => {
			it.each([
				[[AuthFunction.REPORT_A2], ReportType.A2],
				[[AuthFunction.REPORT_A2, AuthFunction.REPORT_A3], ReportType.A2],
				[[AuthFunction.REPORT_A12, AuthFunction.REPORT_A3], ReportType.A3],
				[[AuthFunction.REPORT_A12, AuthFunction.REPORT_A5, AuthFunction.REPORT_A10], ReportType.A5],
			])
			('should be set correctly according to authorization', fakeAsync((ownedAuthFunctions, expectedReportType) => {
				component.ngOnInit();
				authServiceMock.authorizedFunctions$.next(ownedAuthFunctions)
				tick()
				expect(component.reportTypeSelectionForm.get('type').value).toBe(expectedReportType)
			}));
		})
	});

});
