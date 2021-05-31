import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ObDatePipe} from 'shared/date.pipe';

const modules = [CommonModule, TranslateModule, ReactiveFormsModule];

@NgModule({
	declarations: [ObDatePipe],
	imports: [...modules],
	exports: [...modules, ObDatePipe]
})
export class SharedModule {}
