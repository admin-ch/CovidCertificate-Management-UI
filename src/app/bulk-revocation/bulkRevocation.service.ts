import {Injectable} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {Observable} from 'rxjs';
import {CsvRevocationResponseDto} from 'shared/model';

@Injectable({
	providedIn: 'root'
})
export class BulkRevocationService {
	private readonly uploadApi: string = 'revocation/csv';

	constructor(private readonly http: ApiService) {}

	uploadSelectedFile(fileToUpload: File): Observable<CsvRevocationResponseDto> {
		const formData = new FormData();
		formData.append('file', fileToUpload);
		return this.http.post(this.uploadApi, formData);
	}
}
