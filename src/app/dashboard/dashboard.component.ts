import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CertificateService} from "shared/certificate.service";

@Component({
	selector: 'ec-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	constructor(
		private readonly router: Router,
		private readonly certificateService: CertificateService
	) {
	}

	ngOnInit() {
		this.certificateService.getFeatureToggleSets().subscribe(featureToggleGroup => {
			this.certificateService.setFeatureToggleSets(featureToggleGroup);
		});
	}

	goToCertificateCreate() {
		this.router.navigateByUrl('certificate-create');
	}

	goToCertificateRevoke() {
		this.router.navigateByUrl('certificate-revoke');
	}

	goToGenerateOtp() {
		this.router.navigateByUrl('otp');
	}

	goToGenerateMultipleCertificates() {
		this.router.navigateByUrl('upload');
	}
}
