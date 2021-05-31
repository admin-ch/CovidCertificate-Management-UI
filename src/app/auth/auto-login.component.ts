import {Component} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
	selector: 'ec-auto-component',
	templateUrl: './empty.component.html'
})
export class AutoLoginComponent {
	constructor(securityService: OidcSecurityService) {
		securityService.authorize();
	}
}
