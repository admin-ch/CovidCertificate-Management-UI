import {Injectable} from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	Route,
	RouterStateSnapshot,
	UrlSegment
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthFunction} from '../auth/auth.service';
import {BaseGuard} from 'shared/base.guard';

@Injectable({
	providedIn: 'root'
})
export class ReportGuard implements CanActivate, CanActivateChild, CanLoad {
	constructor(private readonly baseGuard: BaseGuard) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.REPORTING_SELF_SERVICE);
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.REPORTING_SELF_SERVICE);
	}

	canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
		return this.baseGuard.checkExpectedRole(AuthFunction.REPORTING_SELF_SERVICE);
	}
}
