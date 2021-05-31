import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {LogoutComponent} from './logout.component';
import {OauthService} from './oauth.service';

describe('LogoutComponent', () => {
	let component: LogoutComponent;
	let fixture: ComponentFixture<LogoutComponent>;

	describe('not authenticated', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [LogoutComponent],
				providers: [
					{
						provide: OauthService,
						useValue: {
							logout: jest.fn(),
							isAuthenticated$: of(false)
						}
					},
					{provide: Router, useValue: {navigate: jest.fn()}}
				]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(LogoutComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should not log user out', () => {
			const service = TestBed.inject(OauthService);
			expect(service.logout).not.toHaveBeenCalled();
		});

		it('should redirect user to root', () => {
			const router = TestBed.inject(Router);
			expect(router.navigate).toHaveBeenCalledWith(['/']);
		});
	});

	describe('authenticated', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [LogoutComponent],
				providers: [
					{
						provide: OauthService,
						useValue: {
							logout: jest.fn(),
							isAuthenticated$: of(true)
						}
					},
					{provide: Router, useValue: {navigate: jest.fn()}}
				]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(LogoutComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should log user out', () => {
			const service = TestBed.inject(OauthService);
			expect(service.logout).toHaveBeenCalled();
		});

		it('should not redirect user', () => {
			const router = TestBed.inject(Router);
			expect(router.navigate).not.toHaveBeenCalled();
		});
	});
});
