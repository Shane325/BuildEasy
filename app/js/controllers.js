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
    })
    
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
    
}])
.controller('ProjectsController', ['$scope', 'projectService', 'authService', '$location', '$log', function($scope, projectService, authService, $location, $log) {   
    //Bind user projects to $scope.projects
	authService.getCurrentUser().then(function(user){
		if(user){
			$scope.projects = projectService.getProjectsByUserId(user.id);
		};
	});

    //function to select a project from the table
    $scope.selectProject = function(project){
        console.log(project.$id);
        $location.path('/home_page/' + project.$id);
    };

	//Object to store data from the project form
  	$scope.newProject = {name: '', address: '', city: '', state: '', zip: '', phone: '', email: '', startdate: '', enddate: ''};

  	//function to save a new project
  	$scope.saveProject = function(){
        
  		projectService.saveProject($scope.newProject, $scope.currentUser.id);
  		$scope.newProject = {name: '', address: '', city: '', state: '', zip: '', phone: '', email: '', startdate: '', enddate: ''};
        $location.path('/projects');
  	};

}])
.controller('DailyReportsController', ['$scope', '$routeParams', '$location', 'dailyReportsService', function($scope, $routeParams, $location, dailyReportsService) {
    
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
        
        console.log($scope.dailyReportTemp);
        console.log($scope.dailyReportId);
    };
    
    //function to update changes to a daily report
    $scope.updateDailyReport = function(){
        dailyReportsService.updateDailyReport($scope.dailyReportId, $scope.dailyReportTemp, $scope.projectId);  
    };
    
    //function to clear the form
    $scope.clearNewDailyReport = function(){
        $scope.newDailyReport = {date: '', project:'', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};
    };

    //function to navigate from daily report list to daily report form
    $scope.goToDailyReportPage = function(){
        $location.path('/daily_reports/' + $scope.projectId);  
    };
    
    //bind daily reports to scope for this project, so I can display them to the user
    $scope.dailyReports = dailyReportsService.getDailyReportByProject($scope.projectId);
    
}])
.controller('RequestForInfoController', ['$scope', '$routeParams', '$location', 'rfiService', 'navService', function($scope, $routeParams, $location, rfiService, navService){
    
    //get todays date for the date input field on the rfi form
//    var date = new Date();
//    var day = date.getDate();
//    var month = date.getMonth() + 1;
//    var year = date.getFullYear();
//    if (month < 10) month = "0" + month;
//    if (day < 10) day = "0" + day;
//    $scope.today = new Date(year, month, day);
    
    //test the routeParams object
    $scope.projectId = $routeParams.projectId;
    
	//Object to store data from the rfi form
	$scope.newRfi = {rfiNumber:'', date: '', project: '', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:'', isChange:''};
    
	//function to save a new Rfi
	$scope.saveRfi = function(){
        //console.log($scope.newRfi);
        rfiService.saveRfi($scope.newRfi, $scope.projectId);
		$scope.newRfi = {rfiNumber:'', date: '', project: '', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:'', isChange:''};
	};
    
    //function for the Clear button
    $scope.clearNewRfi = function(){
        $scope.newRfi = {rfiNumber:'', date: '', project: '', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:'', isChange:''};        
    };
    
    //Bind RFI's to the scope so I can display them for the user
    $scope.requestForInformation = rfiService.getRfisByProject($scope.projectId);
    
    //Edit rfi function
    $scope.editRfi = function(rfiId, rfi){
        //convert date string into correct format 
        var newDate = new Date(rfi.date);
        
        $scope.rfiTemp = {rfiNumber:rfi.rfiNumber, date: newDate, project: rfi.project, to: rfi.to, cc:rfi.cc, requestedBy: rfi.requestedBy, subject: rfi.subject, contractorQuestion: rfi.contractorQuestion, contractorSuggestion:rfi.contractorSuggestion, isChange:rfi.isChange};
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

}])
.controller('EmployeeController', ['$scope', '$routeParams', 'employeeService', 'alertService', function($scope, $routeParams, employeeService, alertService){
    
    //get projectId from route params variable
    $scope.projectId = $routeParams.projectId;

	//Object to store new employee details
	$scope.newEmployee = {firstName: '', lastName: '', phone: '', email: '', rate: ''};

	//function to save a new employee
	$scope.saveNewEmployee = function(){
		employeeService.saveNewEmployee($scope.newEmployee, $scope.projectId);
		$scope.newEmployee = {firstName: '', lastName: '', phone: '', email: '', rate: ''};
	};
    
    $scope.clearNewEmployee = function(){

        $scope.newEmployee = {firstName: '', lastName: '', phone: '', email: '', rate: ''}; 
        
    };

    //Bind employees to $scope so I can show them on the employee page
    $scope.employees = employeeService.getEmployeesByProject($scope.projectId);

    $scope.editEmployee = function(employee){
        
        $scope.employeeTemp = {firstName: employee.firstName, lastName: employee.lastName, phone: employee.phone, email: employee.email, rate: employee.rate};
        $scope.employeeId = employee.$id;
    };
    
    $scope.updateEmployee = function(){
        employeeService.updateEmployee($scope.employeeId, $scope.employeeTemp, $scope.projectId);
    };
    
    $scope.deleteEmployee = function(employee){
        employeeService.deleteEmployee(employee, $scope.projectId);  
    };


}])
.controller('TimesheetController', ['$scope', 'timesheetService', 'employeeService', function($scope, timesheetService, employeeService){

	//Object to store new Timesheet
	$scope.newTimesheet =  {weekEnding: '', timeSheet: {firstName:'', lastName:'', employeeTimeSheet: {
                                                                                                        saturday: {job:'', hours:''},
                                                                                                        sunday: {job:'', hours:''},
                                                                                                        monday: {job:'', hours:''},
                                                                                                        tuesday: {job:'', hours:''},
                                                                                                        wednesday: {job:'', hours:''},
                                                                                                        thursday: {job:'', hours:''},
                                                                                                        friday: {job:'', hours:''}
														                                              }
                                                       }
                            }

	//Bind employees to $scope so I can show them on the timesheet page
	$scope.employees = employeeService.getEmployees();

	$scope.saveNewTimesheet = function(){
        
        //Calculate date value for weekEnding field
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var last = first + 5; // last day is the first day + 5. This will give week ending of Friday
        //var firstday = new Date(curr.setDate(first)).toUTCString();
        //var lastday = new Date(curr.setDate(last)).toUTCString();
        $scope.newTimesheet.weekEnding = new Date(curr.setDate(last)).toDateString();
        
        //console.log($scope.newTimesheet.weekEnding);

		timesheetService.saveNewTimesheet($scope.newTimesheet);
        //clear newTimesheet model
		$scope.newTimesheet =  {weekEnding: '', timeSheet: {firstName:'', lastName:'', employeeTimeSheet: {
                                                                                                        saturday: {job:'', hours:''},
                                                                                                        sunday: {job:'', hours:''},
                                                                                                        monday: {job:'', hours:''},
                                                                                                        tuesday: {job:'', hours:''},
                                                                                                        wednesday: {job:'', hours:''},
                                                                                                        thursday: {job:'', hours:''},
                                                                                                        friday: {job:'', hours:''}
														                                              }
                                                       }
                            }
	};
}])
.controller('AlertsController', ['$scope', 'alertService', function($scope, alertService){
    
    $scope.alerts = alertService.alerts;

}])


