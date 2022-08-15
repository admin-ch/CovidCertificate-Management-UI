import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChipListFieldsetComponent} from './chip-list-fieldset.component';
import {MatChipInputEvent} from "@angular/material/chips";
import {ReportType} from "shared/model";
import {ReportService} from "../../../report.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {ObliqueTestingModule} from "@oblique/oblique";

describe('ChipListFieldsetComponent', () => {
	let component: ChipListFieldsetComponent;
	let fixture: ComponentFixture<ChipListFieldsetComponent>;
	let reportService: ReportService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [ChipListFieldsetComponent],
			providers: [
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({}),
						reset$: new Subject()
					}
				}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ChipListFieldsetComponent);
		component = fixture.componentInstance;
		reportService = TestBed.inject(ReportService);
		reportService.formGroup = new FormGroup({
			[ReportType.A2]: new FormGroup({
				uvcis: new FormControl([])
			})
		});
		component.chipDataFormControl = reportService.formGroup.get(ReportType.A2).get('uvcis') as FormControl
		component.formatValidator = () => null

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('add()', () => {
		const event: MatChipInputEvent = {
			input: {},
			value: 'urn:uvci:01:CH:123456789123456789123456'
		} as any;

		it('should set the formControls value', () => {
			component.add(event);
			expect(component.formControl.value).toBe(event.value);
		});
		it('should push the selectedUvcis', () => {
			component.add(event);
			expect(reportService.formGroup.get(ReportType.A2).get('uvcis').value).toEqual([event.value]);
		});
		describe('if value is valid', () => {
			beforeEach(() => {
				component.formatValidator = (control) => control.value === 'valid' ? null : {format: true}
				event.value = 'valid';
			});
			it('should not push to errorUvcis', () => {
				component.add(event);
				expect(component.errorUvcis).toEqual([]);
			});
			it('should set chipList.errorState to false if there arent other falsy UVCIs', () => {
				component.chipList.errorState = true;
				component.add(event);
				expect(component.chipList.errorState).toBe(false);
			});
			it('should not set chipList.errorState to false if there are other falsy UVCIs', () => {
				component.chipList.errorState = true;
				component.errorUvcis.push('test');
				component.add(event);
				expect(component.chipList.errorState).toBe(true);
			});
		});
		describe('if value is invalid', () => {
			beforeEach(() => {
				component.formatValidator = (control) => control.value === 'valid' ? null : {format: true}
				event.value = 'invalid';
			});
			it('should push to errorUvcis', () => {
				component.add(event);
				expect(component.errorUvcis).toEqual([event.value]);
			});
			it('should set chipList.errorState to true', () => {
				component.chipList.errorState = false;
				component.add(event);
				expect(component.chipList.errorState).toBe(true);
			});
		});
	});

	describe('remove()', () => {
		beforeEach(() => {
			reportService.formGroup.get(ReportType.A2).get('uvcis').setValue([
				'urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC',
				'urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA722'
			])
			component.formControl.markAsTouched();
		});

		it('should remove from errorUvcis if exists', () => {
			component.errorUvcis = ['urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC'];
			component.remove('urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC');
			expect(component.errorUvcis).toEqual([]);
		});

		it('should not remove any from errorUvcis if not exists', () => {
			component.errorUvcis = ['urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC-1'];
			component.remove('urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC');
			expect(component.errorUvcis).toEqual(['urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC-1']);
		});

		it('should remove from selectedUvcis if exists', () => {
			component.remove('urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC');
			expect(reportService.formGroup.get(ReportType.A2).get('uvcis').value).toEqual(['urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA722']);
		});

		it('should not remove any from selectedUvcis if not exists', () => {
			component.remove('urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC-1');
			expect(reportService.formGroup.get(ReportType.A2).get('uvcis').value).toEqual([
				'urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC',
				'urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA722'
			]);
		});

		it('should set chipList.errorState to false if no errorUvcis exists', () => {
			component.chipList.errorState = true;
			component.remove('urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC');
			expect(component.chipList.errorState).toBe(false);
		});
		it('should set chipList.errorState to true if errorUvcis exist', () => {
			component.chipList.errorState = false;
			component.errorUvcis = ['error-uvci'];
			component.remove('urn:uvci:01:CH:3E8FF2E41754EB4BCD4BA7CC');
			expect(component.chipList.errorState).toBe(true);
		});
	});

	describe('resetInput()', () => {
		it('should set the formControls value to null', () => {
			component.formControl.setValue('value');
			component.resetInput();
			expect(component.formControl.value).toBe(null);
		});
		it('should reset the errorUvcis', () => {
			component.errorUvcis = ['1', '2', '3'];
			component.resetInput();
			expect(component.errorUvcis).toEqual([]);
		});
		it('should reset the selectedUvcis', () => {
			reportService.formGroup.get(ReportType.A2).get('uvcis').setValue(['1', '2', '3'])
			component.resetInput();
			expect(reportService.formGroup.get(ReportType.A2).get('uvcis').value).toEqual([]);
		});
		it('should setchipList.errorState to false', () => {
			component.chipList.errorState = true;
			component.resetInput();
			expect(component.chipList.errorState).toBe(false);
		});
	});
});
