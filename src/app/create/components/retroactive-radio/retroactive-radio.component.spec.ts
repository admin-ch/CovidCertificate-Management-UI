import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetroactiveRadioComponent} from './retroactive-radio.component';

describe('RetroactiveRadioComponent', () => {
	let component: RetroactiveRadioComponent;
	let fixture: ComponentFixture<RetroactiveRadioComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RetroactiveRadioComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RetroactiveRadioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
