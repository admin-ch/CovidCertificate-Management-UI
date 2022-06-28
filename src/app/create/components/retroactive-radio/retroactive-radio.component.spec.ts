import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {RetroactiveRadioComponent} from './retroactive-radio.component';

describe('RetroactiveRadioComponent', () => {
	let component: RetroactiveRadioComponent;
	let fixture: ComponentFixture<RetroactiveRadioComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RetroactiveRadioComponent],
			imports: [TranslateModule.forRoot()],
			schemas: [NO_ERRORS_SCHEMA]
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
