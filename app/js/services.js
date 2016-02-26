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
.factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, dataService, alertService){
	//
    var authRef = new Firebase(FIREBASE_URL);
	var auth = $firebaseSimpleLogin(authRef);
	var emails = dataService.$child('emails');
	var userInfoPath = dataService.$child('userInfo');
    
    //auth service object that contains all of the functions
	var authServiceObject = {
		register: function(user){
			auth.$createUser(user.email, user.password).then(function(data){
                //console.log(data);
                authServiceObject.login(user, 'y');
                
                userInfoPath.$child(data.id).$set(user);
			});
		},
		login: function(user, firstTimeLoginFlag){
			auth.$login('password', user).then(function(data){
                if(firstTimeLoginFlag === 'y'){
                    $location.path('/welcome');
                }else{
                    $location.path('/projects');
                }
			}, function(error){
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
        createUserProfile: function(userInfo, userId){
            userInfoPath.$child(userId).$set(userInfo);
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
                    alertService.addAlert('Error', 'alert-danger');
                }else{
                    alertService.addAlert('Success', 'alert-success');
                }
            });
        },
        changePassword: function(userDetails){
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
.factory('navService', function($location){
    var navServiceObject = {
        goToDashboard: function(projectId){
            $location.path('/home_page/' + projectId);  
        },
        goToRfiList: function(projectId){
            $location.path('/rfi_list/' + projectId);
        },
        goToRfi: function(projectId){
            $location.path('/rfi/' + projectId);
        },
        goToDailyReports: function(projectId){
            $location.path('/daily_reports/' + projectId);  
        },
        goToDailyReportList: function(projectId){
            $location.path('/daily_report_list/' + projectId);
        },
        goToTimesheet: function(projectId){
            $location.path('/timesheet/' + projectId);
        },
        goToTimesheetList: function(projectId){
            $location.path('/timesheet_list/' + projectId);
        },
        goToEmployees: function(projectId){
            $location.path('/employees/' + projectId);
        },
        goToTasks: function(projectId){
            $location.path('/tasks/' + projectId);
        },
        goToTimeline: function(projectId){
            $location.path('/timeline/' + projectId);
        },
        goToHomePage: function(projectId){
            $location.path('/home_page/' + projectId);
        }
    };
    
    return navServiceObject;
})
.factory('welcomeService', function(dataService){
    
    var userInfoPath = dataService.$child('userInfo');
    
    var welcomeServiceObject = {
        getUserInfo: function(userId){
            return userInfoPath.$child(userId);
        }
    };
    
    return welcomeServiceObject;
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
	var users = dataService.$child('userProject');

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
	var projectDailyReport = dataService.$child('projectDailyReport');

	var dailyReportsServiceObject = {
		saveDailyReport: function(dailyReport, projectId){
			projectDailyReport.$child(projectId).$child('dailyReport').$add(dailyReport);
		},
        getDailyReportByProject: function(projectId){
            return projectDailyReport.$child(projectId).$child('dailyReport');
        },
        updateDailyReport: function(dailyReportId, dailyReport, projectId){
            projectDailyReport.$child(projectId).$child('dailyReport').$child(dailyReportId).$set(dailyReport);
        }
	};

	return dailyReportsServiceObject;
})
.factory('rfiService', function(dataService, $location){
	var requestForInformation = dataService.$child('requestForInformation');
    var submitRfi = dataService.$child('submitRfi');
    var projectRfi = dataService.$child('projectRfi');

	var rfiServiceObject = {
		saveRfi: function(rfi, projectId){
            
            rfi.rfiNumber = Math.floor(Math.random()*100000001);
            projectRfi.$child(projectId).$child('rfi').$add(rfi);
            
            $location.path('/rfi_list/' + projectId);
            
		},
        getRfisByProject: function(projectId){
            return projectRfi.$child(projectId).$child('rfi');
        },
        updateRfi: function(rfiId, rfi, projectId){
//            console.log(rfiId);
//            console.log(rfi);
//            console.log(projectId);
            projectRfi.$child(projectId).$child('rfi').$child(rfiId).$set(rfi);
        },
        deleteRfi: function(rfiId, projectId){
            console.log(rfiId);
            console.log(projectId);
            //projectRfi.$child(projectId).$child('rfi').$remove(rfiId);
        },
        submitRfi: function(rfi){
            submitRfi.$add(rfi);
        },
        openAsPdf: function(rfi){
            var docDefinition = {
                content: [
                    {
                        text: 'Request For Information',
                        style: 'header',
                        alignment: 'center',
                        bold: true,
                        fontSize: 18
                    },
                    {
                        text:[
                            {text: 'Date: ', bold:true},
                            {text: rfi.date}
                        ],
                        margin: [0, 50, 0, 0]
                    },
                    {
                        text: [
                            {text: 'To: ', bold:true},
                            {text: rfi.to}
                        ],
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: [
                            {text: 'From: ', bold:true},
                            {text: rfi.requestedBy}
                        ],
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Subject: ', bold:true},
                            {text: rfi.subject}
                        ],
                        margin: [0, 50, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Question: \n\n', bold:true},
                            {text: rfi.contractorQuestion}
                        ],
                        margin: [0, 30, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Suggestion: \n\n', bold:true},
                            {text: rfi.contractorSuggestion}
                        ],
                        margin: [0, 30, 0, 0]
                    }
                ]
            }

            pdfMake.createPdf(docDefinition).open();
        },
        downloadPdf: function(rfi){
            var docDefinition = {
                content: [
                    {
                        text: 'Request For Information',
                        style: 'header',
                        alignment: 'center',
                        bold: true,
                        fontSize: 18
                    },
                    {
                        text:[
                            {text: 'Date: ', bold:true},
                            {text: rfi.date}
                        ],
                        margin: [0, 50, 0, 0]
                    },
                    {
                        text: [
                            {text: 'To: ', bold:true},
                            {text: rfi.to}
                        ],
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: [
                            {text: 'From: ', bold:true},
                            {text: rfi.requestedBy}
                        ],
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Subject: ', bold:true},
                            {text: rfi.subject}
                        ],
                        margin: [0, 50, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Question: \n\n', bold:true},
                            {text: rfi.contractorQuestion}
                        ],
                        margin: [0, 30, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Suggestion: \n\n', bold:true},
                            {text: rfi.contractorSuggestion}
                        ],
                        margin: [0, 30, 0, 0]
                    }
                ]
            };

            pdfMake.createPdf(docDefinition).download();
        },
        printPdf: function(rfi){
            var docDefinition = {
                content: [
                    {
                        text: 'Request For Information',
                        style: 'header',
                        alignment: 'center',
                        bold: true,
                        fontSize: 18
                    },
                    {
                        text:[
                            {text: 'Date: ', bold:true},
                            {text: rfi.date}
                        ],
                        margin: [0, 50, 0, 0]
                    },
                    {
                        text: [
                            {text: 'To: ', bold:true},
                            {text: rfi.to}
                        ],
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: [
                            {text: 'From: ', bold:true},
                            {text: rfi.requestedBy}
                        ],
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Subject: ', bold:true},
                            {text: rfi.subject}
                        ],
                        margin: [0, 50, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Question: \n\n', bold:true},
                            {text: rfi.contractorQuestion}
                        ],
                        margin: [0, 30, 0, 0]
                    },
                    {
                        text: [
                            {text: 'Suggestion: \n\n', bold:true},
                            {text: rfi.contractorSuggestion}
                        ],
                        margin: [0, 30, 0, 0]
                    }
                ]
            }

            pdfMake.createPdf(docDefinition).print();
        }
	};

	return rfiServiceObject;
})
.factory('employeeService', function(dataService, alertService, $location, $timeout){
    var userEmployee = dataService.$child('userEmployee');

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
		saveNewEmployee: function(employee, userId){
            userEmployee.$child(userId).$child('employee').$add(employee, onComplete(null, 'save'));
		},
        getEmployeesByUser: function(userId){
            return userEmployee.$child(userId).$child('employee');
        },
        updateEmployee: function(empId, employee, userId){
//            console.log(empId);
//            console.log(employee);
//            console.log(userId);
            userEmployee.$child(userId).$child('employee').$child(empId).$set(employee, onComplete(null, 'save'));
        },
        deleteEmployee: function(employeeId, userId){
//            console.log(employeeId);
//            console.log(userId);
            userEmployee.$child(userId).$child('employee').$remove(employeeId, onComplete(null, 'delete'));
        }
	};
    
	return employeeServiceObject;
    
})
.factory('timesheetService', function(dataService, $location){
	var userTimesheet = dataService.$child('userTimesheet');

	var timesheetServiceObject = {
		saveNewTimesheet: function(employeeTimesheet, userId, weekEnding){
            userTimesheet.$child(userId).$child('weekEnding').$child(weekEnding).$child('employeeTimesheet').$add(employeeTimesheet);
            //console.log(timesheet);
		},
        getTimesheetByUser: function(userId){
            return userTimesheet.$child(userId).$child('weekEnding');
        },
        getTimesheetByWeekEnding: function(userId, weekEnding){
            return userTimesheet.$child(userId).$child('weekEnding').$child(weekEnding);
        }
	};

	return timesheetServiceObject;
})
.factory('taskService', function(dataService){
    var projectTaskList = dataService.$child('projectTaskList');
    
    var taskServiceObject = {
        saveToDoTask: function(task, projectId){
            projectTaskList.$child(projectId).$child('taskList').$child('toDo').$add(task);
        },
        saveCompleteTask: function(taskId, projectId){
            var taskObject = projectTaskList.$child(projectId).$child('taskList').$child('toDo').$child(taskId);
            var newTask = {task: taskObject.task};
            projectTaskList.$child(projectId).$child('taskList').$child('complete').$add(newTask);  
            projectTaskList.$child(projectId).$child('taskList').$child('toDo').$remove(taskId);
        },
        getToDoTasksByProject: function(projectId){
            return projectTaskList.$child(projectId).$child('taskList').$child('toDo');
        },
        getCompleteTasksByProject: function(projectId){
            return projectTaskList.$child(projectId).$child('taskList').$child('complete');  
        },
        deleteTask: function(taskId, projectId){
            projectTaskList.$child(projectId).$child('taskList').$child('toDo').$remove(taskId);
        }
        
    };
    
    return taskServiceObject;
    
})
.factory('timelineService', function(dataService){
    var projectTimeline = dataService.$child('projectTimeline');
    
    var timelineServiceObject = {
        saveNewTask: function(newTask, projectId){
            
        var originDate = new Date('03/01/2016');
        var enteredDate = new Date(newTask.startDate);
        var miliseconds = enteredDate - originDate;
        var seconds = miliseconds/1000;
        var minutes = seconds/60;
        var hours = minutes/60;
        var days = hours/24;
        console.log(days);
            
//            projectTimeline.$child(projectId).$child('taskList').$add(newTask);
        },
        getTimelineTasksByProject: function(projectId){
            return projectTimeline.$child(projectId).$child('taskList');
        }
        
    };
    
    return timelineServiceObject;
    
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
