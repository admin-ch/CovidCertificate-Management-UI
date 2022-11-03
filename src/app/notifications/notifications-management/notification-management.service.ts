import { Injectable } from "@angular/core";
import { Notification } from "../notification.service";

@Injectable()
export class NotificationManagementService {
	currentNotification: Notification
}
