import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SummaryComponent} from './summary.component';
import {Patient} from 'shared/model';
import {CreationDataService} from '../utils/creation-data.service';
import {of} from 'rxjs';
import {CertificateService} from 'shared/certificate.service';
import {TranslateModule} from '@ngx-translate/core';

describe('SummaryComponent', () => {
	let component: SummaryComponent;
	let fixture: ComponentFixture<SummaryComponent>;
	let creationDataService: CreationDataService;

	const patient: Patient = {
		firstName: 'John',
		surName: 'Doe',
		birthdate: new Date(2000, 0, 1),
		language: 'de'
	};

	const mockCertificateService = {
		createCertificate: jest.fn().mockReturnValue(
			of({
				pdf: 'mockPdfValue',
				qrCode: 'mockQrCodeValue',
				uvci: 'mockUVCI'
			})
		)
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			declarations: [SummaryComponent],
			providers: [
				{
					provide: CertificateService,
					useValue: mockCertificateService
				}
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SummaryComponent);
		creationDataService = TestBed.inject(CreationDataService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not set validFrom for vaccination', () => {
		patient.vaccination = {
			medicalProduct: null,
			doseNumber: 1,
			totalDoses: 1,
			dateOfVaccination: new Date(2021, 5, 1),
			countryOfVaccination: {code: 'CH', display: 'CH'}
		};

		creationDataService.setNewPatient(patient);

		expect(component.validFrom).toBeUndefined();
	});

	it('should not set validUntil for vaccination', () => {
		patient.vaccination = {
			medicalProduct: null,
			doseNumber: 1,
			totalDoses: 1,
			dateOfVaccination: new Date(2021, 5, 1),
			countryOfVaccination: {code: 'CH', display: 'CH'}
		};

		creationDataService.setNewPatient(patient);

		expect(component.validUntil).toBeUndefined();
	});

	it('should not set validFrom for test', () => {
		patient.test = {
			typeOfTest: undefined,
			manufacturer: undefined,
			sampleDate: new Date(2021, 5, 1),
			center: 'test-center',
			countryOfTest: {code: 'CH', display: 'CH'}
		};

		creationDataService.setNewPatient(patient);

		expect(component.validFrom).toBeUndefined();
	});

	it('should not set validUntil for test', () => {
		patient.test = {
			typeOfTest: undefined,
			manufacturer: undefined,
			sampleDate: new Date(2021, 5, 1),
			center: 'test-center',
			countryOfTest: {code: 'CH', display: 'CH'}
		};

		creationDataService.setNewPatient(patient);

		expect(component.validUntil).toBeUndefined();
	});

	it('should set validFrom for recovery', () => {
		patient.recovery = {
			dateFirstPositiveTestResult: new Date(2021, 4, 1),
			countryOfTest: {code: 'CH', display: 'CH'}
		};

		creationDataService.setNewPatient(patient);

		expect(component.validFrom).toEqual(new Date(2021, 4, 11));
	});

	it('should set validUntil for recovery', () => {
		patient.recovery = {
			dateFirstPositiveTestResult: new Date(2021, 4, 1),
			countryOfTest: {code: 'CH', display: 'CH'}
		};

		creationDataService.setNewPatient(patient);

		expect(component.validUntil).toEqual(new Date(2022, 3, 30));
	});

	describe('Handling of goBack()', () => {
		it('should emit back', () => {
			const backSpy = jest.spyOn(component.back, 'emit');

			component.goBack();

			expect(backSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Handling of goNext()', () => {
		it('should emit next', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the the CreationDataService for setting the certificate information', () => {
			const setNewCreateCertificateResponseSpy = jest.spyOn(creationDataService, 'setNewCreateCertificateResponse');

			component.goNext();

			expect(setNewCreateCertificateResponseSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the the CreationDataService for setting the certificate information with the correct values', () => {
			const setNewCreateCertificateResponseSpy = jest.spyOn(creationDataService, 'setNewCreateCertificateResponse');

			component.goNext();

			expect(setNewCreateCertificateResponseSpy).toHaveBeenCalledWith({
				pdf: 'mockPdfValue',
				qrCode: 'mockQrCodeValue',
				uvci: 'mockUVCI'
			});
		});
	});
});
