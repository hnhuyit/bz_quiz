'use strict';
/**
 * Created by chung on 7/23/15.
 */
angular.module('Core').filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);