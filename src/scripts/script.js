
'use strict';

var cached = [
    'dist/assets/img/lincoln.jpg',
    "dist/assets/img/firs.jpg",
    "dist/assets/img/newark.jpg",
    "dist/assets/img/wheel.jpg"
];

var Card = (function() {	
    //Constructor
    function Card(cardName, templateName) {
        this.cardName = ko.observable(cardName);
        this.templateName = ko.observable(templateName);
    }

	Card.prototype.constructor = Card;	
	
	Card.prototype.refresh = function () {

	};
		
	return Card;
})();

var DateTimeCard = (function(parent) {
	//Constructor
    DateTimeCard.prototype = new Card();
    
    function DateTimeCard() {
        var self = this;
        this.time = ko.observable(this.getTime());
        this.date = ko.observable(this.getDate());

        setInterval(self.refresh.bind(self), 200);
        parent.call(this, 'Time', 'TimeCardTemplate');
    }

	DateTimeCard.prototype.constructor = DateTimeCard;
	
	DateTimeCard.prototype.refresh = function () {
	    this.time(this.getTime());
	    this.date(this.getDate());
	};
		
	DateTimeCard.prototype.getTime = function () {
	    var date = new Date();
	    var hours = date.getHours();
	    var minutes = date.getMinutes();
	    var seconds = date.getSeconds();

	    if (hours < 10) { hours = '0' + hours; }
	    if (minutes < 10) { minutes = '0' + minutes; }
	    if (seconds < 10) { seconds = '0' + seconds; }
	    var time = hours + ':' + minutes + ':' + seconds
	    return time;
	};
	
	DateTimeCard.prototype.getDate = function () {
	    var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth() + 1; //January is 0!
	    var yyyy = today.getFullYear();
	    if (dd < 10) {
	        dd = '0' + dd
	    }

	    if (mm < 10) {
	        mm = '0' + mm
	    }

	    var date = dd + '/' + mm + '/' + yyyy;
	    return date;
	};
    
	return DateTimeCard;
})(Card);

var viewModel = {
	mainCards: ko.observableArray(),
	supplementaryCards: ko.observableArray(),
	timeCard: ko.observable(),
    images: ko.observableArray(cached),
};
		
$(document).ready(function() {
	
    var dateTimeCard = new DateTimeCard();
    viewModel.timeCard(new DateTimeCard());
	viewModel.mainCards.push(new DateTimeCard());
	viewModel.mainCards.push(new DateTimeCard());
	viewModel.supplementaryCards.push(new DateTimeCard());
	viewModel.supplementaryCards.push(new DateTimeCard());
    	
	ko.applyBindings(viewModel);
	
	var currIndex = 0;
    
	setInterval(function () {
	    viewModel.images().splice(0, 1);
	    viewModel.images.push(cached[currIndex]);

	    if (currIndex == cached.length - 1) {
	        currIndex = 0;
	    }

	    return;
		var $preload = $('.bg.preload');
		var $current = $('.bg.current');
		var $backup = $('.bg.backup');

		//preload -> current
		$preload.addClass('current').removeClass('preload');
		
		setTimeout(function($current, $backup) {
			return function() {
				//current -> backup
				$current.addClass('backup').removeClass('current');
				//backup -> preload
				$backup.addClass('preload').removeClass('backup');	
				//add a new one into the mix
				var temp = $backup.prop('src');
				$backup.prop('src', cached);							
				cached = temp;
			}					
		}($current, $backup), 1000);
	}, 6000);
});