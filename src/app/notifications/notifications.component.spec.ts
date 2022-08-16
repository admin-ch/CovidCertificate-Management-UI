import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ObNotificationService} from '@oblique/oblique';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {NotificationsComponent} from './notifications.component';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

describe('NotificationsComponent', () => {
	let component: NotificationsComponent;
	let fixture: ComponentFixture<NotificationsComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [],
				declarations: [NotificationsComponent],
				schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
				providers: [
					{
						provide: NotificationService,
						useValue: {
							imminentNotifications$: new Subject()
						}
					},
					{provide: ObNotificationService, useValue: {}},
					{provide: TranslateService, useValue: {}}
				]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should set imminentNotifications$', () => {
		expect(component.imminentNotifications$).toBeTruthy();
	});
});
