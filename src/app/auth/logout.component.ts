import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {OauthService} from './oauth.service';

@Component({
	selector: 'ec-logout',
	template: ''
})
export class LogoutComponent {
	constructor(router: Router, oauthService: OauthService) {
		oauthService.isAuthenticated$.pipe(first()).subscribe(isAuthenticated => {
			if (isAuthenticated) {
				oauthService.logout();
			} else {
				router.navigate(['/']);
			}
		});
	}
}
