import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from 'shared/api.service';
import {CertificateCreateDto, CreateCertificateResponse, Patient, Shipping, ValueSetsResponse} from './model';
import {CertificateCreateDtoMappingService} from '../create/utils/certificate-create-dto-mapping.service';

@Injectable({
	providedIn: 'root'
})
export class CertificateService {
	private readonly covidCertificateApi = 'covidcertificate';
	private readonly valueSetsApi = 'valuesets';

	constructor(
		private readonly http: ApiService,
		private readonly dtoMappingService: CertificateCreateDtoMappingService
	) {}

	createCertificate(patient: Patient, shipping: Shipping): Observable<CreateCertificateResponse> {
		// the api endpoint is infered from the certificate type of the patient
		// change GenerationType string value in model.ts to change the api endpoint of each type
		const certificateType: string = patient.certificateType;
		const patientDto: CertificateCreateDto = this.dtoMappingService.mapCreationDataToDto(patient, shipping);
		return this.http.post(`${this.covidCertificateApi}/${certificateType}`, patientDto);
	}

	getValueSets(): Observable<ValueSetsResponse> {
		return this.http.get<ValueSetsResponse>(this.valueSetsApi);
	}

	PDFtoBlob(dataURI: string): Blob {
		const byteString = atob(dataURI.split(',')[1]);

		// write the bytes of the string to an ArrayBuffer
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const uint8Array = new Uint8Array(arrayBuffer);
		for (let i = 0; i < byteString.length; i++) {
			uint8Array[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		return new Blob([arrayBuffer], {type: 'application/pdf'});
	}
}
