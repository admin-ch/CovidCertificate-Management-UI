import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmDeleteComponent} from './confirm-delete.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

describe('ConfirmDeleteComponent', () => {
	let component: ConfirmDeleteComponent;
	let fixture: ComponentFixture<ConfirmDeleteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			declarations: [ConfirmDeleteComponent],
			providers: [],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmDeleteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
