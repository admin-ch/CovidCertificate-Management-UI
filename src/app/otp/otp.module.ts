import {NgModule} from '@angular/core';
import {OtpComponent} from './otp.component';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from '../auth/auth-guard.service';
import {ObButtonModule, ObColumnLayoutModule, ObIconModule} from '@oblique/oblique';
import {SharedModule} from 'shared/shared.module';
import {MatButtonModule} from '@angular/material/button';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {OtpGuard} from "./otp.guard";

@NgModule({
	declarations: [OtpComponent],
	imports: [
		SharedModule,
		RouterModule.forChild([{path: '', component: OtpComponent, canActivate: [AuthGuardService, OtpGuard]}]),
		ClipboardModule,
		ObButtonModule,
		ObColumnLayoutModule,
		ObIconModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule
	]
})
export class OtpModule {}
