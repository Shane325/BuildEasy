'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'angularMoment',
  'ngMessages',
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'firebase'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
  	templateUrl: 'partials/landing_page.html',
  	controller: 'LandingPageController'
  });
  $routeProvider.when('/register', {
  	templateUrl: 'partials/register.html',
  	controller: 'AuthController'
  });
  $routeProvider.when('/login', {
  	templateUrl: 'partials/login.html',
  	controller: 'AuthController'
  });
  $routeProvider.when('/projects', {
    templateUrl: 'partials/projects.html',
    controller: 'ProjectsController'
  });
  $routeProvider.when('/daily_reports/:projectId', {
    templateUrl: 'partials/daily_reports.html',
    controller: 'DailyReportsController'
  });
  $routeProvider.when('/rfi/:projectId', {
    templateUrl: 'partials/rfi.html',
    controller: 'RequestForInfoController'
  });
  $routeProvider.when('/timesheet/:projectId', {
    templateUrl: 'partials/timesheet.html',
    controller: 'TimesheetController'
  });
  $routeProvider.when('/timesheet_list/:projectId', {
    templateUrl: 'partials/timesheet_list.html',
    controller: 'TimesheetController'
  });
  $routeProvider.when('/home_page/:projectId', {
    templateUrl: 'partials/home_page.html',
    controller: 'HomeController'
  });
  $routeProvider.when('/employees/:projectId', {
    templateUrl: 'partials/employees.html',
    controller: 'EmployeeController'
  });
  $routeProvider.when('/reset_password', {
    templateUrl: 'partials/reset_password.html',
    controller: 'AuthController'
  });
  $routeProvider.when('/rfi_list/:projectId', {
    templateUrl: 'partials/rfi_list.html',
    controller: 'RequestForInfoController'
  });
  $routeProvider.when('/welcome', {
    templateUrl: 'partials/welcome.html',
    controller: 'WelcomeController'
  });
  $routeProvider.when('/daily_report_list/:projectId', {
    templateUrl: 'partials/daily_report_list.html',
    controller: 'DailyReportsController'
  });
  $routeProvider.when('/tasks/:projectId', {
    templateUrl: 'partials/tasks.html',
    controller: 'TaskController'
  });
  $routeProvider.when('/timeline/:projectId', {
    templateUrl: 'partials/timeline.html',
    controller: 'TimelineController'
  });
  $routeProvider.otherwise({redirectTo: '/'});
}]);
