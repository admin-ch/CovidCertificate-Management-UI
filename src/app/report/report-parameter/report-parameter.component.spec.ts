import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SharedModule} from "shared/shared.module";
import {ReportService} from "../report.service";
import {ReportParameterComponent} from "./report-parameter.component";

describe('ReportParameterComponent', () => {
	let component: ReportParameterComponent;
	let fixture: ComponentFixture<ReportParameterComponent>;

	const reportServiceMock = {}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, SharedModule],
			providers: [
				{
					provide: ReportService,
					useValue: reportServiceMock
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [ReportParameterComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportParameterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges()
	});

	describe('goNext()', () => {
		it('should should emit next()', waitForAsync(() => {
			const emit = spyOn(component.next, 'emit')
			component.goNext()
			expect(emit).toHaveBeenCalled()
		}));
	});
});
