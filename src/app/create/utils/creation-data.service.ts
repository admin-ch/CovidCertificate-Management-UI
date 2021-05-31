import {Injectable} from '@angular/core';
import {CreateCertificateResponse, GenerationType, Patient} from 'shared/model';
import {Subject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CreationDataService {
	certificateTypeChanged: Subject<GenerationType> = new Subject<GenerationType>();
	patientChanged: Subject<Patient> = new Subject<Patient>();
	createCertificateResponseChanged: Subject<CreateCertificateResponse> = new Subject<CreateCertificateResponse>();
	resetCalled: Subject<boolean> = new Subject<boolean>();

	setNewCertificateType(certificateType: GenerationType) {
		this.certificateTypeChanged.next(certificateType);
	}

	setNewPatient(patient: Patient) {
		this.patientChanged.next(patient);
	}

	setNewCreateCertificateResponse(createCertificateResponse: CreateCertificateResponse) {
		this.createCertificateResponseChanged.next(createCertificateResponse);
	}

	emitResetCalled(): void {
		this.resetCalled.next(true);
	}
}
