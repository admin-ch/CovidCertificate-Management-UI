import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'ec-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	constructor(private readonly router: Router) {}

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
