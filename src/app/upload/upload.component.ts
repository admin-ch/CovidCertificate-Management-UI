import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UploadService} from './upload.service';
import {GenerationType} from 'shared/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObNotificationService} from '@oblique/oblique';

@Component({
	selector: 'ec-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
	@ViewChild('fileUpload') fileUpload: ElementRef;

	certificateTypeSelectionForm: FormGroup;

	private selectedFile: File;
	private readonly maxFileSize: number = 40000;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly uploadService: UploadService,
		private readonly notificationService: ObNotificationService
	) {}

	ngOnInit(): void {
		this.createForm();
	}

	onFileSelected(event) {
		const file: File = event.target.files[0];

		if (file) {
			if (file.size < this.maxFileSize) {
				this.selectedFile = file;
			} else {
				this.notificationService.error('upload.file.upload.size.error');
			}
		}
	}

	canUploadFile(): boolean {
		return !!this.selectedFile && this.certificateTypeSelectionForm.valid;
	}

	getSelectedFileName(): string {
		return this.selectedFile?.name;
	}

	getCertificateTypes(): GenerationType[] {
		return Object.values(GenerationType);
	}

	uploadSelectedFile(): void {
		this.uploadService
			.uploadSelectedFile(this.selectedFile, this.certificateTypeSelectionForm.get('type').value)
			.subscribe(
				response => {
					this.resetSelectedFile();
					this.downloadZip(response?.zip);
					this.notificationService.success('upload.file.upload.success');
				},
				error => {
					this.resetSelectedFile();
					this.downloadCsv(error?.error?.csv);
				}
			);
	}

	private downloadZip(zipToDownload: ArrayBuffer): void {
		if (zipToDownload) {
			const linkSource = `data:application/zip;base64,${zipToDownload}`;
			const encodedUri = encodeURI(linkSource);

			const link = document.createElement('a');
			link.setAttribute('href', encodedUri);
			link.setAttribute('download', `covid-certificates-${Date.now()}.zip`);

			document.body.appendChild(link);

			link.click();
			link.remove();
		}
	}

	private downloadCsv(csvToDownload: string): void {
		if (csvToDownload) {
			const linkSource = `data:text/csv;base64,${csvToDownload}`;
			const encodedUri = encodeURI(linkSource);

			const link = document.createElement('a');
			link.setAttribute('href', encodedUri);
			link.setAttribute('download', `covid-certificate-error-report-${Date.now()}.csv`);

			document.body.appendChild(link);

			link.click();
			link.remove();
		}
	}

	private createForm(): void {
		this.certificateTypeSelectionForm = this.formBuilder.group({
			type: [GenerationType.VACCINATION, Validators.required]
		});
	}

	private resetSelectedFile(): void {
		this.fileUpload.nativeElement.value = '';
		this.selectedFile = null;
	}
}
