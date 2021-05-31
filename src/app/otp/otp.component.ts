import {Component, OnInit} from '@angular/core';
import {OtpService} from './otp.service';

@Component({
	selector: 'ec-otp',
	templateUrl: './otp.component.html',
	styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
	otp: string;

	constructor(private readonly otpService: OtpService) {}

	ngOnInit() {
		this.otp = null;
	}

	generateOtp() {
		this.otpService.generateOtp().subscribe(response => {
			this.otp = response;
		});
	}
}
