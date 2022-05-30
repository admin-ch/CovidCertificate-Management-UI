import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportEndComponent} from './report-end.component';

describe('ReportEndComponent', () => {
	let component: ReportEndComponent;
	let fixture: ComponentFixture<ReportEndComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ReportEndComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportEndComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should fail', () => {
		fail('implement tests')
	});
});
