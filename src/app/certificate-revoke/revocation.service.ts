import {Injectable} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {Observable} from 'rxjs';
import {RevocationResponseDto, RevokeDto} from 'shared/model';

@Injectable({
	providedIn: 'root'
})
export class RevocationService {
	private readonly revokeApi: string = 'revocation';

	constructor(private readonly http: ApiService) {}

	revoke(uvci: RevokeDto): Observable<RevocationResponseDto> {
		return this.http.post<RevocationResponseDto>(this.revokeApi, uvci);
	}
}
