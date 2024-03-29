import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {DashboardComponent} from './dashboard.component';
import {ObNotificationService} from '@oblique/oblique';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {Notification, NotificationService} from '../notifications/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

@Directive({
	selector: '[ecHasAuthorizationFor],[ecHasAuthorizationForAny],[ecHasAuthorizationForAll]'
})
export class HasAuthorizationForMockDirective {
	@Input()
	ecHasAuthorizationFor;

	@Input()
	ecHasAuthorizationForAny;

	@Input()
	ecHasAuthorizationForAll;
}

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;
	let router: Router;

	const notificationServiceMock = {
		closableNotifications$: new Subject<Notification[]>()
	};

	const obNotificationServiceMock = {
		info: jest.fn(),
		warning: jest.fn()
	};

	const translateServiceMock = {
		currentLang: 'en'
	};

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes([
					{
						path: 'test',
						component: DashboardComponent
					}
				])
			],
			declarations: [DashboardComponent, HasAuthorizationForMockDirective],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
			providers: [
				{provide: Router, useValue: {navigateByUrl: jest.fn()}},
				{provide: NotificationService, useValue: notificationServiceMock},
				{provide: ObNotificationService, useValue: obNotificationServiceMock},
				{provide: TranslateService, useValue: translateServiceMock}
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('go to certificate create', () => {
		component.goToCertificateCreate();

		expect(router.navigateByUrl).toHaveBeenCalledWith('certificate-create');
	});

	it('go to certificate revoke', () => {
		component.goToCertificateRevoke();

		expect(router.navigateByUrl).toHaveBeenCalledWith('certificate-revoke');
	});

	it('go to generate otp', () => {
		component.goToGenerateOtp();

		expect(router.navigateByUrl).toHaveBeenCalledWith('otp');
	});

	it('go to generate multiple certificates', () => {
		component.goToGenerateMultipleCertificates();

		expect(router.navigateByUrl).toHaveBeenCalledWith('upload');
	});

	describe('ngOnInit', () => {
		it('should set subscription', () => {
			// @ts-ignore
			expect(component.subscription).toBeTruthy();
		});

		describe('when upcoming notifications are emitted', () => {
			beforeEach(() => {
				obNotificationServiceMock.info.mockClear();
				obNotificationServiceMock.warning.mockClear();
			});

			it('should call info function of obNotificationService once', () => {
				notificationServiceMock.closableNotifications$.next([
					{
						id: 'id',
						type: 'INFO',
						content: {
							de: 'Deutsch',
							en: 'English',
							fr: 'Francais',
							it: 'Italiano'
						},
						isClosable: true,
						startTime: '',
						endTime: ''
					}
				]);
				expect(obNotificationServiceMock.info).toHaveBeenCalledWith({message: 'English', sticky: true});
				expect(obNotificationServiceMock.warning).not.toHaveBeenCalled();
			});

			it('should call warning function of obNotificationService once', () => {
				notificationServiceMock.closableNotifications$.next([
					{
						id: 'id',
						type: 'WARNING',
						content: {
							de: 'Deutsch',
							en: 'English',
							fr: 'Francais',
							it: 'Italiano'
						},
						isClosable: true,
						startTime: '',
						endTime: ''
					}
				]);
				expect(obNotificationServiceMock.warning).toHaveBeenCalledWith({message: 'English', sticky: true});
				expect(obNotificationServiceMock.info).not.toHaveBeenCalled();
			});

			it('should call warning and info function of obNotificationService twice', () => {
				notificationServiceMock.closableNotifications$.next([
					{
						id: 'id',
						type: 'WARNING',
						content: {
							de: 'Deutsch 1',
							en: 'English 1',
							fr: 'Francais 1',
							it: 'Italiano 1'
						},
						isClosable: true,
						startTime: '',
						endTime: ''
					},
					{
						id: 'id',
						type: 'WARNING',
						content: {
							de: 'Deutsch 2',
							en: 'English 2',
							fr: 'Francais 2',
							it: 'Italiano 2'
						},
						isClosable: true,
						startTime: '',
						endTime: ''
					},
					{
						id: 'id',
						type: 'INFO',
						content: {
							de: 'Deutsch 3',
							en: 'English 3',
							fr: 'Francais 3',
							it: 'Italiano 3'
						},
						isClosable: true,
						startTime: '',
						endTime: ''
					},
					{
						id: 'id',
						type: 'INFO',
						content: {
							de: 'Deutsch 4',
							en: 'English 4',
							fr: 'Francais 4',
							it: 'Italiano 4'
						},
						isClosable: true,
						startTime: '',
						endTime: ''
					}
				]);
				expect(obNotificationServiceMock.warning).toHaveBeenNthCalledWith(1, {
					message: 'English 1',
					sticky: true
				});
				expect(obNotificationServiceMock.warning).toHaveBeenNthCalledWith(2, {
					message: 'English 2',
					sticky: true
				});
				expect(obNotificationServiceMock.info).toHaveBeenNthCalledWith(1, {message: 'English 3', sticky: true});
				expect(obNotificationServiceMock.info).toHaveBeenNthCalledWith(2, {message: 'English 4', sticky: true});
			});

			it('should call no function of obNotificationService', () => {
				notificationServiceMock.closableNotifications$.next([]);
				expect(obNotificationServiceMock.info).not.toHaveBeenCalled();
				expect(obNotificationServiceMock.warning).not.toHaveBeenCalled();
			});
		});
	});
});
