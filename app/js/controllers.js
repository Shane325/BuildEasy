'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('LandingPageController', [function() {

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
    
    //Method to send user a reset password email
    $scope.sendPasswordResetEmail = function() {
        authService.sendPasswordResetEmail($scope.user);  
    };
    
    //Method to reset the users password
    $scope.changePassword = function() {
        authService.changePassword($scope.userDetails);  
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
        console.log(project.$id);
        $location.path('/home_page');
        
    };

	//Object to store data from the project form
  	$scope.newProject = {name: '', address: '', city: '', state: '', zip: '', phone: '', email: '', startdate: '', enddate: ''};

  	//function to save a new project
  	$scope.saveProject = function(){
        //convert date string into correct format 
//        var newStartDate = new Date($scope.newProject.startdate);
//        var newEndDate = new Date($scope.newProject.enddate);
//        
//        $scope.newProject.startdate = newStartDate;
//        $scope.newProject.enddate = newEndDate;
//        
//        console.log($scope.newProject.startdate);
//        console.log($scope.newProject.enddate);
        
  		projectService.saveProject($scope.newProject, $scope.currentUser.id);
  		$scope.newProject = {name: '', address: '', city: '', state: '', zip: '', phone: '', email: '', startdate: '', enddate: ''};
  	};

}])
.controller('DailyReportsController', ['$scope', 'dailyReportsService',function($scope, dailyReportsService) {

	//Object to store data from the Daily reports form
	$scope.newDailyReport = {date: '', project:'', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};

	//function to save a new Daily Report
	$scope.saveDailyReport = function(){
		dailyReportsService.saveDailyReport($scope.newDailyReport);
		$scope.newDailyReport = {date: '', project:'', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};
	};
    
    //function to clear the form
    $scope.clearNewDailyReport = function(){
        $scope.newDailyReport = {date: '', project:'', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};
    };

}])
.controller('RequestForInfoController', ['$scope', 'rfiService', function($scope, rfiService){

	//Object to store data from the rfi form
	$scope.newRfi = {rfiNumber:'', date: '', project: '', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:'', isChange:''};

	//function to save a new Rfi
	$scope.saveRfi = function(){
		
        console.log($scope.newRfi);
        rfiService.saveRfi($scope.newRfi);
		$scope.newRfi = {rfiNumber:'', date: '', project: '', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:'', isChange:''};
	};
    
    //function for the Clear button
    $scope.clearNewRfi = function(){
        $scope.newRfi = {rfiNumber:'', date: '', project: '', to: '', cc:'', requestedBy: '', subject: '', contractorQuestion: '', contractorSuggestion:'', isChange:''};        
    };
    
    //Bind RFI's to the scope so I can display them for the user
    $scope.requestForInformation = rfiService.getRfis();
    
    //Edit rfi function
    $scope.editRfi = function(rfi){
        //convert date string into correct format 
        var newDate = new Date(rfi.date);
        
        $scope.rfiTemp = {rfiNumber:rfi.rfiNumber, date: newDate, project: rfi.project, to: rfi.to, cc:rfi.cc, requestedBy: rfi.requestedBy, subject: rfi.subject, contractorQuestion: rfi.contractorQuestion, contractorSuggestion:rfi.contractorSuggestion, isChange:rfi.isChange};
        $scope.rfiId = rfi.$id;

    };
    
    //update rfi object
    $scope.updateRfi = function(){

        rfiService.updateRfi($scope.rfiId, $scope.rfiTemp);
    };
    
    //delete rfi object
    $scope.deleteRfi = function(rfi){
        rfiService.deleteRfi(rfi);
    };
    
    //submit/email rfi
    $scope.submitRfi = function(rfi){
        rfiService.submitRfi(rfi);  
    };

}])
.controller('EmployeeController', ['$scope', 'employeeService', 'alertService', function($scope, employeeService, alertService){

	//Object to store new employee details
	$scope.newEmployee = {firstName: '', lastName: '', phone: '', email: '', rate: ''};

	//function to save a new employee
	$scope.saveNewEmployee = function(){
		employeeService.saveNewEmployee($scope.newEmployee);
		$scope.newEmployee = {firstName: '', lastName: '', phone: '', email: '', rate: ''};
	};
    
    $scope.clearNewEmployee = function(){

        $scope.newEmployee = {firstName: '', lastName: '', phone: '', email: '', rate: ''}; 
        
    };

    //Bind employees to $scope so I can show them on the employee page
    $scope.employees = employeeService.getEmployees();

    $scope.editEmployee = function(employee){
        
        $scope.employeeTemp = {firstName: employee.firstName, lastName: employee.lastName, phone: employee.phone, email: employee.email, rate: employee.rate};
        $scope.employeeId = employee.$id;
    };
    
    $scope.updateEmployee = function(){
        employeeService.updateEmployee($scope.employeeId, $scope.employeeTemp);
    };
    
    $scope.deleteEmployee = function(employee){
        employeeService.deleteEmployee(employee);  
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


