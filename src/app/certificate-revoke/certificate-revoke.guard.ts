import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, CanLoad} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthFunction} from '../auth/auth.service';
import {BaseGuard} from 'shared/base.guard';

@Injectable({
	providedIn: 'root'
})
export class CertificateRevokeGuard implements CanActivate, CanActivateChild, CanLoad {
	constructor(private readonly baseGuard: BaseGuard) {}

	canActivate(): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.CERTIFICATE_REVOCATION);
	}

	canActivateChild(): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.CERTIFICATE_REVOCATION);
	}

	canLoad(): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.CERTIFICATE_REVOCATION);
	}
}
