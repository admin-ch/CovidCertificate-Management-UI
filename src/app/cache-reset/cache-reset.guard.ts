import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, CanLoad} from '@angular/router';
import {Observable} from 'rxjs';
import {BaseGuard} from 'shared/base.guard';
import {AuthFunction} from '../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class CacheResetGuard implements CanActivate, CanActivateChild, CanLoad {
	constructor(private readonly baseGuard: BaseGuard) {
	}

	canActivate(): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.MAIN_CACHE_MANAGEMENT);
	}

	canActivateChild(): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.MAIN_CACHE_MANAGEMENT);
	}

	canLoad(): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.MAIN_CACHE_MANAGEMENT);
	}
}
