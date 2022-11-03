import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationsManagementComponent } from "./notifications-management.component";
import { ObliqueTestingModule, ObMockNotificationService, ObNotificationService } from "@oblique/oblique";
import { NotificationApiService } from "../notification-api.service";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NotificationManagementService } from "./notification-management.service";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatTableModule } from "@angular/material/table";
import { of } from "rxjs";

describe("NotificationsManagementComponent", () => {
	let component: NotificationsManagementComponent;
	let fixture: ComponentFixture<NotificationsManagementComponent>;


	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, ObliqueTestingModule, TranslateModule, MatTableModule, MatDialogModule
			],
			providers: [
				{ provide: ObNotificationService, useClass: ObMockNotificationService },
				{
					provide: NotificationApiService, useValue: {
						get: jest.fn().mockReturnValue(of()),
						delete: jest.fn().mockReturnValue(of())
					}
				},
				{ provide: NotificationManagementService, useValue: {
						currentNotification: null
					} },
				MatDialog],
			declarations: [NotificationsManagementComponent],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();

		fixture = TestBed.createComponent(NotificationsManagementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
