(function() {
	'use strict';

	angular.module('app', [
		'ui.router',
    'ngTable',
		'ngTableToCsv',

		'user',
    'detail',
		'common',

    'ui.bootstrap'
	]);
}());
