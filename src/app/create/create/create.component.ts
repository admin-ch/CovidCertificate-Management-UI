import {Component, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {ValueSetsService} from '../utils/value-sets.service';
import {CertificateService} from 'shared/certificate.service';
import {CreationDataService} from '../utils/creation-data.service';
import {GenerationType} from 'shared/model';
import {FeatureToggleService} from "shared/feature.toggle.service";

@Component({
	selector: 'ec-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;

	selectedForm: GenerationType;
	valueSetsLoaded = false;
	featureToggleSetsLoaded = false;

	constructor(
		private readonly valueSetsService: ValueSetsService,
		private readonly certificateService: CertificateService,
		private readonly featureToggleService: FeatureToggleService,
		private readonly dataService: CreationDataService
	) {
	}

	ngOnInit() {
		this.certificateService.getValueSets().subscribe(valueSetsResponse => {
			this.valueSetsService.setValueSets(valueSetsResponse);
			this.valueSetsLoaded = true;
		});

		this.featureToggleService.getFeatureToggle().subscribe(featureToggleGroup => {
			console.log('featureToggleGroup: ' + featureToggleGroup);
			//	this.featureToggleService.setFeatureToggleGroup(featureToggleGroup);
			//	this.featureToggleSetsLoaded = true;
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
