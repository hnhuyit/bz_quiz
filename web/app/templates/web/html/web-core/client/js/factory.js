'use strict';
/**
 * Created by chung on 7/23/15.
 */
angular.module('Core')
    .factory("Option", Option)
    .factory("Notice", Notice);
    
function Option() {

    var statuses = [{name: "Publish", value: 1}, {'name': "Unpublish", value: 0}];

    var features = [{name: "Yes", value: 1}, {'name': "No", value: 0}];

    var yesno = [{name: "Yes", value: 1}, {'name': "No", value: 0}];

    var roles = [{name: 'Admin', value: 'admin'}, {name: 'User', value: 'user'}, {name: 'Student', value: 'student'}, {name: 'Teacher', value: 'teacher'}];

    var genders = [{name: 'male', value: 'male'}, {name: 'female', value: 'female'}];

    var types = [{name: 'Product', value: 'product'}, {name: 'Post', value: 'post'}, {name: 'Banner', value: 'banner'}];

    var bannerPositions = [{name: 'home', value: 'home'}, {name: 'right', value: 'right'}];

    var adsPositions = [{name: 'top', value: 'top'}, {name: 'right', value: 'right'}, {name: 'home', value: 'home'}];

    var typeQuestions = [
        {name: 'Nhiều lựa chọn một đáp án', value: 1}, 
        {name: 'Nhiều lựa chọn nhiều đáp án', value: 2}, 
        {name: 'Ghép hợp', value: 3}, 
        {name: 'Điền vào chỗ trống', value: 4}
    ];

    var levels = [{name: 'Dễ', value: 1}, {name: 'Trung bình', value: 2}, {name: 'Khó', value: 3}, {name: 'Rất khó', value: 4}];

    return {
        getStatus: function () {
            return statuses;
        },
        getRoles: function () {
            return roles;
        },
        getGenders: function () {
            return genders;
        },
        getFeatures: function () {
            return features;
        },
        getTypes: function () {
            return types;
        },
        getYesNo: function () {
            return yesno;
        },
        getPositions: function () {
            return bannerPositions;
        },
        getAdsPositions: function () {
            return adsPositions;
        },
        getTypeQuestions: function () {
            return typeQuestions;
        },
        getLevels: function () {
            return levels;
        },
    };
};

function Notice($rootScope) {
    var queue = [];
    var oldMessage = "";
    var currentMessage = "";

    $rootScope.$on("$stateChangeStart", function() {
        oldMessage = currentMessage;
        currentMessage = queue.shift() || "";
        // console.log(currentMessage);
    });

    $rootScope.$on("requireChange", function() {
        oldMessage = currentMessage;
        currentMessage = queue.shift() || "";
        // console.log(currentMessage);
    });

    $rootScope.$on("$stateChangeError", function() {
        queue.push(oldMessage);
        currentMessage = "";
    });

    return {
        setNotice: function(message, type, require) {
            var require = typeof require !== 'undefined' ? require : false;
            queue.push({
                type: type,
                message: message
            });
            if (require) {
                $rootScope.$broadcast('requireChange');
                // console.log('requireChange');
            }
            // console.log('Queue',queue);
        },
        getNotice: function() {
            return currentMessage;
        },
        requireChange: function() {
            $rootScope.$broadcast('requireChange');
        },
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR',
        INFO: 'INFO',
        clearNotice: function() {
            queue = [];
            currentMessage = "";
            $rootScope.$broadcast('CLEAR_NOTICE');
        }
    };
};