import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExceptionalFormComponent} from './exceptional-form.component';

describe('ExceptionalFormComponent', () => {
	let component: ExceptionalFormComponent;
	let fixture: ComponentFixture<ExceptionalFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExceptionalFormComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExceptionalFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
