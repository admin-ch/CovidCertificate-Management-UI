import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';

import {SelectedProfilesComponent} from './selected-profiles.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {SelectedProfilesService} from '../selected-profiles.service';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ReportService} from '../../../report.service';
import {FormArray, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';

describe('SelectedUnitsComponent', () => {
	let component: SelectedProfilesComponent;
	let fixture: ComponentFixture<SelectedProfilesComponent>;
	let selectedProfilesService: SelectedProfilesService;
	let reportService: ReportService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [SelectedProfilesComponent],
			providers: [
				{provide: SelectedProfilesService, useValue: new SelectedProfilesService()},
				{
					provide: ReportService,
					useValue: {
						formGroup: new FormGroup({}),
						reset$: new Subject()
					}
				}
			],

			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectedProfilesComponent);
		component = fixture.componentInstance;
		component.userIdsFormArray = new FormArray([]);
		selectedProfilesService = TestBed.inject(SelectedProfilesService);
		reportService = TestBed.inject(ReportService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call selectedProfilesService.clear() if reset$ has been emitted', fakeAsync(() => {
		const clear = jest.spyOn(selectedProfilesService, 'clear');
		reportService.reset$.next();
		tick();
		expect(clear).toHaveBeenCalled();
	}));
	describe('if selectedProfilesService.changes$ has been emitted', () => {
		it('should clear formArray', fakeAsync(() => {
			const clear = jest.spyOn(component.userIdsFormArray, 'clear');
			// @ts-ignore
			selectedProfilesService.changes.next([]);
			tick();
			expect(clear).toHaveBeenCalled();
		}));
		it('should populate formArray', fakeAsync(() => {
			// @ts-ignore
			selectedProfilesService.changes.next([
				// @ts-ignore
				{
					userExtId: '1'
				},
				// @ts-ignore
				{
					userExtId: '2'
				},
				// @ts-ignore
				{
					userExtId: '3'
				}
			]);
			tick();
			expect(component.userIdsFormArray.controls.map(c => c.value)).toEqual(['1', '2', '3']);
		}));
	});
});
