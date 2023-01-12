import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CacheResetComponent} from './cache-reset.component';

describe('CacheResetComponent', () => {
	let component: CacheResetComponent;
	let fixture: ComponentFixture<CacheResetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CacheResetComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CacheResetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
