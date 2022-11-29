import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OtpComponent} from './otp.component';
import {of} from 'rxjs';
import {OtpService} from './otp.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

describe('OtpComponent', () => {
	let component: OtpComponent;
	let fixture: ComponentFixture<OtpComponent>;

	const mockOtpService = {
		generateOtp: jest.fn().mockReturnValue(of('42'))
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			declarations: [OtpComponent],
			providers: [
				{
					provide: OtpService,
					useValue: mockOtpService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OtpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have no otp set after init', () => {
		expect(component.otp).toBeNull();
	});

	it('should call the OtpService for generating a one time password', () => {
		component.generateOtp();
		expect(mockOtpService.generateOtp).toHaveBeenCalledTimes(1);
	});

	it('should have an otp after calling for generation', () => {
		component.generateOtp();
		expect(component.otp).toBe('42');
	});
});
