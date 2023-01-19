import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CacheResetComponent} from './cache-reset.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {ObButtonModule} from '@oblique/oblique';
import {RouterModule} from "@angular/router";
import {AuthGuardService} from "../auth/auth-guard.service";
import {CacheResetGuard} from "./cache-reset.guard";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";

@NgModule({
	declarations: [CacheResetComponent],
	exports: [CacheResetComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: CacheResetComponent,
				canActivate: [AuthGuardService, CacheResetGuard]
			}
		]),
		MatTooltipModule,
		TranslateModule,
		MatCheckboxModule,
		ObButtonModule,
		MatButtonModule,
		FormsModule
	]
})

export class CacheResetModule {
}
