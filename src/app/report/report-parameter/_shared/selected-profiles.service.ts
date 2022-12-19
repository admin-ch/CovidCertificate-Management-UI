import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface EiamProfile {
	userExtId: string;
	name: string;
	firstname: string;
	email: string;
	unitName: string;
}

export type EiamProfileSelection = {
	[userExtId: string]: EiamProfile;
};

@Injectable({
	providedIn: 'root'
})
export class SelectedProfilesService {
	changes$: Observable<EiamProfileSelection>;

	private selectedProfiles: EiamProfileSelection = {};
	private readonly changes = new BehaviorSubject<EiamProfileSelection>({});

	constructor() {
		this.changes$ = this.changes.asObservable();
	}

	toggleAll(profiles: EiamProfile[]) {
		if (this.isAllSelected(profiles)) {
			this.remove(...profiles);
		} else {
			this.add(...profiles);
		}
	}

	isAllSelected(profiles: EiamProfile[]) {
		return !!profiles?.length && profiles.every(profile => this.exists(profile));
	}

	isSomeSelected(profiles: EiamProfile[]) {
		return !!profiles?.length && profiles.some(profile => this.exists(profile));
	}

	toggle(profile: EiamProfile) {
		const currentlySelected = this.exists(profile);
		if (currentlySelected) {
			this.remove(profile);
		} else {
			this.add(profile);
		}
	}

	isSelected(profile: EiamProfile): boolean {
		return !!this.exists(profile);
	}

	exists(profile: EiamProfile) {
		return !!this.selectedProfiles[profile.userExtId];
	}

	add(...profiles: EiamProfile[]) {
		for (const profile of profiles) {
			this.selectedProfiles[profile.userExtId] = profile;
		}
		this.changes.next(this.selectedProfiles);
	}

	remove(...profiles: EiamProfile[]) {
		for (const profile of profiles) {
			delete this.selectedProfiles[profile.userExtId];
		}
		this.changes.next(this.selectedProfiles);
	}

	clear() {
		for (const key in this.selectedProfiles) {
			// eslint-disable-next-line no-prototype-builtins
			if (this.selectedProfiles.hasOwnProperty(key)) {
				delete this.selectedProfiles[key];
			}
		}
		this.changes.next(this.selectedProfiles);
	}
}
