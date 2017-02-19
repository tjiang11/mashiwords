var codenames = angular.module('codenames', ['ngRoute', 'angularModalService']);

codenames.config(['$locationProvider', '$routeProvider',
	function config($locationProvider, $routeProvider) {
		$locationProvider.hashPrefix('!');

		$routeProvider.
			when("/", {
				templateUrl: 'index.html',
				controller: 'GameController'
			}).
			when('/game', {
				templateUrl: 'index.html',
				controller: 'GameController'
			}).
			when('/spymaster', {
				templateUrl: 'spymaster.html',
				controller: 'SpymasterController'
			}).
			otherwise('/game');

			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});
	}
]);

codenames.controller('GameController', ['$scope', 'ModalService', 'colorTrackerService', 'customWordService',
	function GameController($scope, ModalService, colorTrackerService, customWordService) {
		$scope.timerRunning = false;
		$scope.timeOut = false;
		customWordService.init();
		var DEFAULT_WORDS = [];
		jQuery.get("res/default_words", function(data) {
			$scope.cards = [];
			var allWords = data.split("\n");
			DEFAULT_WORDS = angular.copy(allWords);
			var numCards = 25;
			var wordsDict = {};
			while (numCards > 0) {
				var randomIndex = Math.floor(Math.random() * allWords.length);
				if (!(randomIndex in wordsDict) && allWords[randomIndex].length > 0) {
					wordsDict[randomIndex] = true;
					$scope.cards.push(allWords[randomIndex])
					numCards--;
				}
			}
			$scope.$apply();
		});

		$scope.colorSelected = '';

		$scope.changeColor = function(color) {
			$scope.colorSelected = color;
			colorTrackerService.changeColors(color);
		};

		$scope.openSpymasterCard = function() {
			open('spymaster.html');
		};

		$scope.showComplex = function() {
			ModalService.showModal({
				templateUrl: "custom-words-modal.html",
				controller: "ComplexController",
				inputs: {
					title: "Custom Words"
		      	}
		    }).then(function(modal) {
				console.log("HUH");
				console.log(modal);
				modal.element.modal();
				modal.close.then(function(result) {
					customWordService.extractWords(function(customWords) {
						$scope.cards = [];
						console.log(customWords);
						var numCards = 25;
						var wordsDict = {};
						while (numCards > 0) {
							var randomIndex = Math.floor(Math.random() * customWords.length);
							if (!(randomIndex in wordsDict) && customWords[randomIndex].length > 0) {
								wordsDict[randomIndex] = true;
								$scope.cards.push(customWords[randomIndex])
								numCards--;
							}
						}
						$scope.$apply();
					});
				});
			});
		};

		var timerInterval;
		$scope.startTimer = function() {
			$scope.timeOut = false;
			$scope.timerRunning = true;
			clearInterval(timerInterval);
			console.log("start timer");
			var elem = document.getElementById('timerJuice');
			elem.style.width = 0;
			var width = 1;
			timerInterval = setInterval(function() {
				width++;
				elem.style.width = width + '%';
				if (width === 100) {
					clearInterval(timerInterval);
					$scope.timerRunning = false;
					$scope.timeOut = true;
				}
			}, 1200);
		};

		$scope.stopTimer = function() {
			$scope.timeOut = false;
			$scope.timerRunning = false;
			console.log("stop timer");
			var elem = document.getElementById('timerJuice');
			var width = 0;
			elem.style.width = 0;
			clearInterval(timerInterval);
		};
	}
]);

codenames.controller('ComplexController', [
	'$scope', '$element', 'title', 'close', 'customWordService',
	function($scope, $element, title, close, customWordService) {

	$scope.name = null;
	$scope.age = null;
	$scope.title = title;
	$scope.customWordService = customWordService;
  
	//  This close function doesn't need to use jQuery or bootstrap, because
	//  the button has the 'data-dismiss' attribute.
	$scope.close = function() {
 		close({
    	name: $scope.name,
    	age: $scope.age
    	}, 500); // close, but give 500ms for bootstrap to animate
	};

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
  	$scope.cancel = function() {

    //  Manually hide the modal.
    	$element.modal('hide');
  	};
}]);

codenames.component('codenamesCard', {
    templateUrl: 'codenames_card.html',
	controller: function($scope, colorTrackerService) {
		this.color = '';
		this.colorAgent = '';
		this.colored = true;
		this.changeColor = function() {
			if (this.color === colorTrackerService.getCurrentColor()) {
				this.color = '';
				this.colorAgent = '';
			} else {
				this.color = colorTrackerService.getCurrentColor();
				if (this.color === 'RED' || this.color === 'BLUE' || this.color === 'CIV') {
					this.colorAgent = Math.random() < .5 ? this.color + '1' : this.color + '2';
				} else {
					this.colorAgent = '';
				}
			}
		};
	},
	bindings: {
		content: '='
	}
});

codenames.factory('colorTrackerService', function() {
	this.currentColor = '';
	return {
		changeColors: function(newColor) {
			this.currentColor = newColor;
		},
		getCurrentColor: function() {
			return this.currentColor;
		}
	};
});

codenames.factory('customWordService', function() {
	return {
		init: function() {
			this.customWords = [];
		},
		loadCustomWordFile: function(file) {
			this.customWordFile = file;
		},
		getCustomWordFileName: function() {
			return this.customWordFile.name;
		},
		getCustomWords: function() {
			return this.customWords;
		},
		extractWords: function(callback) {
			var reader = new FileReader();
			console.log("extracting");
			reader.onload = function(loadEvent) {
				var data = loadEvent.target.result;
				var newWords = data.split("\n");
				for (var i = 0; i < newWords.length; i++) {
					if (newWords[i] === '') {
						newWords.splice(i, 1);
						i--;
					}
				}
				this.customWords = newWords;
				console.log(this.customWords);
				callback(this.customWords);
			};
			reader.readAsText(this.customWordFile);
		},
		extractWordsFromFile: function(data) {
			var newWords = data.split("\n");
			for (var i = 0; i < newWords.length; i++) {
				if (newWords[i] === '') {
					newWords.splice(i, 1);
					i--;
				}
			}
			this.customWords = newWords;
		}
	}
});

codenames.directive("fileread", ['customWordService', function (customWordService) {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                customWordService.loadCustomWordFile(changeEvent.target.files[0]);
            });
        }
    }
}]);