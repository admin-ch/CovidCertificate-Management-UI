import {Component, Input, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import {EiamProfile, SelectedProfilesService} from "../selected-profiles.service";
import {FormArray, FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {ReportService} from "../../../report.service";

@Component({
	selector: 'ec-selected-units',
	templateUrl: './selected-profiles.component.html',
	styleUrls: ['./selected-profiles.component.scss']
})
export class SelectedProfilesComponent implements OnInit, OnDestroy {
	@Input()
	userIdsFormArray: FormArray

	selectedChip: EiamProfile

	readonly Object = Object
	private subscription: Subscription

	constructor(public readonly selectedProfilesService: SelectedProfilesService,
				private readonly reportService: ReportService) {
	}

	readonly trackBy: TrackByFunction<EiamProfile> = ((_, item) => item.userExtId)

	remove(profile: EiamProfile) {
		this.selectedProfilesService.remove(profile)
	}

	ngOnInit(): void {
		this.subscription = this.reportService.reset$.subscribe(() => this.selectedProfilesService.clear())
		this.subscription.add(
			this.selectedProfilesService.changes$.subscribe(selectedProfiles => {
				this.userIdsFormArray.clear()
				Object.values(selectedProfiles).map(p => p.userExtId).forEach(userExtId => this.userIdsFormArray.push(new FormControl(userExtId)))
			})
		)
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe()
	}
}
