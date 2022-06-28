import {NgModule} from '@angular/core';
import {BulkRevocationComponent} from './bulkRevocation.component';
import {SharedModule} from 'shared/shared.module';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../auth/auth-guard.service';
import {MatIconModule} from '@angular/material/icon';
import {ObAlertModule, ObButtonModule, ObIconModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {BulkRevocationGuard} from './bulkRevocation.guard';

@NgModule({
	declarations: [BulkRevocationComponent],
	imports: [
		SharedModule,
		ObButtonModule,
		ObIconModule,
		MatButtonModule,
		MatIconModule,
		ObAlertModule,
		MatSelectModule,
		RouterModule.forChild([
			{path: '', component: BulkRevocationComponent, canActivate: [AuthGuardService, BulkRevocationGuard]}
		])
	]
})
export class BulkRevocationModule {}
