var app = angular.module("myApp", ["ngRoute", "ngSanitize"]);

app.config(function($routeProvider){
	$routeProvider
	  .when('/', {
	  	templateUrl: "templates/home.html",
	  	controller: "HomeController"
	  })
	  .when("/settings", {
	  	templateUrl: "templates/settings.html",
	  	controller: "SettingsController"
	  })
	  .otherwise({
	  	redirectTo: "/"
	  });
});

app.service("MailService", function($http, $q){
	var getMail = function(){
		return $http({
			method: "GET",
			url: "/api/mail"
		});
	};
//ANALYSE STARTS
	var sendEmail = function(email){
		var d = $q.defer();
		$http({
			method: "POST",
			data: email,
			url: "/api/send"
		}).success(function(data, status, headers){
			d.resolve(data);
		}).error(function(data, status, headers){
			d.reject(data);
		});
		return d.promise;
	};

	return {
		getMail: getMail,
		sendEmail: sendEmail
	};
});
//ANALYSE ENDS

app.controller('HomeController', function($scope){
	
	$scope.selectedEmail;

	$scope.setSelectedEmail = function(email){
		if($scope.selectedEmail !== email){//if this email hasn't been selected
			$scope.selectedEmail = email;	
		}else{ //if the email is already selected, unselect it
			$scope.selectedEmail = null;
		}
	};

	$scope.isSelected = function(email){
		return ($scope.selectedEmail === email) ? true : false;
	};

});

app.directive("emailListing", function(){
	return {
		restricct: "EA",
		replace: false,
		scope: {
			email: '=', //accept parameter as an object
			action: '&', //accept parameter as a function
			shoudUseGravatar: '@' //accept parameter as a string
		},
		templateUrl: '/templates/emailListing.html',
		link: function(scope, iElement, iAttrs, transclude){
			iElement.bind("click", function(){
				iElement.parent().children().removeClass("selected");
				iElement.addClass("selected");
			})
		}
	};
});


app.controller("MailListingController", function($scope, MailService){
	$scope.emails = [];

	MailService.getMail()
	.success(function(data, status, headers){
		$scope.emails = data.all;
	})
	.error(function(data, status, headers){

	});

});

app.controller("ContentController", function($scope, $rootScope, MailService){
	$scope.reply = {};
	$scope.showingReply = false;

	$scope.showReply = function(){
		$scope.showingReply = true;
	};

	$scope.toggleReplyForm = function(){
		$scope.showingReply = !$scope.showingReply;
		$scope.reply = {};
		$scope.reply.subject = $scope.selectedEmail.subject;
		$scope.reply.from = $scope.selectedEmail.to.join(", ");
		$scope.reply.to = $scope.selectedEmail.from.join(", ");
		$scope.reply.body = "\n\n-------------\n\n" + $scope.selectedEmail.body;
	}
//ANALYSE STARTS
	$scope.sendReply = function(){
		$scope.showingReply = false;
		$rootScope.loading = true;
		MailService.sendEmail($scope.reply)
		.then(function(status){
			$rootScope.loading = false;
		}, function(err){
			$rootScope.loading = false;
		});
	}
//ANALYSE ENDS
	$scope.$watch("selectedEmail", function(){
		$scope.showingReply = false; 
		$scope.reply = {};
	})

});

app.controller("SettingsController", function($scope){
	$scope.settings = {
		name: "Ari",
		email: "me@gmail.com"
	};
	$scope.updateSettings = function(){
		alert("updated");
	};
});