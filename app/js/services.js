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
.factory('dailyReportsService', function(dataService, $location){
	var dailyReports = dataService.$child('dailyReports');

	var dailyReportsServiceObject = {
		saveDailyReport: function(dailyReport){
			dailyReports.$add(dailyReport);
		}
	};

	return dailyReportsServiceObject;
})
.factory('rfiService', function(dataService, $location){
	var requestForInformation = dataService.$child('requestForInformation');

	var rfiServiceObject = {
		saveRfi: function(rfi){
			requestForInformation.$add(rfi);
		}
	};

	return rfiServiceObject;
})
.factory('employeeService', function(dataService, alertService, $location){
    
    //get employees data route
    var employees = dataService.$child('employees');
    
    //onComplete method
    var onComplete = function(error) {
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
            
            alertService.addAlert('Employee saved!', 'alert-success');
        }
    };
    
	var employeeServiceObject = {
		saveNewEmployee: function(employee){
			employees.$add(employee);
		},
        getEmployees: function(){
            return employees;
        },
        updateEmployee: function(employee){
            
            employees.$child(employee.$id).$set(employee, onComplete());
        }
	};
    
	return employeeServiceObject;
    
})
.factory('timesheetService', function(dataService, $location){
	var newTimesheet = dataService.$child('timeSheets');
	var employees = dataService.$child('employees');

	var timesheetServiceObject = {
		saveNewTimesheet: function(timesheet){
			newTimesheet.$add(timesheet);
		},
		getEmployees: function(){
			return employees;
		}
	};

	return timesheetServiceObject;
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
				$location.path('/home_page')
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
})
.factory('alertService', function() {
    
    var alertServiceObject = {
        
        alerts: {},
        
        addAlert: function(message, type) {
            this.alerts[type] = this.alerts[type] || [];
            this.alerts[type].push(message);
        },
        clearAlerts: function() {
            for(var x in this.alerts) {
                delete this.alerts[x];
            }
        }
    };
    
    return alertServiceObject;
});
