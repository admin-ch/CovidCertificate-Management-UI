const mock = () => {
	let storage = {};
	return {
		getItem: key => key in storage ? storage[key] : null,
		setItem: (key, value) => storage[key] = value || '',
		removeItem: key => delete storage[key],
		clear: () => storage = {},
	};
};

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(window, 'scrollIntoView', {value: mock()});
Object.defineProperty(window, 'getComputedStyle', {
	value: () => ['-webkit-appearance']
});
(window as any).HTMLElement.prototype.scrollIntoView = function() {};
Object.defineProperty(document.body.style, 'transform', {
	value: () => {
		return {
			enumerable: true,
			configurable: true,
		};
	},
});
