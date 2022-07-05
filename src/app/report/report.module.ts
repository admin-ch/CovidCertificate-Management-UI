import {NgModule} from '@angular/core';
import {ReportComponent} from './report.component';
import {SharedModule} from 'shared/shared.module';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../auth/auth-guard.service';
import {MatIconModule} from '@angular/material/icon';
import {
	ObAlertModule,
	ObButtonModule,
	ObCollapseModule,
	ObExternalLinkModule,
	ObIconModule,
	ObLanguageService,
	ObMockErrorMessagesModule,
	ObPopoverModule
} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReportGuard} from './report.guard';
import {MatStepperModule} from '@angular/material/stepper';
import {SelectReportTypeComponent} from './select-report-type/select-report-type.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {ReportParameterComponent} from './report-parameter/report-parameter.component';
import {ReportA2Component} from './report-parameter/report-a2/report-a2.component';
import {ReportA7Component} from './report-parameter/report-a7/report-a7.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ReportGenerationComponent} from './report-generation/report-generation.component';
import {ReportEndComponent} from './report-end/report-end.component';
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter} from "@angular/material/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {
	DataRoomSelectionFieldsetComponent
} from './report-parameter/_shared/data-room-selection-fieldset/data-room-selection-fieldset.component';
import {
	DateFromToFieldsetComponent
} from './report-parameter/_shared/date-from-to-fieldset/date-from-to-fieldset.component';
import {
	CertTypeSelectionFieldsetComponent
} from './report-parameter/_shared/cert-type-selection-fieldset/cert-type-selection-fieldset.component';
import {FormsModule} from "@angular/forms";

@NgModule({
	declarations: [
		ReportComponent,
		SelectReportTypeComponent,
		ReportParameterComponent,
		ReportGenerationComponent,
		ReportA2Component,
		ReportA7Component,
		ReportEndComponent,
		DataRoomSelectionFieldsetComponent,
		DateFromToFieldsetComponent,
		CertTypeSelectionFieldsetComponent,
	],
	imports: [
		SharedModule,
		ObButtonModule,
		ObIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatSelectModule,
		RouterModule.forChild([{path: '', component: ReportComponent, canActivate: [AuthGuardService, ReportGuard]}]),
		MatStepperModule,
		MatRadioModule,
		ObCollapseModule,
		ObPopoverModule,
		MatCardModule,
		MatChipsModule,
		MatInputModule,
		MatProgressBarModule,
		ObAlertModule,
		ObExternalLinkModule,
		MatDatepickerModule,
		MatMomentDateModule,
		ObMockErrorMessagesModule,
		MatCheckboxModule,
		FormsModule
	]
})
export class ReportModule {
	constructor(language: ObLanguageService, adapter: DateAdapter<any>) {
		language.setLocaleOnAdapter(adapter);
	}
}
