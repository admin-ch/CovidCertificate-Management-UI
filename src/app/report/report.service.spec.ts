import {TestBed} from '@angular/core/testing';
import {ReportService} from './report.service';
import {ReactiveFormsModule} from '@angular/forms';

describe('ReportService', () => {
	let service: ReportService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule]
		});
		service = TestBed.inject(ReportService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
