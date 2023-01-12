import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CacheResetComponent } from './cache-reset.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {multiTranslateLoader} from "@oblique/oblique";



@NgModule({
	declarations: [
		CacheResetComponent
	],
	exports: [
		CacheResetComponent
	],
	imports: [
		CommonModule,
		MatTooltipModule,
		TranslateModule.forRoot(multiTranslateLoader()),
	]
})
export class CacheResetModule { }
