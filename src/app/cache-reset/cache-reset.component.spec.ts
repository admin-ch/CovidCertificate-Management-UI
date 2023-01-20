import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CacheResetComponent} from './cache-reset.component';
import {TranslateModule} from '@ngx-translate/core';
import {CacheResetService} from './cache-reset.service';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

describe('CacheResetComponent', () => {
	let component: CacheResetComponent;
	let fixture: ComponentFixture<CacheResetComponent>;

	const CacheResetServiceMock = {
		next: jest.fn()
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{
					provide: CacheResetService,
					useValue: CacheResetServiceMock
				},
				{provide: 'REPORT_HOST', useValue: 'REPORT_HOST'}
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
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
