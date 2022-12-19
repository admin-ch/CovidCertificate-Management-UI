import {TestBed, fakeAsync, tick} from '@angular/core/testing';

import {EiamProfile, SelectedProfilesService} from './selected-profiles.service';

describe('UnitDataService', () => {
	let service: SelectedProfilesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SelectedProfilesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('isAllSelected', () => {
		it('should return true', () => {
			const users: EiamProfile[] = [
				{
					userExtId: '1',
					name: '1',
					email: '1',
					firstname: '1',
					unitName: '1'
				},
				{
					userExtId: '2',
					name: '2',
					email: '2',
					firstname: '2',
					unitName: '2'
				},
				{
					userExtId: '3',
					name: '3',
					email: '3',
					firstname: '3',
					unitName: '3'
				}
			];

			service.add(...users);

			expect(service.isAllSelected(users)).toBe(true);
		});
		it('should return false', () => {
			const users: EiamProfile[] = [
				{
					userExtId: '1',
					name: '1',
					email: '1',
					firstname: '1',
					unitName: '1'
				},
				{
					userExtId: '2',
					name: '2',
					email: '2',
					firstname: '2',
					unitName: '2'
				},
				{
					userExtId: '3',
					name: '3',
					email: '3',
					firstname: '3',
					unitName: '3'
				}
			];

			service.add(...users.filter((user, index) => index === 0));

			expect(service.isAllSelected(users)).toBe(false);
		});
	});

	describe('isSomeSelected', () => {
		it('should return false', () => {
			const users: EiamProfile[] = [
				{
					userExtId: '1',
					name: '1',
					email: '1',
					firstname: '1',
					unitName: '1'
				},
				{
					userExtId: '2',
					name: '2',
					email: '2',
					firstname: '2',
					unitName: '2'
				},
				{
					userExtId: '3',
					name: '3',
					email: '3',
					firstname: '3',
					unitName: '3'
				}
			];

			service.clear();

			expect(service.isSomeSelected(users)).toBe(false);
		});
		it('should return true', () => {
			const users: EiamProfile[] = [
				{
					userExtId: '1',
					name: '1',
					email: '1',
					firstname: '1',
					unitName: '1'
				},
				{
					userExtId: '2',
					name: '2',
					email: '2',
					firstname: '2',
					unitName: '2'
				},
				{
					userExtId: '3',
					name: '3',
					email: '3',
					firstname: '3',
					unitName: '3'
				}
			];

			service.add(...users.filter((user, index) => index === 0));

			expect(service.isSomeSelected(users)).toBe(true);
		});
	});

	describe('exists', () => {
		it('should return true', () => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {
				// @ts-ignore
				1: user1,
				2: user2,
				3: user3
			};

			expect(service.exists(user1)).toBe(true);
		});
		it('should return false', () => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;
			const user4 = {userExtId: '4'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {
				// @ts-ignore
				1: user1,
				2: user2,
				3: user3
			};

			expect(service.exists(user4)).toBe(false);
		});
	});

	describe('add', () => {
		it('should add all passed users', () => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {};

			service.add(user1, user2, user3);

			expect(service.exists(user1)).toBe(true);
			expect(service.exists(user2)).toBe(true);
			expect(service.exists(user3)).toBe(true);
		});
		it('should emit changes', fakeAsync(() => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {};

			service.add(user1, user2, user3);

			service.changes$.subscribe(changes => {
				expect(changes).toEqual({1: user1, 2: user2, 3: user3});
			});

			tick();
		}));
	});

	describe('remove', () => {
		it('should remove all passed users', () => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;
			const user4 = {userExtId: '4'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {
				1: user1,
				2: user2,
				3: user3,
				4: user4
			};

			service.remove(user1, user2, user3);

			expect(service.exists(user1)).toBe(false);
			expect(service.exists(user2)).toBe(false);
			expect(service.exists(user3)).toBe(false);
			expect(service.exists(user4)).toBe(true);
		});
		it('should emit changes', fakeAsync(() => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;
			const user4 = {userExtId: '4'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {
				1: user1,
				2: user2,
				3: user3,
				4: user4
			};

			service.remove(user1, user2, user3);

			service.changes$.subscribe(changes => {
				expect(changes).toEqual({4: user4});
			});

			tick();
		}));
	});

	describe('clear', () => {
		it('should remove all users', () => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;
			const user4 = {userExtId: '4'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {
				1: user1,
				2: user2,
				3: user3,
				4: user4
			};

			service.clear();

			// @ts-ignore
			expect(service.selectedProfiles).toEqual({});
		});
		it('should emit changes', fakeAsync(() => {
			const user1 = {userExtId: '1'} as EiamProfile;
			const user2 = {userExtId: '2'} as EiamProfile;
			const user3 = {userExtId: '3'} as EiamProfile;
			const user4 = {userExtId: '4'} as EiamProfile;

			// @ts-ignore
			service.selectedProfiles = {
				1: user1,
				2: user2,
				3: user3,
				4: user4
			};

			service.clear();

			service.changes$.subscribe(changes => {
				expect(changes).toEqual({});
			});

			tick();
		}));
	});
});
