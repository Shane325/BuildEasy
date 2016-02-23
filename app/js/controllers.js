'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('LandingPageController', [function() {

}])
.controller('AuthController', ['$scope', '$location', 'authService', function($scope, $location, authService) {
	//Object bound to inputs on the register and login pages
	$scope.user = {email: '', password: '', firstName: '', lastName: '', companyName: ''};

	//Method to register a new user using the authService
	$scope.register = function() {
        //register new user with firebase
		authService.register($scope.user);
	};

	//Method to log in a user using the authService
	$scope.login = function() {
		authService.login($scope.user, 'n');
	};

	//Method to logout a user using the authService
	$scope.logout = function() {
		authService.logout();
	};
    
    //Method to send user a reset password email
    $scope.sendPasswordResetEmail = function() {
        authService.sendPasswordResetEmail($scope.user);  
    };
    
    //Method to reset the users password
    $scope.changePassword = function() {
        authService.changePassword($scope.userDetails);  
    };

}])
.controller('WelcomeController', ['$scope', '$location', 'authService', 'welcomeService', function($scope, $location, authService, welcomeService) {
    //get current user info and bind it to scope
    authService.getCurrentUser().then(function(user){
        if(user){
            $scope.userInfo = welcomeService.getUserInfo(user.id);
        }
    }); 
    
}])
.controller('HomeController', ['$scope', 'homeService', 'authService', '$routeParams', '$location', function($scope, homeService, authService, $routeParams, $location){
    
    $scope.projectId = $routeParams.projectId;
    
    authService.getCurrentUser().then(function(user){
        if(user){
            $scope.currentProject = homeService.getProjectByProjectId(user.id, $scope.projectId);
            
            console.log($scope.currentProject);
        } 
    });
    
    //navigate to the rfi page
    $scope.selectRfis = function(projectId){
        $location.path('/rfi_list/' + projectId);  
    };
    
    //navigate to the daily report page
    $scope.selectDailyReport = function(projectId){
        $location.path('/daily_report_list/' + projectId);  
    };
    
    //navigate to the employee page
    $scope.selectEmployees = function(projectId){
        $location.path('/employees/' + projectId);  
    };
    
    //navigate to the timesheet page
    $scope.selectTimesheet = function(projectId){
        $location.path('/timesheet_list/' + projectId);
    };
    
    //navigate to the tasks page
    $scope.selectTasks = function(projectId){
        $location.path('/tasks/' + projectId);  
    };
    
    //navigate to timeline page
    $scope.selectTimeline = function(projectId){
        $location.path('/timeline/' + projectId);  
    };
    
}])
.controller('ProjectsController', ['$scope', 'projectService', 'authService', '$location', function($scope, projectService, authService, $location) {   
    //Bind user projects to $scope.projects
	authService.getCurrentUser().then(function(user){
		if(user){
			$scope.projects = projectService.getProjectsByUserId(user.id);
		};
	});

    //function to select a project from the table
    $scope.selectProject = function(project){
        $location.path('/home_page/' + project.$id);
    };

	//Object to store data from the project form
  	$scope.newProject = {name: '', jobNumber: '', projectInfo:'', startdate: ''};

  	//function to save a new project
  	$scope.saveProject = function(){
        
  		projectService.saveProject($scope.newProject, $scope.currentUser.id);
  		$scope.newProject = {name: '', jobNumber:'', projectInfo:'', startdate: ''};
  	};

}])
.controller('DailyReportsController', ['$scope', '$routeParams', '$location', 'dailyReportsService', 'navService', function($scope, $routeParams, $location, dailyReportsService, navService) {
    
    //capture the routeparams variable
    $scope.projectId = $routeParams.projectId;
    
	//Object to store data from the Daily reports form
	$scope.newDailyReport = {date: '', project:'', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};

	//function to save a new Daily Report
	$scope.saveDailyReport = function(){
		dailyReportsService.saveDailyReport($scope.newDailyReport, $scope.projectId);
		$scope.newDailyReport = {date: '', project:'', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};
	};
    
    //function that populates daily report modal
    $scope.editDailyReport = function(dailyReportId, dailyReport){
        
        var newDate = new Date(dailyReport.date);
        
        $scope.dailyReportTemp = {date: newDate, project:dailyReport.project, jobNumber: dailyReport.jobNumber, crew: dailyReport.crew, foreman: dailyReport.foreman, operators: dailyReport.operators, laborers: dailyReport.laborers, other: dailyReport.other, equipment: dailyReport.equipment, subcontractors: dailyReport.subcontractors, workPerformed: dailyReport.workPerformed, extraWorkPerformed: dailyReport.extraWorkPerformed, otherNotes: dailyReport.otherNotes};
        
        $scope.dailyReportId = dailyReportId;
    };
    
    //bind daily reports to scope for this project, so I can display them to the user
    $scope.dailyReports = dailyReportsService.getDailyReportByProject($scope.projectId);
    
    //function to update changes to a daily report
    $scope.updateDailyReport = function(){
        dailyReportsService.updateDailyReport($scope.dailyReportId, $scope.dailyReportTemp, $scope.projectId);  
    };

    //navigation functions
    $scope.goToDailyReportPage = function(){
        $location.path('/daily_reports/' + $scope.projectId);  
    };
    
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);
    };
    
    $scope.goToDailyReportList = function(){
        navService.goToDailyReportList($scope.projectId);  
    };
    
}])
.controller('RequestForInfoController', ['$scope', '$routeParams', '$location', 'rfiService', 'navService', function($scope, $routeParams, $location, rfiService, navService){
    
    //test the routeParams object
    $scope.projectId = $routeParams.projectId;
    
	//Object to store data from the rfi form
	$scope.newRfi = {rfiNumber:'', date: '', project: '', jobNumber:'', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:''};
    
	//function to save a new Rfi
	$scope.saveRfi = function(){
        //console.log($scope.newRfi);
        rfiService.saveRfi($scope.newRfi, $scope.projectId);
		$scope.newRfi = {rfiNumber:'', date: '', project: '', jobNumber:'', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:''};
	};
    
    //Bind RFI's to the scope so I can display them for the user
    $scope.requestForInformation = rfiService.getRfisByProject($scope.projectId);
    
    //Edit rfi function
    $scope.editRfi = function(rfiId, rfi){
        //convert date string into correct format 
        var newDate = new Date(rfi.date);
        
        $scope.rfiTemp = {rfiNumber:rfi.rfiNumber, date: newDate, project: rfi.project, jobNumber: rfi.jobNumber, to: rfi.to, cc:rfi.cc, requestedBy: rfi.requestedBy, subject: rfi.subject, contractorQuestion: rfi.contractorQuestion, contractorSuggestion:rfi.contractorSuggestion};
        $scope.rfiId = rfiId;

    };
    
    //update rfi object
    $scope.updateRfi = function(){
        rfiService.updateRfi($scope.rfiId, $scope.rfiTemp, $scope.projectId);
    };
    
    //delete rfi object
    $scope.deleteRfi = function(rfiId){
        rfiService.deleteRfi(rfiId, $scope.projectId);
    };
    
    //submit email rfi
    $scope.submitRfi = function(rfi){
        rfiService.submitRfi(rfi);  
    };
    
    // navigation functions
    $scope.goToRfiList = function(){
        navService.goToRfiList($scope.projectId);
    };
    
    $scope.goToRfi = function(){
        navService.goToRfi($scope.projectId);
    };

    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);
    };
    
    //PDF functions
    $scope.openAsPdf = function(rfi){
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
    };
    
    $scope.downloadPdf = function(rfi){
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
    }; 
    
    $scope.printPdf = function(rfi){
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
    };

}])
.controller('EmployeeController', ['$scope', '$routeParams', 'employeeService', 'alertService', 'navService', 'authService', function($scope, $routeParams, employeeService, alertService, navService, authService){
    
    //get projectId from route params variable
    $scope.projectId = $routeParams.projectId;
    
    //get current userId
    authService.getCurrentUser().then(function(user){
		if(user){
            //Bind employees to $scope so I can show them on the employee page
            $scope.employees = employeeService.getEmployeesByUser(user.id);
            //console.log(user.id);
            $scope.userId = user.id;
		};
	});

	//Object to store new employee details
	$scope.newEmployee = {firstName: '', lastName: '', phone: '', trade:''};

	//function to save a new employee
	$scope.saveNewEmployee = function(){
		employeeService.saveNewEmployee($scope.newEmployee, $scope.userId);
		$scope.newEmployee = {firstName: '', lastName: '', phone: '', trade:''};
       
	};
    
    $scope.clearNewEmployee = function(){

        $scope.newEmployee = {firstName: '', lastName: '', phone: '', trade:''}; 
        
    };

    $scope.editEmployee = function(empId, employee){
        
        $scope.employeeTemp = {firstName: employee.firstName, lastName: employee.lastName, phone: employee.phone, trade: employee.trade};
        $scope.employeeId = empId;
    };
    
    $scope.updateEmployee = function(){
        employeeService.updateEmployee($scope.employeeId, $scope.employeeTemp, $scope.userId);
    };
    
    $scope.deleteEmployee = function(employeeId){
        employeeService.deleteEmployee(employeeId, $scope.userId);  
    };
    
    // navigation functions
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);  
    };


}])
.controller('TimesheetController', ['$scope', '$routeParams', 'timesheetService', 'employeeService', 'navService', 'authService', function($scope, $routeParams, timesheetService, employeeService, navService, authService){

    //get current userEmployees
    authService.getCurrentUser().then(function(user){
		if(user){
            //console.log(user.id);
            $scope.userId = user.id;
            //console.log($scope.userId);
            $scope.employees = employeeService.getEmployeesByUser($scope.userId);
            $scope.timesheets = timesheetService.getTimesheetByUser($scope.userId);
		};
	});
    
    //get projectId from route params variable
    $scope.projectId = $routeParams.projectId;
    
    //Calculate date value for weekEnding field
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 5; // last day is the first day + 5. This will give week ending of Friday    
    
    $scope.weekEnding = new Date(curr.setDate(last)).toDateString();
    
    $scope.employeeTimesheet = {};

	$scope.saveNewTimesheet = function(){
        timesheetService.saveNewTimesheet($scope.employeeTimesheet, $scope.userId, $scope.weekEnding);
        $scope.employeeTimesheet = {};
        $scope.goToTimesheetList();
	};
    
    $scope.editTimesheet = function(timesheetId){
        $scope.timesheetTemp = {};
        $scope.timesheetTemp = timesheetService.getTimesheetByWeekEnding($scope.userId, timesheetId);
        console.log($scope.timesheetTemp.employeeTimesheet);
//        console.log($scope.timesheetTemp.employeeTimesheet);
//        angular.forEach($scope.employees, function(value, key){
//            console.log();
//        })
//        console.log($scope.employees);

//        angular.forEach($scope.timesheetTemp.employeeTimesheet, function(value, key){
////                        console.log(key);
////                        console.log(value);
//            angular.forEach(value, function(value, key){
//                console.log(key);
//            })
//                        })
    }
    
    // navigation functions
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);
    };
    
    $scope.goToTimesheet = function(){
        navService.goToTimesheet($scope.projectId);  
    };
    
    $scope.goToTimesheetList = function(){
        navService.goToTimesheetList($scope.projectId);
    };
    
}])
.controller('AlertsController', ['$scope', 'alertService', function($scope, alertService){
    
    $scope.alerts = alertService.alerts;

}])
.controller('TaskController', ['$scope', '$routeParams', 'navService', 'taskService', function($scope, $routeParams, navService, taskService){
    
    //get projectId from route params variable
    $scope.projectId = $routeParams.projectId;
    
    //navigation functions
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);
    };
    
    //taskList
    $scope.taskList = {};
    
    //save task function
    $scope.saveTask = function(){
        taskService.saveToDoTask($scope.taskList, $scope.projectId);
        $scope.taskList = {};
    }
    
    $scope.completeTask = function(taskId){
        taskService.saveCompleteTask(taskId, $scope.projectId);
        //taskService.deleteTask(taskId, $scope.projectId);
    }
    
    //delete task function
    $scope.deleteTask = function(taskId){
        taskService.deleteTask(taskId, $scope.projectId);
    }
    
    //get task by project
    $scope.toDoProjectTasks = taskService.getToDoTasksByProject($scope.projectId);
    $scope.completeProjectTasks = taskService.getCompleteTasksByProject($scope.projectId);
    
}])
.controller('TimelineController', ['$scope', '$routeParams', 'navService', 'timelineService', function ($scope, $routeParams, navService, timelineService){
    //get projectId from routeParams
    $scope.projectId = $routeParams.projectId;
    
    $scope.newTask = {taskName:'', startDate:'', endDate:'', delay:'', duration:''};
    
    //save new task item
    $scope.saveNewTask = function(){
        timelineService.saveNewTask($scope.newTask, $scope.projectId);
        $scope.newTask = {taskName:'', startDate:'', endDate:'', delay:'', duration:''};
    }
    
    $scope.timelineTasks = timelineService.getTimelineTasksByProject($scope.projectId);
    
    //navigation function
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);  
    };
}])


