import {Injectable} from '@angular/core';
import {ApiService} from "shared/api.service";

@Injectable({
	providedIn: 'root'
})
export class CacheResetService {

	constructor(private readonly http: ApiService) {
	}

	resetCache() {
		this.http.post("clear", null ).subscribe();
	}
}
