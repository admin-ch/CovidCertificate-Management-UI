import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationsManagementComponent} from './notifications-management.component';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../../auth/auth-guard.service';
import {NotificationsManagementGuard} from './notifications-management.guard';
import {TranslateModule} from '@ngx-translate/core';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {ObButtonModule, ObErrorMessagesModule, ObLanguageModule, ObLanguageService} from '@oblique/oblique';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {NotificationsManagementEditComponent} from './notifications-management-edit/notifications-management-edit.component';
import {NotificationManagementService} from './notification-management.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {DateAdapter} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ConfirmDeleteComponent} from './confirm-delete/confirm-delete.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
	declarations: [NotificationsManagementComponent, NotificationsManagementEditComponent, ConfirmDeleteComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: NotificationsManagementComponent,
				canActivate: [AuthGuardService, NotificationsManagementGuard]
			},
			{
				path: 'edit',
				component: NotificationsManagementEditComponent,
				canActivate: [AuthGuardService, NotificationsManagementGuard]
			}
		]),
		MatProgressSpinnerModule,
		TranslateModule,
		MatTableModule,
		ObLanguageModule,
		MatSortModule,
		MatCheckboxModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatSelectModule,
		ObErrorMessagesModule,
		ReactiveFormsModule,
		ObButtonModule,
		MatButtonModule,
		MatMomentDateModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		MatDialogModule
	],
	providers: [NotificationManagementService]
})
export class NotificationsManagementModule {
	constructor(language: ObLanguageService, adapter: DateAdapter<unknown>) {
		language.setLocaleOnAdapter(adapter);
	}
}
