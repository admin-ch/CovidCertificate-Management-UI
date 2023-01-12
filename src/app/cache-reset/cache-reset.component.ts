import {Component} from '@angular/core';
import {CacheResetService} from './cache-reset.service';

@Component({
	selector: 'ec-cache-reset',
	templateUrl: './cache-reset.component.html',
	styleUrls: ['./cache-reset.component.scss']
})
export class CacheResetComponent {
	constructor(private readonly cacheResetService: CacheResetService) {}

	resetCache() {
		this.cacheResetService.resetCache();
	}
}
