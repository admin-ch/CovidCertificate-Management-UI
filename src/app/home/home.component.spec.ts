import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EventEmitter, NO_ERRORS_SCHEMA} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {skip} from 'rxjs/operators';
import {HomeComponent} from './home.component';
import {ObliqueTestingModule} from '@oblique/oblique';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			providers: [
				{
					provide: TranslateService,
					useValue: {
						onLangChange: new EventEmitter<LangChangeEvent>(),
						currentLang: 'en'
					}
				}
			],
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [HomeComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
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
		});

		it('should use emitted language', done => {
			const translate = TestBed.inject(TranslateService);
			component.lang$.pipe(skip(1)).subscribe(url => {
				expect(url).toBe('de');
				done();
			});
			translate.onLangChange.emit({
				lang: 'de',
				translations: {}
			});
		});
	});
});
