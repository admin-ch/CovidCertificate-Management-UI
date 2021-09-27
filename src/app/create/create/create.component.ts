import {Component, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {ValueSetsService} from '../utils/value-sets.service';
import {CertificateService} from 'shared/certificate.service';
import {forkJoin} from 'rxjs';
import {CreationDataService} from '../utils/creation-data.service';
import {GenerationType} from 'shared/model';

@Component({
	selector: 'ec-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;

	selectedForm: GenerationType;
	valueSetsLoaded = false;

	constructor(
		private readonly valueSetsService: ValueSetsService,
		private readonly certificateService: CertificateService,
		private readonly dataService: CreationDataService
	) {}

	ngOnInit() {
		forkJoin([this.certificateService.getValueSets(), this.certificateService.getIssuableVaccines()]).subscribe(results => {
			this.valueSetsService.setValueSets(results[0], results[1]);
			this.valueSetsLoaded = true;
		});

		this.dataService.certificateTypeChanged.subscribe(certificateType => {
			this.selectedForm = certificateType;
		});
	}

	backCalled(): void {
		this.stepper.previous();
	}

	nextCalled(): void {
		this.stepper.next();
	}

	resetCalled(): void {
		this.stepper.reset();
	}
}
