import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CertificateService} from 'shared/certificate.service';
import {BulkRevocationComponent} from './bulkRevocation.component';
import {BulkRevocationService} from './bulkRevocation.service';
import {TranslateModule} from '@ngx-translate/core';

describe('UploadComponent', () => {
	let component: BulkRevocationComponent;
	let fixture: ComponentFixture<BulkRevocationComponent>;

	const mockUploadService = {
		uploadSelectedFile: jest.fn().mockReturnValue(of({}))
	};

	const mockCertificateService = {
		verifyFeatureAvailability: jest.fn().mockReturnValue(true),
		getFeatureToggleSets: jest.fn().mockReturnValue(of({}))
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoopAnimationsModule, ReactiveFormsModule, MatSelectModule, TranslateModule.forRoot()],
			declarations: [BulkRevocationComponent],
			providers: [
				{
					provide: BulkRevocationService,
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
		fixture = TestBed.createComponent(BulkRevocationComponent);
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
		expect(component.canUploadFile()).toBeTruthy();
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
});
