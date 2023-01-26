import {Component} from '@angular/core';
import {CacheResetService, Caches} from './cache-reset.service';

type Checklist = { value: Caches; isSelected: boolean }[];

@Component({
	selector: 'ec-cache-reset',
	templateUrl: './cache-reset.component.html',
	styleUrls: ['./cache-reset.component.scss']
})
export class CacheResetComponent {
	masterSelected: boolean;
	checklist: Checklist;
	allUnselected = true;

	constructor(private readonly cacheResetService: CacheResetService) {
		this.masterSelected = null;
		this.checklist = [
			{value: Caches.KeyIdentifier, isSelected: false},
			{value: Caches.SigningInformation, isSelected: false},
			{value: Caches.Rapidtests, isSelected: false},
			{value: Caches.IssuableRapidtests, isSelected: false},
			{value: Caches.Vaccines, isSelected: false},
			{value: Caches.IssuableVaccines, isSelected: false},
			{value: Caches.ApiIssuableVaccines, isSelected: false},
			{value: Caches.WebIssuableVaccines, isSelected: false},
			{value: Caches.Valuesets, isSelected: false},
			{value: Caches.ExtendedValuesets, isSelected: false},
			{value: Caches.IssuableVaccineDTO, isSelected: false},
			{value: Caches.IssuableTestDTO, isSelected: false},
			{value: Caches.CountryCodes, isSelected: false},
			{value: Caches.CountryCodeByLanguage, isSelected: false}
		];
	}

	checkUncheckAll() {
		for (const value of this.checklist) {
			value.isSelected = this.masterSelected;
		}
		this.allUnselected = !this.masterSelected;
		this.masterSelected = null;
	}

	isAllSelected() {
		this.allUnselected = this.checklist.every(item => item.isSelected === false);
		let allSelected = this.checklist.every(item => item.isSelected);
		if (!allSelected && this.masterSelected) {
			this.masterSelected = null;
		} else if (allSelected && this.masterSelected === false || allSelected && this.masterSelected === null) {
			this.masterSelected = true;
		}
	}

	resetCache() {
		this.cacheResetService.resetCache(this.checklist.filter(item => item.isSelected).map(a => a.value));
	}
}
