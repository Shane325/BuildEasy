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
.factory('homeService', function(dataService){
    var users = dataService.$child('users');
    
    var homeServiceObject = {
         getProjectByProjectId: function(userId, projectId){
             
             return users.$child(userId).$child('projects').$child(projectId);
         } 
    };
    
    return homeServiceObject;

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
    var submitRfi = dataService.$child('submitRfi');

	var rfiServiceObject = {
		saveRfi: function(rfi){
            
            rfi.rfiNumber = Math.floor(Math.random()*100000001);
            
			requestForInformation.$add(rfi);
		},
        getRfis: function(){
            return requestForInformation;
        },
        updateRfi: function(rfiId, rfi){
            requestForInformation.$child(rfiId).$set(rfi);
        },
        deleteRfi: function(rfi){
            requestForInformation.$remove(rfi.$id);
        },
        submitRfi: function(rfi){
//              console.log(rfi);
            submitRfi.$add(rfi);
        }
	};

	return rfiServiceObject;
})
.factory('employeeService', function(dataService, alertService, $location, $timeout){
    
    //get employees data route
    var employees = dataService.$child('employees');
    
    //onComplete method
    var onComplete = function(error, type) {
        
        if (error) {
            console.log('Synchronization failed');
        } else {

            if(type == 'save'){
                alertService.addAlert('Employee saved', 'alert-success');
            }else if(type == 'delete'){
                alertService.addAlert('Employee deleted', 'alert-danger');
            }
        }
    };
    
	var employeeServiceObject = {
		saveNewEmployee: function(employee){
			employees.$add(employee, onComplete(null, 'save'));
		},
        getEmployees: function(){
            return employees;
        },
        updateEmployee: function(empId, employee){
            employees.$child(empId).$set(employee, onComplete(null, 'save'));
        },
        deleteEmployee: function(employee){
            employees.$remove(employee.$id, onComplete(null, 'delete'));
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
            console.log(timesheet);
		},
		getEmployees: function(){
			return employees;
		}
	};

	return timesheetServiceObject;
})
.factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, dataService, alertService){
	var authRef = new Firebase(FIREBASE_URL);
	var auth = $firebaseSimpleLogin(authRef);
    
	var emails = dataService.$child('emails');
	var userProfile = dataService.$child('userProfile');

	var authServiceObject = {
		register: function(user){
			auth.$createUser(user.email, user.password).then(function(data){
				 //userProfile.$add(user);
				 console.log(user);
                
                
                //log user in and enter their email address into DB
                //I have disabled the email part for now
                
//				authServiceObject.login(user, function(){
//					emails.$add({email: user.email});
//				});
                authServiceObject.login(user);
			});
		},
		login: function(user){
			auth.$login('password', user).then(function(data){
                console.log(data);
				$location.path('/home_page')
			}, function(error){
                //console.log(error.code);
                //console.log(error.message);

                //handle each error code
                if(error.code === 'INVALID_EMAIL'){
                    alertService.addAlert('Incorrect Email address', 'alert-danger');    
                }else if(error.code === 'INVALID_USER'){
                    alertService.addAlert('Incorrect Username', 'alert-danger');
                }else if(error.code === 'INVALID_PASSWORD'){
                    alertService.addAlert('Incorrect Password', 'alert-danger');
                }else{
                    alertService.addAlert(error.code, 'alert-danger');
                }
            
            });
		},
		logout: function(){
			auth.$logout();
			$location.path('/');
		},
		getCurrentUser: function(){
			return auth.$getCurrentUser();
		},
        sendPasswordResetEmail: function(user){
            authRef.resetPassword(user, function(error){
                if (error){
                    //console.log("Error");
                    alertService.addAlert('Error', 'alert-danger');
                }else{
                    //console.log("Success");
                    alertService.addAlert('Success', 'alert-success');
                }
            });
        },
        changePassword: function(userDetails){
            //console.log(userDetails);
            authRef.changePassword(userDetails, function(error){
                if (error){
                    switch (error.code) {
                          case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            alertService.addAlert('The specified user password is incorrect');
                            break;
                          case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            alertService.addAlert('The specified user account does not exist', 'alert-danger');
                            break;
                          default:
                            console.log("Error changing password:", error);
                            alertService.addAlert('Error changing password', 'alert-danger');
                        }
               }else{
                   console.log("User password changed successfully!");
                   alertService.addAlert('User password changed successfully', 'alert-success');
               } 
            });
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
.factory('alertService', function($timeout) {
    
    var alertServiceObject = {
        
        alerts: {},
        
        addAlert: function(message, type) {
            this.alerts[type] = this.alerts[type] || [];
            this.alerts[type].push(message);
            
            //console.log(this.alerts);
            //Wait 5 seconds and clear the alerts array
            $timeout(function(){
                    alertServiceObject.clearAlerts();
            }, 5000);
            
        },
        clearAlerts: function() {
            for(var x in this.alerts) {
                delete this.alerts[x];
            }
        }
    };
    
    return alertServiceObject;
});
