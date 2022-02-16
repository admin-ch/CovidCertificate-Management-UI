import {NgModule} from '@angular/core';
import {SharedModule} from 'shared/shared.module';
import {RouterModule} from '@angular/router';
import {CertificateRevokeComponent} from './certificate-revoke.component';
import {AuthGuardService} from '../auth/auth-guard.service';
import {ObAlertModule, ObButtonModule, ObErrorMessagesModule, ObTranslateParamsModule} from '@oblique/oblique';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
	declarations: [CertificateRevokeComponent],
	imports: [
		SharedModule,
		RouterModule.forChild([{path: '', component: CertificateRevokeComponent, canActivate: [AuthGuardService]}]),
		ObAlertModule,
		ObButtonModule,
		ObErrorMessagesModule,
		ObTranslateParamsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule
	]
})
export class CertificateRevokeModule {}
