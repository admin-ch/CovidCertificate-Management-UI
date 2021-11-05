import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreationDataService} from '../utils/creation-data.service';
import {CreateCertificateResponse, GenerationType} from 'shared/model';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CertificateService} from 'shared/certificate.service';

@Component({
	selector: 'ec-download',
	templateUrl: './download.component.html',
	styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
	@Output() resetEmitter = new EventEmitter<void>();
	@Input() type;

	createCertificateResponse: CreateCertificateResponse;
	safeResourceUrl: SafeResourceUrl;

	constructor(
		private readonly dataService: CreationDataService,
		private readonly sanitizer: DomSanitizer,
		private readonly certificateService: CertificateService
	) {}

	ngOnInit(): void {
		this.dataService.createCertificateResponseChanged.subscribe(createCertificateResponse => {
			this.createCertificateResponse = createCertificateResponse;
			this.safeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
				`data:image/png;base64,${this.createCertificateResponse.qrCode}`
			);
		});
	}

	downloadCertificate(): void {
		if (this.createCertificateResponse?.pdf) {
			const fileName = 'covid-certificate';
			const linkSource = `data:application/pdf;base64,${this.createCertificateResponse.pdf}`;
			const pdfBlob = this.certificateService.PDFtoBlob(linkSource);

			// Internet Explorer only
			if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(pdfBlob, `${fileName}-${Date.now()}.pdf`);
				return;
			}

			const url = window.URL.createObjectURL(pdfBlob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `${fileName}-${Date.now()}.pdf`);
			document.body.appendChild(link);
			link.click();

			link.remove();
		}
	}

	getDescription(): string {
		return this.type === GenerationType.VACCINATION
			? 'certificateCreate.step-four.description.vaccinated'
			: 'certificateCreate.step-four.description.tested';
	}

	callReset(): void {
		this.resetEmitter.emit();
	}

	isAntibodyTest(): boolean {
		return this.type === GenerationType.ANTIBODY;
	}
}
