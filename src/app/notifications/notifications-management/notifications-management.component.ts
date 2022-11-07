import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { NotificationManagementService } from "./notification-management.service";
import { TranslateService } from "@ngx-translate/core";
import { MatTableDataSource } from "@angular/material/table";
import { Notification } from "../notification.service";
import { ObNotificationService } from "@oblique/oblique";
import { NotificationApiService } from "../notification-api.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import { concatMap } from "rxjs/operators";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "ec-notifications-management",
	templateUrl: "./notifications-management.component.html",
	styleUrls: ["./notifications-management.component.scss"]
})
export class NotificationsManagementComponent implements AfterViewInit {
	@ViewChild(MatSort) private readonly sort: MatSort;
	readonly COLUMN_NAME_ACTIONS = "actions";
	languages: string[] = [];
	readonly dataSource = new MatTableDataSource<Notification>([]);
	readonly COLUMNS: Array<keyof Notification | "actions"> = [
		"startTime",
		"endTime",
		"type",
		"isClosable",
		"content",
		"actions"
	];
	isLoading = true;

	constructor(public readonly translateService: TranslateService,
				private readonly apiService: NotificationApiService,
				private readonly router: Router,
				private readonly obNotificationService: ObNotificationService,
				private readonly dialog: MatDialog,
				private readonly notificationManagementService: NotificationManagementService) {
		this.languages = translateService.langs;
	}

	ngAfterViewInit() {
		this.notificationManagementService.currentNotification = null;
		this.dataSource.sort = this.sort;
		this.isLoading = true;
		this.apiService.get().subscribe(n => {
			this.populateDataSource(n);
			this.isLoading = false;
		});
	}

	editNotification(notification: Notification) {
		this.notificationManagementService.currentNotification = notification;
		this.router.navigate(["notifications-management/edit"]);
	}

	createNotification() {
		this.notificationManagementService.currentNotification = null;
		this.router.navigate(["notifications-management/edit"]);
	}

	openConfirmDeleteDialog(notification: Notification): void {
		const dialogRef = this.dialog.open(ConfirmDeleteComponent);

		dialogRef.afterClosed().subscribe(shouldDelete => {
			if (shouldDelete === true) {
				this.deleteNotification(notification.id)
			}
		});
	}

	private deleteNotification(id: string) {
		this.isLoading = true;
		this.apiService.delete(id)
			.pipe(
				concatMap(() => this.apiService.get())
			).subscribe(n => {
			this.populateDataSource(n);
			this.obNotificationService.success(this.translateService.instant("notificationsManagement.success.delete"));
			this.isLoading = false;
		});
	}

	private populateDataSource(notifications: Notification[]): void {
		this.dataSource.data = notifications.map(this.convertUtcToLocalTime);
	}

	private convertUtcToLocalTime(n: Notification): Notification {
		n.startTime = moment.utc(n.startTime).local().format();
		n.endTime = moment.utc(n.endTime).local().format();
		return n;
	}
}
