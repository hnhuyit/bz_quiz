angular
    .module('Auth', ['toastr']).config(function(toastrConfig) {
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