import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {IssuerSearchComponent} from './issuer-search.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SelectedProfilesService} from '../selected-profiles.service';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChange} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {MatTableModule} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';
import {FormArray} from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {of, Subject} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

class MatPaginatorStub {
	page = new Subject();
}

class MatSortStub {
	sortChange = new Subject();
	active = true;
	sort = 'asc';
}

describe('IssuerSearchComponent', () => {
	let component: IssuerSearchComponent;
	let fixture: ComponentFixture<IssuerSearchComponent>;
	let http: HttpClient;
	let translateService: TranslateService;
	let selectedProfilesService: SelectedProfilesService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ObliqueTestingModule,
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				MatTableModule,
				MatSortModule,
				MatPaginatorModule,
				NoopAnimationsModule
			],
			declarations: [IssuerSearchComponent],
			providers: [
				{provide: SelectedProfilesService, useValue: new SelectedProfilesService()},
				{provide: 'REPORT_HOST', useValue: 'REPORT_HOST'}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(IssuerSearchComponent);
		component = fixture.componentInstance;

		http = TestBed.inject(HttpClient);
		translateService = TestBed.inject(TranslateService);
		selectedProfilesService = TestBed.inject(SelectedProfilesService);

		component.userIdsFormArray = new FormArray([]);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnChanges', () => {
		let next: jest.SpyInstance;

		beforeEach(() => {
			next = jest.spyOn(component.applySearch$, 'next');
		});

		it('should call next if its the first change', () => {
			component.ngOnChanges({authority: new SimpleChange('de', 'de', true)});

			expect(next).toHaveBeenCalled();
		});

		it('should call next if authority has changed', () => {
			component.ngOnChanges({authority: new SimpleChange('be', 'buv', false)});

			expect(next).toHaveBeenCalled();
		});

		it('should not call next if authority is null', () => {
			component.ngOnChanges({authority: new SimpleChange('be', null, true)});

			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('ngAfterViewInit', () => {
		let post: jest.SpyInstance;

		beforeEach(() => {
			post = jest.spyOn(http, 'post');
			component.authority = 'buv';
		});

		it('should make a post if sortChange has been emitted', fakeAsync(() => {
			component.sort.sortChange.next();
			tick();
			expect(post).toHaveBeenCalled();
		}));
		it('should make a post if applySearch$ has been emitted', fakeAsync(() => {
			component.applySearch$.next();
			tick();
			expect(post).toHaveBeenCalled();
		}));
		it('should make a post if page has been emitted', fakeAsync(() => {
			component.paginator.page.next();
			tick();
			expect(post).toHaveBeenCalled();
		}));
		it('should not make a post if authority is falsy', fakeAsync(() => {
			component.authority = '';
			component.paginator.page.next();
			component.applySearch$.next();
			component.sort.sortChange.next();
			tick();
			expect(post).not.toHaveBeenCalled();
		}));
		it('should set profilesDataSource.data', fakeAsync(() => {
			const profilesMock = [{a: 'a'}, {b: 'b'}, {c: 'c'}];
			post.mockReturnValueOnce(
				of({
					profiles: profilesMock
				})
			);
			component.applySearch$.next();
			tick();
			expect(component.profilesDataSource.data).toBe(profilesMock);
		}));
		it('should set totalHits', fakeAsync(() => {
			post.mockReturnValueOnce(
				of({
					totalHits: 22
				})
			);
			component.applySearch$.next();
			tick();
			expect(component.totalHits).toBe(22);
		}));
		it('should isIssuerLoading to false', fakeAsync(() => {
			component.isIssuerLoading = true;
			post.mockReturnValueOnce(
				of({
					totalHits: 22
				})
			);
			component.applySearch$.next();
			tick();
			expect(component.isIssuerLoading).toBe(false);
		}));
	});
});
