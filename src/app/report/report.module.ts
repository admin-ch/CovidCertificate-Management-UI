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
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ReportGenerationComponent} from './report-generation/report-generation.component';
import {ReportEndComponent} from './report-end/report-end.component';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, ErrorStateMatcher} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataRoomSelectionFieldsetComponent} from './report-parameter/_shared/data-room-selection-fieldset/data-room-selection-fieldset.component';
import {DateFromToFieldsetComponent} from './report-parameter/_shared/date-from-to-fieldset/date-from-to-fieldset.component';
import {CertTypeSelectionFieldsetComponent} from './report-parameter/_shared/cert-type-selection-fieldset/cert-type-selection-fieldset.component';
import {MatTreeModule} from '@angular/material/tree';
import {UnitSearchComponent} from './report-parameter/_shared/unit-search/unit-search.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {SelectedProfilesComponent} from './report-parameter/_shared/selected-profiles/selected-profiles.component';
import {FieldWrapperComponent} from './report-parameter/_shared/field-wrapper/field-wrapper.component';
import {IssuerSearchComponent} from './report-parameter/_shared/issuer-search/issuer-search.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {REPORT_ERROR_STATE_MATCHER} from './errorStateMatcher';
import {ProfilesTableComponent} from './report-parameter/_shared/unit-search/profiles-table/profiles-table.component';
import {ChipListFieldsetComponent} from './report-parameter/_shared/chip-list-fieldset/chip-list-fieldset.component';
import {ReportA2Component} from './report-parameter/report-a2/report-a2.component';
import {ReportA7Component} from './report-parameter/report-a7/report-a7.component';
import {ReportA4A6Component} from './report-parameter/report-a4-a6/report-a4-a6.component';
import {ReportA8Component} from './report-parameter/report-a8/report-a8.component';
import {ReportA9Component} from './report-parameter/report-a9/report-a9.component';
import {ReportA11Component} from './report-parameter/report-a11/report-a11.component';
import {ReportA12Component} from './report-parameter/report-a12/report-a12.component';
import {ReportA3A5Component} from './report-parameter/report-a3-a5/report-a3-a5.component';
import {ReportA13Component} from './report-parameter/report-a13/report-a13.component';

@NgModule({
	declarations: [
		ReportComponent,
		SelectReportTypeComponent,
		ReportParameterComponent,
		ReportGenerationComponent,
		ReportEndComponent,
		DataRoomSelectionFieldsetComponent,
		DateFromToFieldsetComponent,
		CertTypeSelectionFieldsetComponent,
		ReportEndComponent,
		UnitSearchComponent,
		DataRoomSelectionFieldsetComponent,
		DateFromToFieldsetComponent,
		CertTypeSelectionFieldsetComponent,
		UnitSearchComponent,
		SelectedProfilesComponent,
		FieldWrapperComponent,
		IssuerSearchComponent,
		ProfilesTableComponent,
		ProfilesTableComponent,
		ChipListFieldsetComponent,
		ReportA2Component,
		ReportA4A6Component,
		ReportA7Component,
		ReportA8Component,
		ReportA9Component,
		ReportA11Component,
		ReportA12Component,
		ReportA3A5Component,
		ReportA13Component
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
		FormsModule,
		MatTreeModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSortModule
	],
	providers: [
		{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
		{provide: REPORT_ERROR_STATE_MATCHER, useClass: ErrorStateMatcher},
		MatCheckboxModule,
		FormsModule,
		MatTreeModule,
		MatProgressSpinnerModule
	]
})
export class ReportModule {
	constructor(language: ObLanguageService, adapter: DateAdapter<unknown>) {
		language.setLocaleOnAdapter(adapter);
	}
}
