import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {map} from "rxjs/operators";
import {EiamProfile, SelectedProfilesService} from "../selected-profiles.service";
import {FormArray} from "@angular/forms";

export interface UnitTree {
	id: string
	name: string
	children: UnitTree[]
	hidden?: boolean
	parent?: UnitTree
}

type ProfilesObservableStore = {
	[unitId: string]: Observable<MatTableDataSource<EiamProfile>>
}

@Component({
	selector: 'ec-unit-search',
	templateUrl: './unit-search.component.html',
	styleUrls: ['./unit-search.component.scss']
})
export class UnitSearchComponent implements OnChanges {

	@Input()
	authority: string;

	@Input()
	userIdsFormArray: FormArray

	isUnitTreeLoading = false
	treeControl = new NestedTreeControl<UnitTree>(node => node.children);
	treeDataSource = new MatTreeNestedDataSource<UnitTree>();
	organisationSearchValue = ''
	profileObservablesStore: ProfilesObservableStore = {}

	readonly TABLE_ROWS = [
		'select',
		'firstname',
		'name',
		'userExtId',
		'email',
	]
	private readonly UNIT_TREE_URL: string
	private readonly PROFILES_URL: string

	constructor(
		private readonly translate: TranslateService,
		private readonly http: HttpClient,
		private readonly selectedProfilesService: SelectedProfilesService,
		@Inject('REPORT_HOST') private readonly REPORT_HOST: string) {
		this.UNIT_TREE_URL = REPORT_HOST + '/api/v1/unit/tree'
		this.PROFILES_URL = REPORT_HOST + '/api/v1/unit/profiles'
	}

	ngOnChanges(changes: SimpleChanges) {
		if ((changes.authority.firstChange || changes.authority.currentValue !== changes.authority.previousValue) && !!changes.authority.currentValue) {
			this.isUnitTreeLoading = true
			this.http.post(this.UNIT_TREE_URL, {
				authority: this.authority,
				language: this.translate.currentLang
			}).subscribe((unitTree: UnitTree) => {
				this.setUnitTreeParents(unitTree, null)
				this.treeDataSource.data = unitTree.children
				this.setHiddenBySearchValue(this.treeDataSource.data)
				this.isUnitTreeLoading = false
			})
		}
	}

	isAllSelected(dataSource: MatTableDataSource<EiamProfile>) {
		return dataSource.data.every(profile => this.selectedProfilesService.exists(profile))
	}

	isSomeSelected(dataSource: MatTableDataSource<EiamProfile>) {
		return dataSource.data.some(profile => this.selectedProfilesService.exists(profile))
	}

	toggleProfile(profile: EiamProfile) {
		const currentlySelected = this.selectedProfilesService.exists(profile)
		if (currentlySelected) {
			this.selectedProfilesService.remove(profile)
		} else {
			this.selectedProfilesService.add(profile)
		}
	}

	isProfileSelected(profile: EiamProfile): boolean {
		return !!this.selectedProfilesService.exists(profile)
	}

	toggleAllRows(dataSource: MatTableDataSource<EiamProfile>) {
		if (this.isAllSelected(dataSource)) {
			this.selectedProfilesService.remove(...dataSource.data)
		} else {
			this.selectedProfilesService.add(...dataSource.data)
		}
	}

	isVisible = (_: number, node: UnitTree) => !!node.children && node.children.length > 0;

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

	/** Sets `hidden` property on the unit trees based on the search value. */
	setHiddenBySearchValue(unitTrees: UnitTree[], first = true): void {
		if (!unitTrees) {
			return
		}
		if (first) {
			this.resetHidden(unitTrees)
			if (!this.organisationSearchValue?.length) {
				return;
			}
		}

		// We go bottom up, so first set hidden on all children.
		unitTrees.forEach(ut => this.setHiddenBySearchValue(ut.children, false))

		// Set all nodes and their ascendants to hidden where search does not match.
		unitTrees
			.filter(unitTree => unitTree.name.toLowerCase().indexOf(this.organisationSearchValue.toLowerCase()) === -1)
			.forEach(unitTree => {
				if (unitTree.hidden === undefined) {
					unitTree.hidden = true;
				}
				this.setHiddenOfAncestorsOf(unitTree, unitTree.hidden)
			});

		// Set all nodes, their ascendants and descendants to not hidden where search does match.
		unitTrees
			.filter(unitTree => unitTree.name.toLowerCase().indexOf(this.organisationSearchValue.toLowerCase()) > -1)
			.forEach(unitTree => {
				unitTree.hidden = false;
				this.setHiddenOfAncestorsOf(unitTree, unitTree.hidden);
				this.setHiddenOfDescendantsOf(unitTree, unitTree.hidden);
				this.treeControl.expand(unitTree)
			});
	}

	isNoneDisplayed() {
		return !this.treeDataSource.data?.some(unitTree => !unitTree.hidden)
	}

	clearOrganisationSearch() {
		this.organisationSearchValue = ''
		this.setHiddenBySearchValue(this.treeDataSource.data)
	}

	/** Setting `hidden` to `undefined` in order to distinguish between `false` (node has explicitly been set to be NOT
	 * hidden) and `undefined`. */
	private resetHidden(unitTrees: UnitTree[]) {
		unitTrees?.forEach(ut => {
			ut.hidden = undefined
			this.resetHidden(ut.children)
		})
	}

	private setHiddenOfAncestorsOf(unitTree: UnitTree, hidden: boolean) {
		if (unitTree.parent) {
			if (unitTree.parent.hidden === undefined || unitTree.parent.hidden === true) {
				unitTree.parent.hidden = hidden
				if (!hidden) {
					this.treeControl.expand(unitTree.parent)
				}
			}
			this.setHiddenOfAncestorsOf(unitTree.parent, hidden)
		}
	}

	private setHiddenOfDescendantsOf(unitTree: UnitTree, hidden: boolean) {
		unitTree.children?.forEach(child => {
			this.setHiddenOfDescendantsOf(child, hidden)
			child.hidden = hidden
		})
	}

	/** We need to know the parent of each node to set the `hidden` property of all ancestors, so we
	 * initialize it by setting them here. */
	private setUnitTreeParents(treeToSetParent: UnitTree, parent: UnitTree) {
		treeToSetParent.parent = parent
		treeToSetParent.children?.forEach(child => this.setUnitTreeParents(child, treeToSetParent))
	}
}
