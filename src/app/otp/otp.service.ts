import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from 'shared/api.service';

@Injectable({
	providedIn: 'root'
})
export class OtpService {
	private readonly otpApi: string = 'otp';

	constructor(private readonly http: ApiService) {}

	generateOtp(): Observable<string> {
		return this.http.postText(this.otpApi, null);
	}
}
