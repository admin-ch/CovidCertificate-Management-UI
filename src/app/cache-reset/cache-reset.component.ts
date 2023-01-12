import {Component, OnInit} from '@angular/core';
import {CacheResetService} from "./cache-reset.service";

@Component({
	selector: 'ec-cache-reset',
	templateUrl: './cache-reset.component.html',
	styleUrls: ['./cache-reset.component.scss']
})
export class CacheResetComponent implements OnInit {

	constructor(private readonly cacheResetService: CacheResetService) {
	}

	ngOnInit(): void {
	}

	resetCache() {
		this.cacheResetService.resetCache();
	}

}
