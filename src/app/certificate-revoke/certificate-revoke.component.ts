import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RevocationService} from './revocation.service';
import {ObNotificationService} from '@oblique/oblique';
import {RevocationStatus} from "shared/model";

@Component({
	selector: 'ec-certificate-revoke',
	templateUrl: './certificate-revoke.component.html',
	styleUrls: ['./certificate-revoke.component.scss']
})
export class CertificateRevokeComponent implements OnInit, OnDestroy {
	revocationForm: FormGroup;
	revoked: boolean;
	previouslyRevoked: boolean;
	revocationDate: Date;
	uvciUsed: string;
	isFraud = false;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly revocationService: RevocationService,
		private readonly notificationService: ObNotificationService
	) {}

	ngOnInit(): void {
		this.revoked = false;
		this.previouslyRevoked = false;
		this.revocationDate = undefined;
		this.uvciUsed = undefined;
		this.isFraud = false;
		this.createRevocationForm();
	}

	ngOnDestroy(): void {
		this.notificationService.clearAll();
	}

	revoke(): void {
		this.revoked = false;
		this.previouslyRevoked = false;
		if (this.revocationForm.valid) {
			this.uvciUsed = this.revocationForm.get('uvci').value;

			this.callRevocation();
		}
	}

	toggleFraud() {
		this.isFraud = !this.isFraud;
	}

	private createRevocationForm(): void {
		this.revocationForm = this.formBuilder.group({
			uvci: ['', [Validators.required, Validators.minLength(39), Validators.maxLength(39)]],
			isFraud: []
		});
	}

	private callRevocation(): void {
		this.revocationService
			.revoke({uvci: this.uvciUsed, fraud: this.isFraud, systemSource: 'WebUI'})
			.subscribe(response => {
				if(response?.status === RevocationStatus.OK) {
					this.previouslyRevoked = false;
					this.revoked = true;
				} else {
					this.revoked = false;
					this.previouslyRevoked = true;
					this.revocationDate = response?.revocationDateTime;
				}
			});
	}
}
