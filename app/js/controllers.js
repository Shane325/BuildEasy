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
.controller('HomeController', ['$scope', '$routeParams', 'homeService', 'authService', 'navService', function($scope, $routeParams, homeService, authService, navService){
    
    //get projectId from the routeParams
    $scope.projectId = $routeParams.projectId;
    
    //get current user and their project list
    authService.getCurrentUser().then(function(user){
        if(user){
            $scope.currentProject = homeService.getProjectByProjectId(user.id, $scope.projectId);
        } 
    });
    
    //navigate to the rfi page
    $scope.selectRfis = function(projectId){
        navService.goToRfiList(projectId);
    };
    
    //navigate to the daily report page
    $scope.selectDailyReport = function(projectId){
        navService.goToDailyReportList(projectId);
    };
    
    //navigate to the employee page
    $scope.selectEmployees = function(projectId){
        navService.goToEmployees(projectId);
    };
    
    //navigate to the timesheet page
    $scope.selectTimesheet = function(projectId){
        navService.goToTimesheetList(projectId);
    };
    
    //navigate to the tasks page
    $scope.selectTasks = function(projectId){
        navService.goToTasks(projectId);
    };
    
    //navigate to timeline page
    $scope.selectTimeline = function(projectId){
        navService.goToTimeline(projectId);
    };
    
    //navigate to cost tracking page
    $scope.selectCostTracking = function(projectId){
        navService.goToCostTracking(projectId);  
    };
    
}])
.controller('ProjectsController', ['$scope', 'projectService', 'authService', 'navService', function($scope, projectService, authService, navService) {   
    //Bind user projects to $scope.projects
	authService.getCurrentUser().then(function(user){
		if(user){
			$scope.projects = projectService.getProjectsByUserId(user.id);
		};
	});

    //function to select a project from the table
    $scope.selectProject = function(project){
        navService.goToHomePage(project.$id);
    };

	//Object to store data from the project form
  	$scope.newProject = {name: '', jobNumber: '', projectInfo:'', startdate: ''};

  	//function to save a new project
  	$scope.saveProject = function(){
  		projectService.saveProject($scope.newProject, $scope.currentUser.id);
  		$scope.newProject = {name: '', jobNumber:'', projectInfo:'', startdate: ''};
  	};
    
    //clear project form and scope
    $scope.clearNewProject = function(){
        $scope.newProject = {name: '', jobNumber: '', projectInfo:'', startdate: ''};  
    };

}])
.controller('DailyReportsController', ['$scope', '$routeParams', '$location', 'dailyReportsService', 'navService', function($scope, $routeParams, $location, dailyReportsService, navService) {
    
    //get projectId from routeParams
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
    
    //clear daily report form and scope
    $scope.clearNewDailyReport = function(){
        $scope.newDailyReport = {date: '', project:'', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};
    };
    
    //bind daily reports to scope for this project, so I can display them to the user
    $scope.dailyReports = dailyReportsService.getDailyReportByProject($scope.projectId);
    
    //function to update changes to a daily report
    $scope.updateDailyReport = function(){
        dailyReportsService.updateDailyReport($scope.dailyReportId, $scope.dailyReportTemp, $scope.projectId);  
    };

    //navigation functions
    $scope.goToDailyReportPage = function(){
        navService.goToDailyReports($scope.projectId);
    };
    
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);
    };
    
    $scope.goToDailyReportList = function(){
        navService.goToDailyReportList($scope.projectId);  
    };
    
}])
.controller('RequestForInfoController', ['$scope', '$routeParams', '$location', 'rfiService', 'navService', function($scope, $routeParams, $location, rfiService, navService){
    
    //get projectId from routeParams
    $scope.projectId = $routeParams.projectId;
    
	//Object to store data from the rfi form
	$scope.newRfi = {rfiNumber:'', date: '', project: '', jobNumber:'', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:''};
    
	//function to save a new Rfi
	$scope.saveRfi = function(){
        rfiService.saveRfi($scope.newRfi, $scope.projectId);
		$scope.newRfi = {rfiNumber:'', date: '', project: '', jobNumber:'', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:''};
	};
    
    //Bind RFI's to the scope so I can display them for the user
    $scope.requestForInformation = rfiService.getRfisByProject($scope.projectId);
    
    //Edit rfi function
    $scope.editRfi = function(rfiId, rfi){
        var newDate = new Date(rfi.date);
        $scope.rfiTemp = {rfiNumber:rfi.rfiNumber, date: newDate, project: rfi.project, jobNumber: rfi.jobNumber, to: rfi.to, cc:rfi.cc, requestedBy: rfi.requestedBy, subject: rfi.subject, contractorQuestion: rfi.contractorQuestion, contractorSuggestion:rfi.contractorSuggestion};
        $scope.rfiId = rfiId;
    };
    
    //clear rfi form and scope
    $scope.clearNewRfi = function(){
        $scope.newRfi = {rfiNumber:'', date: '', project: '', jobNumber:'', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:''};  
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
        rfiService.openAsPdf(rfi);
    };
    
    $scope.downloadPdf = function(rfi){
        rfiService.downloadPdf(rfi);
    }; 
    
    $scope.printPdf = function(rfi){
        rfiService.printPdf(rfi);
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
    
    //clear new employee object from form and scope
    $scope.clearNewEmployee = function(){
        $scope.newEmployee = {firstName: '', lastName: '', phone: '', trade:''}; 
    };

    //edit existing employee object
    $scope.editEmployee = function(empId, employee){
        $scope.employeeTemp = {firstName: employee.firstName, lastName: employee.lastName, phone: employee.phone, trade: employee.trade};
        $scope.employeeId = empId;
    };
    
    //update employee object
    $scope.updateEmployee = function(){
        employeeService.updateEmployee($scope.employeeId, $scope.employeeTemp, $scope.userId);
    };
    
    //delete an employee object
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
            $scope.userId = user.id;
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
    
    //object to store the timesheet info
    $scope.employeeTimesheet = {};

    //save new timesheet object
	$scope.saveNewTimesheet = function(){
        timesheetService.saveNewTimesheet($scope.employeeTimesheet, $scope.userId, $scope.weekEnding);
        $scope.employeeTimesheet = {};
        $scope.goToTimesheetList();
	};
    
    //edit timesheet object
    $scope.editTimesheet = function(timesheetId){
        $scope.timesheetTemp = {};
        $scope.timesheetTemp = timesheetService.getTimesheetByWeekEnding($scope.userId, timesheetId);
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
    
    //taskList object
    $scope.taskList = {};
    
    //get task by project
    $scope.toDoProjectTasks = taskService.getToDoTasksByProject($scope.projectId);
    $scope.completeProjectTasks = taskService.getCompleteTasksByProject($scope.projectId);
    
    //save task function
    $scope.saveTask = function(){
        taskService.saveToDoTask($scope.taskList, $scope.projectId);
        $scope.taskList = {};
    }
    
    $scope.completeTask = function(taskId){
        taskService.saveCompleteTask(taskId, $scope.projectId);
    }
    
    //delete task function
    $scope.deleteTask = function(taskId){
        taskService.deleteTask(taskId, $scope.projectId);
    }
    
    //navigation functions
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);
    };
    
}])
.controller('TimelineController', ['$scope', '$routeParams', 'navService', 'timelineService', function ($scope, $routeParams, navService, timelineService){
    //get projectId from routeParams
    $scope.projectId = $routeParams.projectId;
    
//    $scope.newTask = [{
//        name: '',
//        tasks: [{
//            name: '',
//            from: '',
//            to: ''
//        }]
//    }];
    
    //save new task item
    $scope.saveNewTask = function(){
        timelineService.saveNewTask($scope.newTask, $scope.projectId);
//        $scope.newTask = {taskName:'', startDate:'', endDate:''};
    }
    
    //get tasks by project
    $scope.projectTimelineTasks = timelineService.getTimelineTasksByProject($scope.projectId);
//    console.log($scope.projectTimelineTasks);
    $scope.data = [{
                        name: 'row 1',
                        tasks: [{
                            name: 'task 1',
                            from: '2016-01-01',
                            to: '2016-01-20'
                        }]
                    }];
    
    //navigation function
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);  
    };
   
}])
.controller('CostTrackingController', ['$scope', '$routeParams', 'navService', function($scope, $routeParams, navService){
    //get projectId from routeParams
    $scope.projectId = $routeParams.projectId;
    
    //navigation function
    $scope.goToDashboard = function(){
        navService.goToDashboard($scope.projectId);  
    };

}])


