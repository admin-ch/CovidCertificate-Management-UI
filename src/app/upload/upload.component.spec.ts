import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UploadComponent} from './upload.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {UploadService} from './upload.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {GenerationType} from 'shared/model';
import {CertificateService} from 'shared/certificate.service';

describe('UploadComponent', () => {
	let component: UploadComponent;
	let fixture: ComponentFixture<UploadComponent>;

	const mockUploadService = {
		uploadSelectedFile: jest.fn().mockReturnValue(of({}))
	};

	const mockCertificateService = {
		verifyFeatureAvailability: jest.fn().mockReturnValue(true),
		getFeatureToggleSets: jest.fn().mockReturnValue(of({}))
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoopAnimationsModule, ObliqueTestingModule, ReactiveFormsModule, MatSelectModule],
			declarations: [UploadComponent],
			providers: [
				{
					provide: UploadService,
					useValue: mockUploadService
				},
				{
					provide: CertificateService,
					useValue: mockCertificateService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not be able to upload after init', () => {
		expect(component.canUploadFile()).toBeFalsy();
	});

	it('should not have a selected file name after init', () => {
		expect(component.getSelectedFileName()).toBeUndefined();
	});

	it('should be able to upload after a file has been selected', () => {
		component.onFileSelected({target: {files: [new File([], 'test-file')]}});
		component.certificateTypeSelectionForm.get('type').setValue(GenerationType.VACCINATION);
		expect(component.canUploadFile()).toBeTruthy();
	});

	it('should not be able to upload if a file has been selected but not the type', () => {
		component.onFileSelected({target: {files: [new File([], 'test-file')]}});
		component.certificateTypeSelectionForm.get('type').setValue(null);
		expect(component.canUploadFile()).toBeFalsy();
	});

	it('should have a selected file name after a file has been selected', () => {
		component.onFileSelected({target: {files: [new File([], 'test-file')]}});
		expect(component.getSelectedFileName()).toBe('test-file');
	});

	it('should call the UploadService for uploading the selected file', () => {
		component.onFileSelected({target: {files: [new File([], 'test-file')]}});
		component.uploadSelectedFile();
		expect(mockUploadService.uploadSelectedFile).toHaveBeenCalledTimes(1);
	});

	describe('Certificate types for CSV', () => {
		it('should have 5 certificate types for selection', () => {
			expect(component.getCsvCertificateTypes().length).toBe(6);
		});

		it('should have VACCINATION as certificate types for selection', () => {
			expect(component.getCsvCertificateTypes()[0]).toBe(GenerationType.VACCINATION);
		});

		it('should have TEST as certificate types for selection', () => {
			expect(component.getCsvCertificateTypes()[1]).toBe(GenerationType.TEST);
		});

		it('should have RECOVERY as certificate types for selection', () => {
			expect(component.getCsvCertificateTypes()[2]).toBe(GenerationType.RECOVERY);
		});

		it('should have RECOVERY as certificate types for selection', () => {
			expect(component.getCsvCertificateTypes()[3]).toBe(GenerationType.RECOVERY_RAT);
		});

		it('should have VACCINATION as certificate types for selection', () => {
			expect(component.getCsvCertificateTypes()[4]).toBe(GenerationType.ANTIBODY);
		});

		it('should have TOURIST_VACCINATION as certificate types for selection', () => {
			expect(component.getCsvCertificateTypes()[5]).toBe(GenerationType.VACCINATION_TOURIST);
		});
	});
});
