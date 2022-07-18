import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {UnitSearchComponent, UnitTree} from './unit-search.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChange} from "@angular/core";
import {ObliqueTestingModule} from "@oblique/oblique";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {EiamProfile, SelectedProfilesService} from "../selected-profiles.service";
import {MatTreeModule} from "@angular/material/tree";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {FormArray} from "@angular/forms";

describe('UnitSearchComponent', () => {
	let component: UnitSearchComponent;
	let fixture: ComponentFixture<UnitSearchComponent>;
	let http: HttpClient
	let translateService: TranslateService
	let selectedProfilesService: SelectedProfilesService

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, TranslateModule, HttpClientTestingModule, TranslateModule.forRoot(), MatTableModule, MatTreeModule],
			declarations: [UnitSearchComponent],
			providers: [
				{provide: 'REPORT_HOST', useValue: 'REPORT_HOST'},
				{provide: SelectedProfilesService, useValue: new SelectedProfilesService()},
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],

		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UnitSearchComponent);
		component = fixture.componentInstance;

		http = TestBed.inject(HttpClient)
		translateService = TestBed.inject(TranslateService)
		selectedProfilesService = TestBed.inject(SelectedProfilesService)

		component.userIdsFormArray = new FormArray([])

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnChanges', () => {
		let post: jest.SpyInstance

		beforeEach(() => {
			post = jest.spyOn(http, 'post')
			post.mockReturnValue(of({}))
			const currentLang = jest.spyOn(translateService, 'currentLang', 'get')
			currentLang.mockReturnValue('de')
			component.authority = 'buv'
		})

		it('should perform post request if its the first change', () => {
			component.ngOnChanges({authority: new SimpleChange('de', 'de', true)})

			expect(post).toHaveBeenCalledWith("REPORT_HOST/api/v2/unit/tree", {authority: 'buv', language: 'de'})
		});

		it('should perform post request if authority has changed', () => {
			component.ngOnChanges({authority: new SimpleChange('be', 'buv', false)})

			expect(post).toHaveBeenCalledWith("REPORT_HOST/api/v2/unit/tree", {authority: 'buv', language: 'de'})
		});

		it('should not perform post request if authority is null', () => {
			component.ngOnChanges({authority: new SimpleChange('be', null, true)})

			expect(post).not.toHaveBeenCalled()
		});

		describe('in subscribe', () => {
			let sentUnitTree: UnitTree
			beforeEach(() => {
				sentUnitTree = {
					id: '1',
					name: '1',
					children: [
						{
							id: '1.1',
							name: '1.1',
							children: [
								{
									id: '1.1.1',
									name: '1.1.1',
									children: []
								},
								{
									id: '1.1.2',
									name: '1.1.2',
									children: []
								},
								{
									id: '1.1.3',
									name: '1.1.3',
									children: []
								},
							]
						},

						{
							id: '1.2',
							name: '1.2',
							children: [
								{
									id: '1.2.1',
									name: '1.2.1',
									children: []
								},
								{
									id: '1.2.2',
									name: '1.2.2',
									children: []
								},
								{
									id: '1.2.3',
									name: '1.2.3',
									children: []
								},
							]
						},
					]
				}
				post.mockReturnValue(of(sentUnitTree))
			})

			it('should set parents of unit trees', fakeAsync(() => {
				component.ngOnChanges({authority: new SimpleChange('buv', 'be', true)})

				tick()

				const expectCorrectParents = (unitTree: UnitTree, expectedParent: UnitTree) => {
					expect(unitTree.parent).toBe(expectedParent)
					unitTree.children.forEach(child => expectCorrectParents(child, unitTree))
				}
			}));

			it('should treeDataSource.data', fakeAsync(() => {
				component.ngOnChanges({authority: new SimpleChange('buv', 'be', true)})

				tick()

				expect(component.treeDataSource.data).toBe(sentUnitTree.children)
			}));

			it('should set isUnitTreeLoading to false', fakeAsync(() => {
				component.isUnitTreeLoading = true;
				component.ngOnChanges({authority: new SimpleChange('buv', 'be', true)})

				tick()

				expect(component.isUnitTreeLoading).toBe(false)
			}));
		});
	});



	describe('setHiddenBySearchValue', () => {
		it.each([
			/** case 1 */
			[
				// expected
				[{
					id: '__1',
					name: '__1',
					hidden: false,
					parent: expect.anything(),
					children: [
						{
							id: '__1.1',
							name: '__1.1',
							hidden: false,
							parent: expect.anything(),
							children: [
								{
									id: '__1.1.1',
									name: '__1.1.1',
									hidden: false,
									parent: expect.anything(),
									children: []
								},
							]
						},
					]
				}],
				// unitTree
				{
					id: '__0',
					name: '__0',
					children: [{
						id: '__1',
						name: '__1',
						children: [
							{
								id: '__1.1',
								name: '__1.1',
								children: [
									{
										id: '__1.1.1',
										name: '__1.1.1',
										children: []
									},
								]
							},
						]
					}]
				},
				// searchValue
				'1.1.1'
			],

			/** case 2 */
			[
				// expected
				[{
					id: '__1',
					name: '__1',
					hidden: false,
					parent: expect.anything(),
					children: [
						{
							id: '__1.1',
							name: '__1.1',
							hidden: false,
							parent: expect.anything(),
							children: [
								{
									id: '__1.1.1',
									name: '__1.1.1',
									hidden: false,
									parent: expect.anything(),
									children: []
								},
							]
						},
					]
				}],
				// unitTree
				{
					id: '__0',
					name: '__0',
					children: [{
						id: '__1',
						name: '__1',
						children: [
							{
								id: '__1.1',
								name: '__1.1',
								children: [
									{
										id: '__1.1.1',
										name: '__1.1.1',
										children: []
									},
								]
							},
						]
					}]
				},
				// searchValue
				'__1'
			],

			/** case 3 */
			[
				// expected
				[{
					id: '__1',
					name: '__1',
					hidden: true,
					parent: expect.anything(),
					children: [
						{
							id: '__1.1',
							name: '__1.1',
							hidden: true,
							parent: expect.anything(),
							children: [
								{
									id: '__1.1.1',
									name: '__1.1.1',
									hidden: true,
									parent: expect.anything(),
									children: []
								},
							]
						},
					]
				}],
				// unitTree
				{
					id: '__0',
					name: '__0',
					children: [{
						id: '__1',
						name: '__1',
						children: [
							{
								id: '__1.1',
								name: '__1.1',
								children: [
									{
										id: '__1.1.1',
										name: '__1.1.1',
										children: []
									},
								]
							},
						]
					}]
				},
				// searchValue
				'___'
			],

			/** case 4 */
			[
				// expected
				[{
					id: '__1',
					name: '__1',
					hidden: false,
					parent: expect.anything(),
					children: [
						{
							id: '__1.1',
							name: '__1.1',
							hidden: true,
							parent: expect.anything(),
							children: [
								{
									id: '__1.1.1',
									name: '__1.1.1',
									hidden: true,
									parent: expect.anything(),
									children: []
								},
							]
						},
						{
							id: '__1.2',
							name: '__1.2',
							hidden: false,
							parent: expect.anything(),
							children: [
								{
									id: '__1.2.1',
									name: '__1.2.1',
									hidden: false,
									parent: expect.anything(),
									children: []
								},
							]
						},
					]
				}],
				// unitTree
				{
					id: '__0',
					name: '__0',
					children: [{
						id: '__1',
						name: '__1',
						children: [
							{
								id: '__1.1',
								name: '__1.1',
								children: [
									{
										id: '__1.1.1',
										name: '__1.1.1',
										children: []
									},
								]
							},
							{
								id: '__1.2',
								name: '__1.2',
								children: [
									{
										id: '__1.2.1',
										name: '__1.2.1',
										children: []
									},
								]
							},
						]
					}]
				},
				// searchValue
				'1.2'
			],

			/** case 5 */
			[
				// expected
				[
					{
						id: '__1',
						name: '__1',
						hidden: true,
						parent: expect.anything(),
						children: [
							{
								id: '__1.1',
								name: '__1.1',
								hidden: true,
								parent: expect.anything(),
								children: [
									{
										id: '__1.1.1',
										name: '__1.1.1',
										hidden: true,
										parent: expect.anything(),
										children: []
									},
								]
							},
							{
								id: '__1.2',
								name: '__1.2',
								hidden: true,
								parent: expect.anything(),
								children: [
									{
										id: '__1.2.1',
										name: '__1.2.1',
										hidden: true,
										parent: expect.anything(),
										children: []
									},
								]
							},
						]
					},
					{
						id: '__2',
						name: '__2',
						hidden: false,
						parent: expect.anything(),
						children: [
							{
								id: '__2.1_test',
								name: '__2.1_test',
								hidden: false,
								parent: expect.anything(),
								children: [
									{
										id: '__2.1.1',
										name: '__2.1.1',
										hidden: false,
										parent: expect.anything(),
										children: []
									},
								]
							},
							{
								id: '__2.2',
								name: '__2.2',
								hidden: true,
								parent: expect.anything(),
								children: [
									{
										id: '__2.2.1',
										name: '__2.2.1',
										hidden: true,
										parent: expect.anything(),
										children: []
									},
								]
							},
						]
					},
					{
						id: '__3_test',
						name: '__3_test',
						hidden: false,
						parent: expect.anything(),
						children: [
							{
								id: '__3.1',
								name: '__3.1',
								hidden: false,
								parent: expect.anything(),
								children: [
									{
										id: '__3.1.1',
										name: '__3.1.1',
										hidden: false,
										parent: expect.anything(),
										children: []
									},
								]
							},
							{
								id: '__3.2',
								name: '__3.2',
								hidden: false,
								parent: expect.anything(),
								children: [
									{
										id: '__3.2.1',
										name: '__3.2.1',
										hidden: false,
										parent: expect.anything(),
										children: []
									},
								]
							},
						]
					},
				]
				,
				// unitTree
				{
					id: '__0',
					name: '__0',
					children: [
						{
							id: '__1',
							name: '__1',
							children: [
								{
									id: '__1.1',
									name: '__1.1',
									children: [
										{
											id: '__1.1.1',
											name: '__1.1.1',
											children: []
										},
									]
								},
								{
									id: '__1.2',
									name: '__1.2',
									children: [
										{
											id: '__1.2.1',
											name: '__1.2.1',
											children: []
										},
									]
								},
							]
						},
						{
							id: '__2',
							name: '__2',
							children: [
								{
									id: '__2.1_test',
									name: '__2.1_test',
									children: [
										{
											id: '__2.1.1',
											name: '__2.1.1',
											children: []
										},
									]
								},
								{
									id: '__2.2',
									name: '__2.2',
									children: [
										{
											id: '__2.2.1',
											name: '__2.2.1',
											children: []
										},
									]
								},
							]
						},
						{
							id: '__3_test',
							name: '__3_test',
							children: [
								{
									id: '__3.1',
									name: '__3.1',
									children: [
										{
											id: '__3.1.1',
											name: '__3.1.1',
											children: []
										},
									]
								},
								{
									id: '__3.2',
									name: '__3.2',
									children: [
										{
											id: '__3.2.1',
											name: '__3.2.1',
											children: []
										},
									]
								},
							]
						},
					]
				},
				// searchValue
				'test'
			],

			/** case 6 */
			[
				// expected
				[
					{
						id: '__1',
						name: '__1',
						hidden: undefined,
						parent: expect.anything(),
						children: [
							{
								id: '__1.1',
								name: '__1.1',
								hidden: undefined,
								parent: expect.anything(),
								children: [
									{
										id: '__1.1.1',
										name: '__1.1.1',
										hidden: undefined,
										parent: expect.anything(),
										children: []
									},
								]
							},
							{
								id: '__1.2',
								name: '__1.2',
								hidden: undefined,
								parent: expect.anything(),
								children: [
									{
										id: '__1.2.1',
										name: '__1.2.1',
										hidden: undefined,
										parent: expect.anything(),
										children: []
									},
								]
							},
						]
					},
					{
						id: '__2',
						name: '__2',
						hidden: undefined,
						parent: expect.anything(),
						children: [
							{
								id: '__2.1_test',
								name: '__2.1_test',
								hidden: undefined,
								parent: expect.anything(),
								children: [
									{
										id: '__2.1.1',
										name: '__2.1.1',
										hidden: undefined,
										parent: expect.anything(),
										children: []
									},
								]
							},
							{
								id: '__2.2',
								name: '__2.2',
								hidden: undefined,
								parent: expect.anything(),
								children: [
									{
										id: '__2.2.1',
										name: '__2.2.1',
										hidden: undefined,
										parent: expect.anything(),
										children: []
									},
								]
							},
						]
					},
					{
						id: '__3_test',
						name: '__3_test',
						hidden: undefined,
						parent: expect.anything(),
						children: [
							{
								id: '__3.1',
								name: '__3.1',
								hidden: undefined,
								parent: expect.anything(),
								children: [
									{
										id: '__3.1.1',
										name: '__3.1.1',
										hidden: undefined,
										parent: expect.anything(),
										children: []
									},
								]
							},
							{
								id: '__3.2',
								name: '__3.2',
								hidden: undefined,
								parent: expect.anything(),
								children: [
									{
										id: '__3.2.1',
										name: '__3.2.1',
										hidden: undefined,
										parent: expect.anything(),
										children: []
									},
								]
							},
						]
					},
				],
				// unitTree
				{
					id: '__0',
					name: '__0',
					children: [
						{
							id: '__1',
							name: '__1',
							children: [
								{
									id: '__1.1',
									name: '__1.1',
									children: [
										{
											id: '__1.1.1',
											name: '__1.1.1',
											children: []
										},
									]
								},
								{
									id: '__1.2',
									name: '__1.2',
									children: [
										{
											id: '__1.2.1',
											name: '__1.2.1',
											children: []
										},
									]
								},
							]
						},
						{
							id: '__2',
							name: '__2',
							children: [
								{
									id: '__2.1_test',
									name: '__2.1_test',
									children: [
										{
											id: '__2.1.1',
											name: '__2.1.1',
											children: []
										},
									]
								},
								{
									id: '__2.2',
									name: '__2.2',
									children: [
										{
											id: '__2.2.1',
											name: '__2.2.1',
											children: []
										},
									]
								},
							]
						},
						{
							id: '__3_test',
							name: '__3_test',
							children: [
								{
									id: '__3.1',
									name: '__3.1',
									children: [
										{
											id: '__3.1.1',
											name: '__3.1.1',
											children: []
										},
									]
								},
								{
									id: '__3.2',
									name: '__3.2',
									children: [
										{
											id: '__3.2.1',
											name: '__3.2.1',
											children: []
										},
									]
								},
							]
						},
					]
				},
				// searchValue
				''
			]
		])
		('should set treeDataSource.data to %o if fullUnitTree is %o and searchValue is "%s"', (expected, unitTree, searchValue) => {
			// @ts-ignore
			component.setUnitTreeParents(unitTree, null)
			component.organisationSearchValue = searchValue

			component.setHiddenBySearchValue(unitTree.children)

			expect(unitTree.children).toEqual(expected)
		});
	});
});
