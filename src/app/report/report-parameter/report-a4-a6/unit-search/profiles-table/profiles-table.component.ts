import {Component, Inject, Input} from '@angular/core';
import {NestedTreeControl} from "@angular/cdk/tree";
import {UnitTree} from "../unit-search.component";
import {EiamProfile, SelectedProfilesService} from "../../selected-profiles.service";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

type ProfilesObservableStore = {
	[unitId: string]: Observable<MatTableDataSource<EiamProfile>>
}

@Component({
	selector: 'ec-profiles-table',
	templateUrl: './profiles-table.component.html',
	styleUrls: ['./profiles-table.component.scss']
})
export class ProfilesTableComponent {

	@Input()
	node: UnitTree

	@Input()
	treeControl: NestedTreeControl<UnitTree>

	@Input()
	authority: string

	profileObservablesStore: ProfilesObservableStore = {}

	readonly TABLE_ROWS = [
		'select',
		'firstname',
		'name',
		'userExtId',
		'email',
	]

	private readonly PROFILES_URL: string

	constructor(public readonly selectedProfilesService: SelectedProfilesService,
				private readonly http: HttpClient,
				@Inject('REPORT_HOST') private readonly REPORT_HOST: string) {
		this.PROFILES_URL = REPORT_HOST + '/api/v2/report/unit/profiles'

	}

	/** Stores and returns the Observables for fetching Eiam profiles. We store them in order to avoid creating
	 * new Observables, causing infinite loop of the change detection because of how the async pipe works. */
	getProfiles$(unit: UnitTree): Observable<MatTableDataSource<EiamProfile>> {
		if (!this.profileObservablesStore[unit.id]) {
			this.profileObservablesStore[unit.id] = this.http.post<EiamProfile[]>(this.PROFILES_URL, {
				id: unit.id,
				authority: this.authority
			}).pipe(map(profiles => new MatTableDataSource<EiamProfile>(profiles)))
		}
		return this.profileObservablesStore[unit.id]
	}
}
