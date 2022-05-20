import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BulkRevocationService} from './bulkRevocation.service';
import {GenerationType} from 'shared/model';
import {ObNotificationService} from '@oblique/oblique';
import {CertificateService} from 'shared/certificate.service';

@Component({
	selector: 'ec-upload',
	templateUrl: './bulkRevocation.component.html',
	styleUrls: ['./bulkRevocation.component.scss']
})
export class BulkRevocationComponent implements OnInit {
	@ViewChild('fileBulkRevocationUpload') fileBulkRevocationUpload: ElementRef;

	private selectedFile: File;
	private readonly maxFileSize: number = 40000;

	constructor(
		private readonly bulkRevocationService: BulkRevocationService,
		private readonly notificationService: ObNotificationService,
		private readonly certificateService: CertificateService
	) {
	}

	private static downloadCsv(csvToDownload: string): void {
		if (csvToDownload) {
			const linkSource = `data:text/csv;base64,${csvToDownload}`;
			const encodedUri = encodeURI(linkSource);

			const link = document.createElement('a');
			link.setAttribute('href', encodedUri);
			link.setAttribute('download', `covid-certificate-revocation-report-${Date.now()}.csv`);

			document.body.appendChild(link);

			link.click();
			link.remove();
		}
	}

	ngOnInit(): void {
		this.certificateService.getFeatureToggleSets().subscribe(featureToggleGroup => {
			this.certificateService.setFeatureToggleSets(featureToggleGroup);
		});
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
		const result = !!this.selectedFile
		return result;
	}

	getSelectedFileName(): string {
		return this.selectedFile?.name;
	}

	getCsvCertificateTypes(): GenerationType[] {
		return Object.values(GenerationType)
			.filter(elem => elem !== GenerationType.EXCEPTIONAL)
			.filter(elem => this.certificateService.verifyFeatureAvailability(elem));
	}

	uploadSelectedFile(): void {
		this.bulkRevocationService
			.uploadSelectedFile(this.selectedFile)
			.subscribe(
				response => {
					BulkRevocationComponent.downloadCsv(response?.csv);
					if (response?.uvcisWithErrorMessageCount === 0) {
						this.notificationService.success('bulk.revocation.success');
					} else {
						this.notificationService.warning('bulk.revocation.warning');
					}
				},
				error => {
					console.log(error)
				}, () => {
					this.resetSelectedFile();
				}
			)
	}

	private resetSelectedFile(): void {
		this.fileBulkRevocationUpload.nativeElement.value = '';
		this.selectedFile = null;
	}
}
