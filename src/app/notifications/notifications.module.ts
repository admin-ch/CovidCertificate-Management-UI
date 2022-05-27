import {NgModule} from '@angular/core';
import {NotificationsComponent} from './notifications.component';
import {ObAlertModule} from '@oblique/oblique';
import {CommonModule} from "@angular/common";

@NgModule({
	declarations: [NotificationsComponent, NotificationsComponent],
	exports: [
		NotificationsComponent
	],
	imports: [
		CommonModule,
		ObAlertModule
	]
})
export class NotificationsModule {
}
