import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CertificateRevokeComponent} from './certificate-revoke.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {RevocationService} from './revocation.service';
import {TranslateModule} from '@ngx-translate/core';

describe('CertificateRevokeComponent', () => {
	let component: CertificateRevokeComponent;
	let fixture: ComponentFixture<CertificateRevokeComponent>;

	const mockRevocationService = {
		revoke: jest.fn().mockReturnValue(of({status: 'OK'}))
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot(), ReactiveFormsModule],
			declarations: [CertificateRevokeComponent],
			providers: [
				{
					provide: RevocationService,
					useValue: mockRevocationService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CertificateRevokeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have no uvci used after init', () => {
		expect(component.uvciUsed).toBeUndefined();
	});

	it('should mark revoked to false after init', () => {
		expect(component.revoked).toBeFalsy();
	});

	it('should not call the RevocationService for revoking a certificate if the uvci is invalid', () => {
		component.revocationForm.get('uvci').setValue('42');
		component.revoke();
		expect(mockRevocationService.revoke).toHaveBeenCalledTimes(0);
	});

	it('should call the RevocationService for revoking a certificate if the uvci is valid', () => {
		component.revocationForm.get('uvci').setValue('01:CH:123456789123456789123456123456789');
		component.revoke();
		expect(mockRevocationService.revoke).toHaveBeenCalledTimes(1);
	});

	it('should call the RevocationService for revoking a certificate if the uvci is valid with fraud uvci', () => {
		component.revocationForm.get('isFraud').setValue(true);
		component.revocationForm.get('uvci').setValue('01:CH:123456789123456789123456123456789');
		component.revoke();
		expect(mockRevocationService.revoke).toHaveBeenCalledTimes(2);
	});

	it('should not mark revoked to true after calling for revocation if the uvci is invalid', () => {
		component.revocationForm.get('uvci').setValue('42');
		component.revoke();
		expect(component.revoked).toBeFalsy();
	});

	it('should mark revoked to true after calling for revocation if the uvci is valid', () => {
		component.revocationForm.get('uvci').setValue('01:CH:123456789123456789123456123456789');
		component.revoke();
		expect(component.revoked).toBeTruthy();
	});

	it('should not set the uvci used after calling for revocation if the uvci is invalid', () => {
		component.revocationForm.get('uvci').setValue('42');
		component.revoke();
		expect(component.uvciUsed).toBeUndefined();
	});

	it('should set the uvci used after calling for revocation if the uvci is valid', () => {
		component.revocationForm.get('uvci').setValue('01:CH:123456789123456789123456123456789');
		component.revoke();
		expect(component.uvciUsed).toEqual('01:CH:123456789123456789123456123456789');
	});
});
