import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {take, tap} from "rxjs/operators";
import {AuthService} from "../../../../auth/auth.service";
import {Observable, Subscription} from "rxjs";
import {DataRoomCode} from "shared/model";
import {FormControl} from "@angular/forms";
import {ReportService} from "../../../report.service";
import {ErrorStateMatcher} from "@angular/material/core";
import {REPORT_ERROR_STATE_MATCHER} from "../../../errorStateMatcher";

@Component({
	selector: 'ec-data-room-selection-fieldset',
	templateUrl: './data-room-selection-fieldset.component.html',
	styleUrls: ['./data-room-selection-fieldset.component.scss']
})
export class DataRoomSelectionFieldsetComponent implements OnInit, OnDestroy {

	@Input()
	dataRoomFormControl: FormControl

	authorizedDataRooms$: Observable<DataRoomCode[]>

	subscription: Subscription

	constructor(private readonly auth: AuthService,
				private readonly reportService: ReportService,
				@Inject(REPORT_ERROR_STATE_MATCHER) public readonly matcher: ErrorStateMatcher) {
	}

	ngOnInit(): void {
		this.subscription = this.reportService.reset$.subscribe(() => this.resetControl())
		this.authorizedDataRooms$ = this.auth.authorizedDataRooms$.pipe(
			tap(dataRooms => {
				// Pre-select the canton if there is only one available.
				if (dataRooms?.length === 1) {
					this.dataRoomFormControl.setValue(dataRooms[0])
				}
			})
		)
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}

	resetControl() {
		this.dataRoomFormControl.reset()

		// The `tap()` function defined in `ngOnInit()` takes care of populating the `canton` formControl.
		this.authorizedDataRooms$.pipe(take(1)).subscribe()
	}
}
