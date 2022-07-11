import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface EiamProfile {
	userExtId: string
	name: string
	firstname: string
	email: string
	mobilePhone: string
}

export type EiamProfileSelection = {
	[userExtId: string]: EiamProfile
}

@Injectable({
	providedIn: 'root'
})
export class SelectedProfilesService {
	changes$: Observable<EiamProfileSelection>

	private selectedProfiles: EiamProfileSelection = {}
	private changes = new BehaviorSubject<EiamProfileSelection>({})

	constructor() {
		this.changes$ = this.changes.asObservable()
	}

	exists(profile: EiamProfile) {
		return !!this.selectedProfiles[profile.userExtId]
	}

	add(...profiles: EiamProfile[]) {
		for (const profile of profiles) {
			this.selectedProfiles[profile.userExtId] = profile
		}
		this.changes.next(this.selectedProfiles)
	}

	remove(...profiles: EiamProfile[]) {
		for (const profile of profiles) {
			delete this.selectedProfiles[profile.userExtId]
		}
		this.changes.next(this.selectedProfiles)
	}

	clear() {
		for (const key in this.selectedProfiles) {
			if (this.selectedProfiles.hasOwnProperty(key)) {
				delete this.selectedProfiles[key];
			}
		}
		this.changes.next(this.selectedProfiles)
	}
}
