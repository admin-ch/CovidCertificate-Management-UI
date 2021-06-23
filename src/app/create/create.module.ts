import {NgModule} from '@angular/core';
import {CreateComponent} from './create/create.component';
import {SharedModule} from 'shared/shared.module';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../auth/auth-guard.service';
import {MatStepperModule} from '@angular/material/stepper';
import {
	ObAlertModule,
	ObButtonModule,
	ObErrorMessagesModule,
	ObNestedFormModule,
	ObNumberFormatModule
} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {SelectCertificateTypeComponent} from './select-certificate-type/select-certificate-type.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {VaccineFormComponent} from './vaccine-form/vaccine-form.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {DateTimePickerComponent} from './date-time-picker/date-time-picker.component';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {RecoveryFormComponent} from './recovery-form/recovery-form.component';
import {TestFormComponent} from './test-form/test-form.component';
import {SummaryComponent} from './summary/summary.component';
import {DownloadComponent} from './download/download.component';
import {MatOptionModule} from '@angular/material/core';
import {ShippingComponent} from './shipping/shipping.component';

@NgModule({
	declarations: [
		CreateComponent,
		DateTimePickerComponent,
		SelectCertificateTypeComponent,
		VaccineFormComponent,
		RecoveryFormComponent,
		TestFormComponent,
		SummaryComponent,
		DownloadComponent,
		ShippingComponent
	],
	imports: [
		SharedModule,
		ObAlertModule,
		ObButtonModule,
		ObErrorMessagesModule,
		ObNestedFormModule,
		ObNumberFormatModule,
		MatButtonModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatMomentDateModule,
		MatRadioModule,
		MatSelectModule,
		MatOptionModule,
		MatStepperModule,
		ReactiveFormsModule,
		RouterModule.forChild([{path: '', component: CreateComponent, canActivate: [AuthGuardService]}])
	]
})
export class CreateModule {}
