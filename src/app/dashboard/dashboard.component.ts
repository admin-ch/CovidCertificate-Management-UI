import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthFunction} from '../auth/auth.service';

@Component({
	selector: 'ec-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	AuthFunction: typeof AuthFunction = AuthFunction;

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
