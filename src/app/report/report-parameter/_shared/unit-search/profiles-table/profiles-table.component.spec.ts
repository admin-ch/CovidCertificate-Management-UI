import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfilesTableComponent} from './profiles-table.component';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatTableModule} from '@angular/material/table';
import {SelectedProfilesService} from '../../selected-profiles.service';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {UnitTree} from '../unit-search.component';
import {NestedTreeControl} from '@angular/cdk/tree';

describe('ProfilesTableComponent', () => {
	let component: ProfilesTableComponent;
	let fixture: ComponentFixture<ProfilesTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatTableModule],
			declarations: [ProfilesTableComponent],
			providers: [
				{provide: 'REPORT_HOST', useValue: 'REPORT_HOST'},
				{provide: SelectedProfilesService, useValue: new SelectedProfilesService()}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfilesTableComponent);
		component = fixture.componentInstance;

		component.authority = 'BUV';
		component.node = {} as any;
		component.treeControl = new NestedTreeControl<UnitTree>(() => []);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
