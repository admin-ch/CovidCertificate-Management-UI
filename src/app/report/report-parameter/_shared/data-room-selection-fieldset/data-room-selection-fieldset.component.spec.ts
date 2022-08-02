import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {DataRoomSelectionFieldsetComponent} from './data-room-selection-fieldset.component';
import {AuthService} from "../../../../auth/auth.service";
import {DataRoomCode} from "shared/model";
import {Subject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {ObliqueTestingModule} from "@oblique/oblique";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {ReportService} from "../../../report.service";
import {REPORT_ERROR_STATE_MATCHER} from "../../../errorStateMatcher";
import {ErrorStateMatcher} from "@angular/material/core";

describe('DataRoomSelectionComponent', () => {
	let component: DataRoomSelectionFieldsetComponent;
	let fixture: ComponentFixture<DataRoomSelectionFieldsetComponent>;
	let authService: AuthService

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, TranslateModule],
			declarations: [DataRoomSelectionFieldsetComponent],
			providers: [
				{
					provide: AuthService,
					useValue: {
						authorizedDataRooms$: new Subject<DataRoomCode[]>()
					}
				},
				{
					provide: ReportService,
					useValue: {
						reset$: new Subject<void>()
					}
				},
				{provide: REPORT_ERROR_STATE_MATCHER, useClass: ErrorStateMatcher}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DataRoomSelectionFieldsetComponent);
		component = fixture.componentInstance;

		component.dataRoomFormControl = new FormControl('')
		fixture.detectChanges();
		authService = TestBed.inject(AuthService)
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('authorizedDataRooms$', () => {

		it('should set canton automatically if there is only one available to the user', fakeAsync(() => {
			component.dataRoomFormControl.setValue(null)
			// @ts-ignore
			authService.authorizedDataRooms$.next([DataRoomCode.AG])
			tick()

			expect(component.dataRoomFormControl.value).toEqual(DataRoomCode.AG)
		}));
		it('should not set canton automatically if there are multiple cantons available to the user', fakeAsync(() => {
			component.dataRoomFormControl.setValue(null)
			// @ts-ignore
			authService.authorizedDataRooms$.next([DataRoomCode.AG, DataRoomCode.BE])
			tick()

			expect(component.dataRoomFormControl.value).toBe(null)
		}));
	});
});
