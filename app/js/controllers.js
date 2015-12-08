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

}])
.controller('ProjectsController', ['$scope', 'projectService', 'authService',function($scope, projectService, authService) {
	//Bind user projects to $scope.projects
	authService.getCurrentUser().then(function(user){
		if(user){
			$scope.projects = projectService.getProjectsByUserId(user.id);
		};
	});


	//Object to store data from the project form
  	$scope.newProject = {name: '', address: '', city: '', state: '', zip: '', phone: '', email: '', startdate: '', enddate: ''};

  	//function to save a new project
  	$scope.saveProject = function(){
  		projectService.saveProject($scope.newProject, $scope.currentUser.id);
  		$scope.newProject = {name: '', address: '', city: '', state: '', zip: '', phone: '', email: '', startdate: '', enddate: ''};
  	};

}])
.controller('DailyReportsController', ['$scope', 'dailyReportsService',function($scope, dailyReportsService) {

	//Object to store data from the Daily reports form
	$scope.newDailyReport = {date: '', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};

	//function to save a new Daily Report
	$scope.saveDailyReport = function(){
		dailyReportsService.saveDailyReport($scope.newDailyReport);
		$scope.newDailyReport = {date: '', jobNumber: '', crew: '', foreman: '', operators: '', laborers: '', other: '', equipment: '', subcontractors:'', workPerformed: '', extraWorkPerformed: '', otherNotes: ''};
	};

}])
.controller('RequestForInfoController', ['$scope', 'rfiService', function($scope, rfiService){

	//Object to store data from the rfi form
	$scope.newRfi = {date: '', project: '', to: '', requestedBy: '', subject: '', contractorQuestion: ''};

	//function to save a new Rfi
	$scope.saveRfi = function(){
		rfiService.saveRfi($scope.newRfi);
		$scope.newRfi = {date: '', project: '', to: '', requestedBy: '', subject: '', contractorQuestion: ''};
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
	$scope.newTimesheet = {firstName:'', lastName:'', weekEnding:'', timeSheet: {
														saturday: {job:'', hours:''},
														sunday: {job:'', hours:''},
														monday: {job:'', hours:''},
														tuesday: {job:'', hours:''},
														wednesday: {job:'', hours:''},
														thursday: {job:'', hours:''},
														friday: {job:'', hours:''}
														}}

	//Bind employees to $scope so I can show them on the timesheet page
	$scope.employees = employeeService.getEmployees();

	$scope.saveNewTimesheet = function(){
        
        console.log($scope.newTimesheet);
		timesheetService.saveNewTimesheet($scope.newTimesheet);
		$scope.newTimesheet = {firstName:'', lastName:'', weekEnding:'', timeSheet:{
														saturday: {job:'', hours:''},
														sunday: {job:'', hours:''},
														monday: {job:'', hours:''},
														tuesday: {job:'', hours:''},
														wednesday: {job:'', hours:''},
														thursday: {job:'', hours:''},
														friday: {job:'', hours:''}
                                                         }	}
	};
}])
.controller('AlertsController', ['$scope', 'alertService', function($scope, alertService){
    
    $scope.alerts = alertService.alerts;

}])


