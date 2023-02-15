import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportA13Component} from './report-a13.component';

describe('ReportA13Component', () => {
	let component: ReportA13Component;
	let fixture: ComponentFixture<ReportA13Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ReportA13Component]
		}).compileComponents();

		fixture = TestBed.createComponent(ReportA13Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
