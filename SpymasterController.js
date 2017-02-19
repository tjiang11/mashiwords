var spymaster = angular.module('spymaster', []);

spymaster.controller('SpymasterController', ['$scope',
	function SpymasterController($scope) {
		// var POSITIONS = [
		// 	{x: 32.8, y: 32}, {x: 59.5, y: 32}, {x: 86, y: 32}, {x: 113, y: 32}, {x: 139.6, y: 32},
		// 	{x: 32.8, y: 59}, {x: 59.5, y: 59}, {x: 86, y: 59}, {x: 113, y: 59}, {x: 139.6, y: 59},
		// 	{x: 32.8, y: 86}, {x: 59.5, y: 86}, {x: 86, y: 86}, {x: 113, y: 86}, {x: 139.6, y: 86},
		// 	{x: 32.8, y: 112.5}, {x: 59.5, y: 112.5}, {x: 86, y: 112.5}, {x: 113, y: 112.5}, {x: 139.6, y: 112.5},
		// 	{x: 32.8, y: 139}, {x: 59.5, y: 139}, {x: 86, y: 139}, {x: 113, y: 139}, {x: 139.6, y: 139}
		// ];

		// var POSITIONS = [
		// 	{x: 136, y: 130}, {x: 243, y: 130}, {x: 349, y: 130}, {x: 456, y: 130}, {x: 563, y: 130},
		// 	{x: 136, y: 237}, {x: 243, y: 237}, {x: 349, y: 237}, {x: 456, y: 237}, {x: 563, y: 237},
		// 	{x: 136, y: 344}, {x: 243, y: 344}, {x: 349, y: 344}, {x: 456, y: 344}, {x: 563, y: 344},
		// 	{x: 136, y: 449}, {x: 243, y: 449}, {x: 349, y: 449}, {x: 456, y: 449}, {x: 563, y: 449},
		// 	{x: 136, y: 559}, {x: 243, y: 559}, {x: 349, y: 557}, {x: 456, y: 559}, {x: 563, y: 559}
		// ];

		var POSITIONS = [
			{x: 201, y: 216}, {x: 277, y: 216}, {x: 352, y: 216}, {x: 429, y: 216}, {x: 504, y: 216},
			{x: 201, y: 290}, {x: 277, y: 290}, {x: 352, y: 290}, {x: 429, y: 290}, {x: 504, y: 290},
			{x: 201, y: 367}, {x: 277, y: 367}, {x: 352, y: 367}, {x: 429, y: 367}, {x: 504, y: 367},
			{x: 201, y: 444}, {x: 277, y: 444}, {x: 352, y: 444}, {x: 429, y: 444}, {x: 504, y: 444},
			{x: 201, y: 519}, {x: 277, y: 519}, {x: 352, y: 517}, {x: 429, y: 519}, {x: 504, y: 519}
		];

		var placeColors = function() {
			var numRed = 9;
			var numBlue = 8;
			var numAssassin = 1;
			var placed = {};
			while (numRed > 0) {
				var randomIndex = Math.floor(Math.random() * 25);
				if (!(randomIndex in placed)) {
					placed[randomIndex] = 'red';
					numRed--;
				}
			}
			while (numBlue > 0) {
				var randomIndex = Math.floor(Math.random() * 25);
				if (!(randomIndex in placed)) {
					placed[randomIndex] = 'blue';
					numBlue--;
				}
			}
			while (numAssassin > 0) {
				var randomIndex = Math.floor(Math.random() * 25);
				if (!(randomIndex in placed)) {
					placed[randomIndex] = 'assassin';
					numAssassin--;
				}
			}

			var returnColors = [];
			for (var placement in placed) {
				returnColors[placement] = placed[placement];
			}
			return returnColors;
		};
		var colors = placeColors();

		var ctx = document.getElementById('spymasterCard').getContext('2d');

		var imgRed = new Image();
		var imgBlue = new Image();
		var imgAssassin = new Image();
		imgRed.onload = function() {
			for (var i = 0; i < colors.length; i++) {
				var position = POSITIONS[i];
				if (colors[i] === 'red') {
					ctx.drawImage(imgRed, position.x, position.y, 80, 76);
				}
			}
		};
		imgBlue.onload = function() {
			for (var i = 0; i < colors.length; i++) {
				var position = POSITIONS[i];
				if (colors[i] === 'blue') {
					ctx.drawImage(imgBlue, position.x, position.y, 80, 76);
				}
			}
		};
		imgAssassin.onload = function() {
			for (var i = 0; i < colors.length; i++) {
				var position = POSITIONS[i];
				if (colors[i] === 'assassin') {
					ctx.drawImage(imgAssassin, position.x, position.y, 80, 76);
				}
			}
		};
		imgRed.src = "images/red_square.png";
		imgBlue.src = "images/blue_square.png";
		imgAssassin.src = "images/assassin_square.png";


	}
]);