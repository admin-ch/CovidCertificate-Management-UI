import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {SelectedProfilesService} from '../selected-profiles.service';
import {UntypedFormArray} from '@angular/forms';
import {ReportService} from '../../../report.service';
import {Subscription} from 'rxjs';

export interface UnitTree {
	id: string;
	name: string;
	children: UnitTree[];
	hidden?: boolean;
	parent?: UnitTree;
}

@Component({
	selector: 'ec-unit-search',
	templateUrl: './unit-search.component.html',
	styleUrls: ['./unit-search.component.scss']
})
export class UnitSearchComponent implements OnInit, OnChanges, OnDestroy {
	@Input()
	authority: string;

	@Input()
	userIdsFormArray: UntypedFormArray;

	isUnitTreeLoading = false;
	treeControl = new NestedTreeControl<UnitTree>(node => node.children);
	treeDataSource = new MatTreeNestedDataSource<UnitTree>();
	organisationSearchValue = '';

	subscription: Subscription;

	private readonly UNIT_TREE_URL: string;

	constructor(
		private readonly translate: TranslateService,
		private readonly http: HttpClient,
		public readonly selectedProfilesService: SelectedProfilesService,
		private readonly reportService: ReportService,
		@Inject('REPORT_HOST') private readonly REPORT_HOST: string
	) {
		this.UNIT_TREE_URL = `${REPORT_HOST}/api/v2/report/unit/tree`;
	}

	ngOnInit() {
		this.subscription = this.reportService.reset$.subscribe(() => this.treeControl.collapseAll());
	}

	ngOnChanges(changes: SimpleChanges) {
		if ((changes.authority.firstChange || changes.authority.currentValue !== changes.authority.previousValue) && !!changes.authority.currentValue) {
			this.isUnitTreeLoading = true;
			this.http
				.post(this.UNIT_TREE_URL, {
					authority: this.authority,
					language: this.translate.currentLang
				})
				.subscribe((unitTree: UnitTree) => {
					if (unitTree) {
						this.setUnitTreeParents(unitTree, null);
						this.treeDataSource.data = unitTree.children;
						this.setHiddenBySearchValue(this.treeDataSource.data);
					} else {
						this.treeDataSource.data = [];
					}
					this.isUnitTreeLoading = false;
				});
		}
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	isVisible = (_: number, node: UnitTree) => !!node.children && node.children.length > 0;

	/** Sets `hidden` property on the unit trees based on the search value. */
	setHiddenBySearchValue(unitTrees: UnitTree[], first = true): void {
		if (!unitTrees) {
			return;
		}
		if (first) {
			this.resetHidden(unitTrees);
			if (!this.organisationSearchValue?.length) {
				return;
			}
		}

		// We go bottom up, so first set hidden on all children.
		unitTrees.forEach(ut => this.setHiddenBySearchValue(ut.children, false));

		// Set all nodes and their ascendants to hidden where search does not match.
		unitTrees
			.filter(unitTree => !unitTree.name.toLowerCase().includes(this.organisationSearchValue.toLowerCase()))
			.forEach(unitTree => {
				if (unitTree.hidden === undefined) {
					unitTree.hidden = true;
				}
				this.setHiddenOfAncestorsOf(unitTree, unitTree.hidden);
			});

		// Set all nodes, their ascendants and descendants to not hidden where search does match.
		unitTrees
			.filter(unitTree => unitTree.name.toLowerCase().includes(this.organisationSearchValue.toLowerCase()))
			.forEach(unitTree => {
				unitTree.hidden = false;
				this.setHiddenOfAncestorsOf(unitTree, unitTree.hidden);
				this.setHiddenOfDescendantsOf(unitTree, unitTree.hidden);
				this.treeControl.expand(unitTree);
			});
	}

	isNoneDisplayed() {
		return !this.treeDataSource.data?.some(unitTree => !unitTree.hidden);
	}

	clearOrganisationSearch() {
		this.organisationSearchValue = '';
		this.setHiddenBySearchValue(this.treeDataSource.data);
	}

	/** Setting `hidden` to `undefined` in order to distinguish between `false` (node has explicitly been set to be NOT
	 * hidden) and `undefined`. */
	private resetHidden(unitTrees: UnitTree[]) {
		unitTrees?.forEach(ut => {
			ut.hidden = undefined;
			this.resetHidden(ut.children);
		});
	}

	private setHiddenOfAncestorsOf(unitTree: UnitTree, hidden: boolean) {
		if (unitTree.parent) {
			if (unitTree.parent.hidden === undefined || unitTree.parent.hidden) {
				unitTree.parent.hidden = hidden;
				if (!hidden) {
					this.treeControl.expand(unitTree.parent);
				}
			}
			this.setHiddenOfAncestorsOf(unitTree.parent, hidden);
		}
	}

	private setHiddenOfDescendantsOf(unitTree: UnitTree, hidden: boolean) {
		unitTree.children?.forEach(child => {
			this.setHiddenOfDescendantsOf(child, hidden);
			child.hidden = hidden;
		});
	}

	/** We need to know the parent of each node to set the `hidden` property of all ancestors, so we
	 * initialize it by setting them here. */
	private setUnitTreeParents(treeToSetParent: UnitTree, parent: UnitTree) {
		treeToSetParent.parent = parent;
		treeToSetParent.children?.forEach(child => this.setUnitTreeParents(child, treeToSetParent));
	}
}
