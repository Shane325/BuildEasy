'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('LandingPageController', [function() {

}])

.controller('ProjectsController', ['$scope', 'projectService', 'authService',function($scope, projectService, authService) {
	//Bind user projects to $scope.projects
	authService.getCurrentUser().then(function(user){
		if(user){
			$scope.projects = projectService.getProjectsByUserId(user.id);
		};
	});


	//Object to store data from the project form
  	$scope.newProject = {name: '', address: '', phone: '', email: '', startdate: '', enddate: ''};

  	//function to save a new project
  	$scope.saveProject = function(){
  		projectService.saveProject($scope.newProject, $scope.currentUser.id);
  		$scope.newProject = {name: '', address: '', phone: '', email: '', startdate: '', enddate: ''};
  	};

}])

.controller('AuthController', ['$scope', 'authService', function($scope, authService) {
	//Object bound to inputs on the register and login pages
	$scope.user = {email: '', password: '', firstName: '', lastName: '', companyName: ''};

	//Method to register a new user using the authService
	$scope.register = function() {
		authService.register($scope.user);
	};

	//Method to log in a user using the authService
	$scope.login = function() {
		authService.login($scope.user);
	};

	//Method to logout a user using the authService
	$scope.logout = function() {
		authService.logout();
	};

}]);