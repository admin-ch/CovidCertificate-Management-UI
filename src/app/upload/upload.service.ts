import {Injectable} from '@angular/core';
import {ApiService} from 'shared/api.service';
import {Observable} from 'rxjs';
import {CsvResponseDto, GenerationType} from 'shared/model';

@Injectable({
	providedIn: 'root'
})
export class UploadService {
	private readonly uploadApi: string = 'covidcertificate/csv';

	constructor(private readonly http: ApiService) {}

	uploadSelectedFile(fileToUpload: File, certificateType: GenerationType): Observable<CsvResponseDto> {
		const formData = new FormData();

		formData.append('file', fileToUpload);
		formData.append('certificateType', certificateType);

		return this.http.post(this.uploadApi, formData);
	}
}
