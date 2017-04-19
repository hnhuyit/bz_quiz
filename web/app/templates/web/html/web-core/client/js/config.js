var app = angular.module('myapp', [
		'ngCookies' , 
		'ngResource', 
		'ngMessages', 
		'LocalStorageModule', 
		'Contact', 
		'Auth', 
		'Notify', 
		'Group', 
		'Subject', 
		'Chapter', 
		'Quiz', 
		'Home', 
		'Question'
	]).config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});

angular
    .module('Core', ['toastr']).config(function(toastrConfig) {
	    angular.extend(toastrConfig, {
	      autoDismiss: false,
	      containerId: 'toast-container',
	      maxOpened: 0,    
	      newestOnTop: true,
	      positionClass: 'toast-bottom-right',
	      preventDuplicates: false,
	      preventOpenDuplicates: false,
	      timeOut: 2000,
	      target: 'body'
	    });
	  })