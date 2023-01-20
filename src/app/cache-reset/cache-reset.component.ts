import {Component} from '@angular/core';
import {CacheResetService} from './cache-reset.service';

@Component({
	selector: 'ec-cache-reset',
	templateUrl: './cache-reset.component.html',
	styleUrls: ['./cache-reset.component.scss']
})
export class CacheResetComponent {
	constructor(private readonly cacheResetService: CacheResetService) {
		this.masterSelected = false;
		this.checklist = [
			{value: 'KeyIdentifier', isSelected: false},
			{value: 'SigningInformation', isSelected: false},
			{value: 'Rapidtests', isSelected: false},
			{value: 'IssuableRapidtests', isSelected: false},
			{value: 'Vaccines', isSelected: false},
			{value: 'IssuableVaccines', isSelected: false},
			{value: 'ApiIssuableVaccines', isSelected: false},
			{value: 'WebIssuableVaccines', isSelected: false},
			{value: 'Valuesets', isSelected: false},
			{value: 'ExtendedValuesets', isSelected: false},
			{value: 'IssuableVaccineDTO', isSelected: false},
			{value: 'IssuableTestDTO', isSelected: false},
			{value: 'CountryCodes', isSelected: false},
			{value: 'CountryCodeByLanguage', isSelected: false}
		];
		this.getCheckedItemList();
	}

	masterSelected: boolean;
	checkedList: any;
	checklist: any;

	// The master checkbox will check/ uncheck all items
	checkUncheckAll() {
		for (let value of this.checklist) {
			value.isSelected = this.masterSelected;
		}
		this.getCheckedItemList();
	}

	// Check All Checkbox Checked
	isAllSelected() {
		this.masterSelected = this.checklist.every(function (item: any) {
			return item.isSelected == true;
		})
		this.getCheckedItemList();
	}

	// Get List of Checked Items
	getCheckedItemList() {
		this.checkedList = [];
		for (let value of this.checklist) {
			this.checkedList = this.checklist.filter(value => value.isSelected);
		}
		this.checkedList = JSON.stringify(this.checkedList.map(a => a.value));
	}

	resetCache() {
		this.cacheResetService.resetCache(JSON.parse(this.checkedList));
		this.resetAllCheckboxes();
	}

	resetAllCheckboxes() {
		// Reset Checkboxes after submit
		for (let value of this.checklist) {
			value.isSelected = false;
		}
		this.masterSelected = false;
	}
}
