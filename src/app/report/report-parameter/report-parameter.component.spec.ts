import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {SharedModule} from 'shared/shared.module';
import {ReportService} from '../report.service';
import {ReportParameterComponent} from './report-parameter.component';
import {MatStepper} from '@angular/material/stepper';
import {FormGroup} from '@angular/forms';

describe('ReportParameterComponent', () => {
	let component: ReportParameterComponent;
	let fixture: ComponentFixture<ReportParameterComponent>;
	let stepper: MatStepper;

	const reportServiceMock = {
		generateReport$: {
			next: jest.fn()
		},
		validateChiplist$: {
			next: jest.fn()
		},
		formGroup: new FormGroup({})
	};

	const stepperMock = {
		next: jest.fn()
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SharedModule],
			providers: [
				{
					provide: ReportService,
					useValue: reportServiceMock
				},
				{
					provide: MatStepper,
					useValue: stepperMock
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [ReportParameterComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportParameterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		stepper = TestBed.inject(MatStepper);
	});

	describe('goNext()', () => {
		describe('when formGroup is valid', () => {
			it('should emit next()', waitForAsync(() => {
				component.goNext();
				expect(reportServiceMock.generateReport$.next).toHaveBeenCalled();
			}));
			it('call next on stepper', waitForAsync(() => {
				const nextSpy = jest.spyOn(stepper, 'next');
				component.goNext();
				expect(nextSpy).toHaveBeenCalled();
			}));
		});
		describe('when formGroup is invalid', () => {
			let stepperNextSpy: jest.SpyInstance;

			beforeAll(() => {
				stepperNextSpy = jest.spyOn(stepper, 'next');
			});

			beforeEach(() => {
				reportServiceMock.generateReport$.next.mockReset();
				reportServiceMock.formGroup.setErrors({hasError: true});
				stepperNextSpy.mockReset();
			});

			it('should not emit next()', waitForAsync(() => {
				component.goNext();
				expect(reportServiceMock.generateReport$.next).not.toHaveBeenCalled();
			}));
			it('not call next on stepper', waitForAsync(() => {
				component.goNext();
				expect(stepperNextSpy).not.toHaveBeenCalled();
			}));
			it('should call formGroup.markAllAsTouched()', waitForAsync(() => {
				const spy = jest.spyOn(reportServiceMock.formGroup, 'markAllAsTouched');
				component.goNext();
				expect(spy).toHaveBeenCalled();
			}));
		});
	});
});
