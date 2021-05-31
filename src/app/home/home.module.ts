import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {HomeComponent} from './home.component';

@NgModule({
	declarations: [HomeComponent],
	imports: [
		CommonModule,
		TranslateModule,
		RouterModule.forChild([{path: '', component: HomeComponent}]),
		MatButtonModule,
		MatCardModule,
		MatIconModule
	]
})
export class HomeModule {}
