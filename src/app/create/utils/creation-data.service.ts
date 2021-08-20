import {Injectable} from '@angular/core';
import {CreateCertificateResponse, GenerationType, Patient, Shipping} from 'shared/model';
import {Subject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CreationDataService {
	certificateTypeChanged: Subject<GenerationType> = new Subject<GenerationType>();
	patientChanged: Subject<Patient> = new Subject<Patient>();
	shippingChanged: Subject<Shipping> = new Subject<Shipping>();
	createCertificateResponseChanged: Subject<CreateCertificateResponse> = new Subject<CreateCertificateResponse>();
	resetCalled: Subject<boolean> = new Subject<boolean>();

	setNewCertificateType(certificateType: GenerationType) {
		this.certificateTypeChanged.next(certificateType);
	}

	setNewPatient(patient: Patient) {
		this.patientChanged.next(patient);
	}

	setNewShipping(shipping: Shipping) {
		this.shippingChanged.next(shipping);
	}

	setNewCreateCertificateResponse(createCertificateResponse: CreateCertificateResponse) {
		this.createCertificateResponseChanged.next(createCertificateResponse);
	}

	emitResetCalled(): void {
		this.resetCalled.next(true);
	}
}
