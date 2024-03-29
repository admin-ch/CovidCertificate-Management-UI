import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DownloadComponent} from './download.component';
import {CertificateService} from 'shared/certificate.service';
import {TranslateModule} from '@ngx-translate/core';

describe('DownloadComponent', () => {
	let component: DownloadComponent;
	let fixture: ComponentFixture<DownloadComponent>;

	const mockCertificateService = {
		PDFtoBlob: jest.fn().mockReturnValue('mockPdfBlob')
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			declarations: [DownloadComponent],
			providers: [
				{
					provide: CertificateService,
					useValue: mockCertificateService
				}
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DownloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
