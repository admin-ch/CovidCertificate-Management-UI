import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ObDatePipe} from 'shared/date.pipe';
import {HasAuthorizationForDirective} from './has-authorization-for.directive';

const modules = [CommonModule, TranslateModule, ReactiveFormsModule];

@NgModule({
	declarations: [ObDatePipe, HasAuthorizationForDirective],
	imports: [...modules],
	exports: [...modules, ObDatePipe, HasAuthorizationForDirective]
})
export class SharedModule {}
