import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let translateService: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [HomeComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		translateService = TestBed.inject(TranslateService);
		translateService.use('en');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('lang$', () => {
		it('should be defined', () => {
			expect(component.lang$).toBeDefined();
		});

		it('should emit an url', done => {
			component.lang$.subscribe(url => {
				expect(url).toBe('en');
				done();
			});
			translateService.onLangChange.emit({
				lang: 'en',
				translations: {}
			});
		});

		it('should use emitted language', done => {
			component.lang$.subscribe(url => {
				expect(url).toBe('de');
				done();
			});
			translateService.onLangChange.emit({
				lang: 'de',
				translations: {}
			});
		});
	});
});
