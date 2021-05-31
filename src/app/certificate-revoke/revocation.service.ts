import {Injectable} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {Observable} from 'rxjs';
import {RevokeDto} from 'shared/model';

@Injectable({
	providedIn: 'root'
})
export class RevocationService {
	private readonly revokeApi: string = 'revocation';

	constructor(private readonly http: ApiService) {}

	revoke(uvci: RevokeDto): Observable<void> {
		return this.http.post<void>(this.revokeApi, uvci);
	}
}
