import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {EiamSelfAdminComponent} from './eiam-self-admin.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('EiamSelfAdminComponent', () => {
	let component: EiamSelfAdminComponent;
	let fixture: ComponentFixture<EiamSelfAdminComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			declarations: [EiamSelfAdminComponent],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [{provide: 'EIAM_SELF_ADMIN', useValue: 'prefix_CURRENT_PAGE_middle_LANGUAGE_suffix'}]
		}).compileComponents();
	}));

	beforeEach(async () => {
		fixture = TestBed.createComponent(EiamSelfAdminComponent);
		await TestBed.inject(TranslateService).use('en');
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnChanges', () => {
		beforeEach(() => {
			component.page = 'page';
		});
		it('should format url', () => {
			component.ngOnChanges();
			expect(component.url).toBe('prefix_page_middle_en_suffix');
		});
		it('should format url on lang change', () => {
			const translate = TestBed.inject(TranslateService);
			translate.onLangChange.emit();
			expect(component.url).toBe('prefix_page_middle_en_suffix');
		});
	});
});
