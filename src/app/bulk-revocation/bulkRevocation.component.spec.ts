import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BulkRevocationComponent} from './bulkRevocation.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {BulkRevocationService} from './bulkRevocation.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

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
			imports: [NoopAnimationsModule, ObliqueTestingModule, ReactiveFormsModule, MatSelectModule],
			declarations: [BulkRevocationComponent],
			providers: [
				{
					provide: BulkRevocationService,
					useValue: mockUploadService
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

	it('should call the BulkRevocationService for uploading the selected file', () => {
		component.onFileSelected({target: {files: [new File([], 'test-file')]}});
		component.uploadSelectedFile();
		expect(mockUploadService.uploadSelectedFile).toHaveBeenCalledTimes(1);
	});

	describe('Certificate types for CSV', () => {
		it('should have 5 certificate types for selection', () => {
			expect(component.getCsvCertificateTypes().length).toBe(6);
		});
	});
});
