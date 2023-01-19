import {Injectable} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {ObNotificationService} from "@oblique/oblique";

@Injectable({
	providedIn: 'root'
})
export class CacheResetService {
	constructor(private readonly http: ApiService,
				private readonly notificationService: ObNotificationService) {
	}

	resetCache(selectedCaches: any) {
		this.http.post('caches/clear', selectedCaches).subscribe(() => {
			this.notificationService.success(" ");
		});
	}
}
