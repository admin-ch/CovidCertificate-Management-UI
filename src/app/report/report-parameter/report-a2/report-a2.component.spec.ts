import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA2Component} from './report-a2.component';
import {MatChipInputEvent} from "@angular/material/chips";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {ObliqueTestingModule} from "@oblique/oblique";
import {ReportType} from "shared/model";
import {ReportService} from "../../report.service";

describe('ReportA2Component', () => {
	let component: ReportA2Component;
	let fixture: ComponentFixture<ReportA2Component>;

	const reportServiceMock = {
		formGroup: {
			contains: jest.fn().mockReturnValue(false),
			registerControl: jest.fn()
		}
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [ReportA2Component],
			providers: [{
				provide: ReportService,
				useValue: reportServiceMock
			}],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportA2Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should register the formControl', () => {
		expect(component.formControl).toBeTruthy()
	});

	describe('add()', () => {
		const event: MatChipInputEvent = {
			input: {},
			value: 'urn:uvci:01:CH:123456789123456789123456'
		} as any

		it('should set the formControls value', () => {
			component.add(event)
			expect(component.formControl.value).toBe(event.value)
		});
		it('should push the selectedUvcis', () => {
			component.add(event)
			expect(component.selectedUvcis).toEqual([event.value])
		});
		describe('if value is valid', () => {
			it('should not push to errorUvcis', () => {
				component.add(event)
				expect(component.errorUvcis).toEqual([])
			});
			it('should set chipList.errorState to false if there arent other falsy UVCIs', () => {
				component.chipList.errorState = true
				component.add(event)
				expect(component.chipList.errorState).toBe(false)
			});
			it('should not set chipList.errorState to false if there are other falsy UVCIs', () => {
				component.chipList.errorState = true
				component.errorUvcis.push('test')
				component.add(event)
				expect(component.chipList.errorState).toBe(true)
			});
		});
		describe('if value is invalid', () => {
			beforeEach(() => {
				event.value = 'invalid uvci'
			})
			it('should push to errorUvcis', () => {
				component.add(event)
				expect(component.errorUvcis).toEqual([event.value])
			});
			it('should set chipList.errorState to true', () => {
				component.chipList.errorState = false
				component.add(event)
				expect(component.chipList.errorState).toBe(true)
			});
		});
	});

	describe('remove()', () => {
		beforeEach(() => {
			component.selectedUvcis = ['test-uvci']
		})

		it('should remove from errorUvcis if exists', () => {
			component.errorUvcis = ['test-uvci']
			component.remove('test-uvci')
			expect(component.errorUvcis).toEqual([])
		});

		it('should not remove any from errorUvcis if not exists', () => {
			component.errorUvcis = ['test-uvci-1']
			component.remove('test-uvci')
			expect(component.errorUvcis).toEqual(['test-uvci-1'])
		});

		it('should remove from selectedUvcis if exists', () => {
			component.remove('test-uvci')
			expect(component.selectedUvcis).toEqual([])
		});

		it('should not remove any from selectedUvcis if not exists', () => {
			component.remove('test-uvci-1')
			expect(component.selectedUvcis).toEqual(['test-uvci'])
		});

		it('should set chipList.errorState to false if no errorUvcis exists', () => {
			component.chipList.errorState = true
			component.remove('test-uvci')
			expect(component.chipList.errorState).toBe(false)
		});
		it('should set chipList.errorState to true if errorUvcis exist', () => {
			component.chipList.errorState = false
			component.errorUvcis = ['error-uvci']
			component.remove('test-uvci')
			expect(component.chipList.errorState).toBe(true)
		});
	});

	describe('resetInput()', () => {
		it('should set the formControls value to null', () => {
			component.formControl.setValue('value')
			component.resetInput()
			expect(component.formControl.value).toBe(null)
		});
		it('should reset the errorUvcis', () => {
			component.errorUvcis = ['1', '2', '3']
			component.resetInput()
			expect(component.errorUvcis).toEqual([])
		});
		it('should reset the selectedUvcis', () => {
			component.selectedUvcis = ['1', '2', '3']
			component.resetInput()
			expect(component.selectedUvcis).toEqual([])
		});
		it('should setchipList.errorState to false', () => {
			component.chipList.errorState = true
			component.resetInput()
			expect(component.chipList.errorState).toBe(false)
		});
	});
});
