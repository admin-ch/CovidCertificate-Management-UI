import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from 'shared/shared.module';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../auth/auth-guard.service';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ObButtonModule, ObIconModule} from '@oblique/oblique';

@NgModule({
	declarations: [DashboardComponent],
	imports: [
		SharedModule,
		RouterModule.forChild([{path: '', component: DashboardComponent, canActivate: [AuthGuardService]}]),
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		ObButtonModule,
		ObIconModule
	]
})
export class DashboardModule {}
