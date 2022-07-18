import {AfterViewInit, Component, Inject, Injectable, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {EiamProfile, SelectedProfilesService} from "../selected-profiles.service";
import {merge, Subject, Subscription} from "rxjs";
import {MatPaginator, MatPaginatorIntl} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {filter, skipWhile, switchMap} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";

interface ProfilesPage {
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalHits: number;
	profiles: EiamProfile[]
}

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
	changes = new Subject<void>();

	firstPageLabel
	itemsPerPageLabel
	lastPageLabel
	nextPageLabel
	previousPageLabel

	subscription = new Subscription()

	constructor(private readonly translate: TranslateService) {
		this.subscription.add(translate.get('paginator.nextPage').subscribe(value => this.nextPageLabel = value))
		this.subscription.add(translate.get('paginator.previousPage').subscribe(value => this.previousPageLabel = value))
	}

	getRangeLabel(page: number, pageSize: number, length: number): string {
		if (length === 0) {
			return this.translate.instant('paginator.range', {page: 1, amountPages: 1});
		}
		const amountPages = Math.ceil(length / pageSize);
		return this.translate.instant('paginator.range', {page: page + 1, amountPages});
	}
}

@Component({
	selector: 'ec-issuer-search',
	templateUrl: './issuer-search.component.html',
	styleUrls: ['./issuer-search.component.scss'],
	providers: [{provide: MatPaginatorIntl, useClass: CustomPaginatorIntl}],
})
export class IssuerSearchComponent implements OnChanges, AfterViewInit {

	@Input()
	authority: string;

	@Input()
	userIdsFormArray: FormArray

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	profilesDataSource: MatTableDataSource<EiamProfile> = new MatTableDataSource<EiamProfile>([])

	totalHits = 0
	searchFieldsFormGroup = new FormGroup({
		firstName: new FormControl('', [Validators.minLength(3)]),
		name: new FormControl('', [Validators.minLength(3)]),
		userExtId: new FormControl('', [Validators.minLength(3)]),
		email: new FormControl('', [Validators.minLength(3)]),
	})

	TABLE_ROWS: ((keyof EiamProfile) | 'select')[] = ['select', 'firstname', 'name', 'userExtId', 'email', 'unitName'];

	isIssuerLoading = true
	applySearch$ = new Subject<void>()

	private readonly PROFILE_SEARCH_URL: string

	constructor(
		private readonly translate: TranslateService,
		private readonly http: HttpClient,
		public readonly selectedProfilesService: SelectedProfilesService,
		@Inject('REPORT_HOST') private readonly REPORT_HOST: string) {
		this.PROFILE_SEARCH_URL = REPORT_HOST + '/api/v2/report/profile/search'
	}

	ngOnChanges(changes: SimpleChanges) {
		if ((changes.authority.firstChange || changes.authority.currentValue !== changes.authority.previousValue) && !!changes.authority.currentValue) {
			this.applySearch$.next()
		}
	}

	ngAfterViewInit() {
		merge(this.sort.sortChange, this.paginator.page, this.applySearch$)
			.pipe(
				filter(_ => !!this.authority && this.searchFieldsFormGroup.valid),
				switchMap(_ => {
					this.isIssuerLoading = true;

					return this.http.post<ProfilesPage>(this.PROFILE_SEARCH_URL, {
						pageNumber: this.paginator.pageIndex,
						pageSize: this.paginator.pageSize,
						orderBy: this.sort.active,
						orderAscending: this.sort.direction === "asc",
						authority: this.authority,
						language: this.translate.currentLang,
						searchUserExtId: this.searchFieldsFormGroup.get('userExtId').value || null,
						searchName: this.searchFieldsFormGroup.get('name').value || null,
						searchFirstname: this.searchFieldsFormGroup.get('firstName').value || null,
						searchEmail: this.searchFieldsFormGroup.get('email').value || null
					})
				})
			)
			.subscribe(data => {
				this.profilesDataSource.data = data.profiles
				this.totalHits = data.totalHits
				this.isIssuerLoading = false;
			});
		setTimeout(() => {
			if (this.authority) {
				this.applySearch$.next()
			}
		})
	}
}

