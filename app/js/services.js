'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.value('FIREBASE_URL', 'https://buildeasy.firebaseio.com/')
.factory('dataService', function($firebase, FIREBASE_URL){
	var dataRef = new Firebase(FIREBASE_URL);
	var fireData = $firebase(dataRef);

	return fireData;
})
.factory('projectService', function(dataService, $location){
	var users = dataService.$child('users');

	var projectServiceObject = {
		saveProject: function(project, userId){
			users.$child(userId).$child('projects').$add(project);
		},
		getProjectsByUserId: function(userId){
			return users.$child(userId).$child('projects');
		}
	};

	return projectServiceObject;
})
.factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, dataService){
	var authRef = new Firebase(FIREBASE_URL);
	var auth = $firebaseSimpleLogin(authRef);
	var emails = dataService.$child('emails');
	var userProfile = dataService.$child('userProfile');

	var authServiceObject = {
		register: function(user){
			auth.$createUser(user.email, user.password).then(function(data){
				userProfile.$add(user);
				// console.log(data);
				authServiceObject.login(user, function(){
					emails.$add({email: user.email});
				});
			});	
		},
		login: function(user, optionalCallback){
			auth.$login('password', user).then(function(data){
				// console.log(data);
				if(optionalCallback){
					optionalCallback();
				}
				$location.path('/projects_page')
			});
		},
		logout: function(){
			auth.$logout();
			$location.path('/');
		},
		getCurrentUser: function(){
			return auth.$getCurrentUser();
		}
	};

	$rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
		$rootScope.currentUser = user;
	});

	$rootScope.$on("$firebaseSimpleLogin:logout", function() {
		$rootScope.currentUser = null;
	});	

	return authServiceObject;
});
