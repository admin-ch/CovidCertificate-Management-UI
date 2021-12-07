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
	ObNumberFormatModule,
	ObInputClearModule,
	ObCollapseModule,
	ObTranslateParamsModule
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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DateTimePickerComponent} from './date-time-picker/date-time-picker.component';
import {RecoveryFormComponent} from './recovery-form/recovery-form.component';
import {TestFormComponent} from './test-form/test-form.component';
import {SummaryComponent} from './summary/summary.component';
import {DownloadComponent} from './download/download.component';
import {MatOptionModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ShippingComponent} from './shipping/shipping.component';
import {DeliveryCodeCleanerDirective} from './shipping/delivery-code-cleaner.directive';
import {TouristVaccineFormComponent} from './tourist-vaccine-form/tourist-vaccine-form.component';
import {WhoCheckboxComponent} from './components/who-checkbox/who-checkbox.component';
import {PersonalDataComponent} from './components/personal-data/personal-data.component';

@NgModule({
	declarations: [
		CreateComponent,
		DateTimePickerComponent,
		WhoCheckboxComponent,
		SelectCertificateTypeComponent,
		VaccineFormComponent,
		RecoveryFormComponent,
		TestFormComponent,
		SummaryComponent,
		TouristVaccineFormComponent,
		DownloadComponent,
		ShippingComponent,
		DeliveryCodeCleanerDirective,
		PersonalDataComponent
	],
	imports: [
		SharedModule,
		ObAlertModule,
		ObButtonModule,
		ObErrorMessagesModule,
		ObNestedFormModule,
		ObNumberFormatModule,
		ObTranslateParamsModule,
		ObInputClearModule,
		MatButtonModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatMomentDateModule,
		MatRadioModule,
		MatSelectModule,
		MatOptionModule,
		MatStepperModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		MatTooltipModule,
		MatIconModule,
		ReactiveFormsModule,
		RouterModule.forChild([{path: '', component: CreateComponent, canActivate: [AuthGuardService]}]),
		ObCollapseModule
	]
})
export class CreateModule {}
