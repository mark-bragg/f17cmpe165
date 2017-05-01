"use strict"

angular
    .module('accountpage')
    .component('accountmanager', {
        templateUrl: 'accountmanager/accountmanager.template.html',
        controller : function($uibModal, $scope, $rootScope, dataService) {

            $scope.modalHeader = '';
            $scope.editBody = '';
            $scope.editField = $scope.showTabIndex='updateEmail';
            $scope.emailFailed = true;
            $scope.passwordFailed = true;

            $scope.validatePasswordConfirmation = function(pass, passConf){
                return (pass.$viewValue !== passConf.$viewValue);
            };

            $scope.validateEmail = function(newEmail){
                console.log("attempting to validate email..." + newEmail.$viewValue);
                if(newEmail.$viewValue == undefined || newEmail.$viewValue == ''){
                    $scope.emailFailed = true;
                }else{
                    dataService.validateEmail({email: newEmail.$viewValue}).then(function(body){
                        if(body.data.message !== undefined && body.data.message === "OK"){
                            $scope.emailFailed = false;
                        }else{
                            $scope.emailCheckerResult = body.data.error;
                            $scope.emailFailed = true;
                        }
                    });
                }
            }

            $scope.validatePassword = function(oldPassword){
                console.log("attempting to validate email..." + oldPassword.$viewValue);
                if(oldPassword.$viewValue == undefined || oldPassword.$viewValue == ''){
                    $scope.passwordFailed = true;
                }else{
                    dataService.validatePassword({_id:sessionStorage.getItem("userId"), password: oldPassword.$viewValue}).then(function(body){
                        if(body.data.message !== undefined && body.data.message === "OK"){
                            $scope.passwordFailed = false;
                        }else{
                            $scope.passwordFailed = true;
                        }
                    });
                }
            }

            $scope.checkNewEmailForm = function(){
                return ($scope.emailFailed || $scope.passwordFailed);
            }




            $scope.update = function(data){
                //create the correct JSON for service call
                var dataToSubmit = {};

                switch($scope.showTabIndex){
                    case 'updateEmail':
                        dataToSubmit._id = sessionStorage.getItem('userId');
                        dataToSubmit.email = data.email.$viewValue;
                        console.log("updating email...");
                        dataService.updateEmail(dataToSubmit);
                        break;
                    case 'changePassword':
                        dataToSubmit._id = sessionStorage.getItem('userId');
                        dataToSubmit.password = data.newPassword.$viewValue;
                        console.log("updating password...");
                        dataService.resetPassword(dataToSubmit);
                        break;
                    default:
                        console.log("not supported...");
                        break;
                }
            };

            $scope.showTabIndex='updateEmail';

            $scope.curUser = sessionStorage.getItem('userId');
            $scope.imgURL = 'http://localhost:8080/api/userImage/' + $scope.curUser;
            $scope.user = {};

            dataService.getProfile({'userId': $scope.curUser}).then(function(data){

                $scope.firstName = data.firstName||'';
                $scope.lastName= data.lastName||'';
            });

            $scope.switchTab=function(index){
                if($scope.showTabIndex!=index){
                    $scope.showTabIndex=index;
                }
            };

            $scope.updateProfile=function(){
                var params = {
                    "userId" : $scope.curUser,
                    "firstName": $scope.user.firstName,
                    "lastName": $scope.user.lastName
                }
                console.log(params);
                dataService.updateProfile(params).then(function(data){
                    console.log(params)
                    console.log('ok');
                    dataService.getProfile({'userId': $scope.curUser}).then(function(data){

                        $scope.firstName = data.firstName||'';
                        $scope.lastName= data.lastName||'';
                    });

                });
            };
        }
    })
    .directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    })
