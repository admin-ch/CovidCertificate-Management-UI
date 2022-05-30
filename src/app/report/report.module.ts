import {NgModule} from '@angular/core';
import {ReportComponent} from './report.component';
import {SharedModule} from 'shared/shared.module';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../auth/auth-guard.service';
import {MatIconModule} from '@angular/material/icon';
import {ObAlertModule, ObButtonModule, ObCollapseModule, ObIconModule, ObPopoverModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReportGuard} from './report.guard';
import {MatStepperModule} from '@angular/material/stepper';
import {SelectReportTypeComponent} from './select-report-type/select-report-type.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {ReportParameterComponent} from "./report-parameter/report-parameter.component";
import {ReportA2Component} from './report-parameter/report-a2/report-a2.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ReportGenerationComponent} from "./report-generation/report-generation.component";
import {ReportEndComponent} from './report-end/report-end.component';

@NgModule({
	declarations: [ReportComponent, SelectReportTypeComponent, ReportParameterComponent, ReportGenerationComponent, ReportA2Component, ReportEndComponent],
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
		ObAlertModule
	]
})
export class ReportModule {
}
