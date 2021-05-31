import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RevocationService} from './revocation.service';
import {ObNotificationService} from '@oblique/oblique';

@Component({
	selector: 'ec-certificate-revoke',
	templateUrl: './certificate-revoke.component.html',
	styleUrls: ['./certificate-revoke.component.scss']
})
export class CertificateRevokeComponent implements OnInit, OnDestroy {
	revocationForm: FormGroup;
	revoked: boolean;
	uvciUsed: string;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly revocationService: RevocationService,
		private readonly notificationService: ObNotificationService
	) {}

	ngOnInit(): void {
		this.revoked = false;
		this.uvciUsed = undefined;
		this.createRevocationForm();
	}

	ngOnDestroy(): void {
		this.notificationService.clearAll();
	}

	revoke(): void {
		this.revoked = false;
		if (this.revocationForm.valid) {
			this.uvciUsed = this.revocationForm.get('uvci').value;
			this.callRevocation();
		}
	}

	private createRevocationForm(): void {
		this.revocationForm = this.formBuilder.group({
			uvci: ['', [Validators.required, Validators.minLength(39), Validators.maxLength(39)]]
		});
	}

	private callRevocation(): void {
		this.revocationService.revoke({uvci: this.uvciUsed}).subscribe(() => {
			this.revoked = true;
		});
	}
}
