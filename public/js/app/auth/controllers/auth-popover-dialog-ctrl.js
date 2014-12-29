/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
'use strict';

angular.module('ds.auth')
/**
 * Controller for handling authentication related modal dialogs (signUp/signIn).
 */
    .controller('AuthPopoverDialogCtrl', ['$rootScope', '$scope', '$controller', '$q', 'AuthSvc',
       'settings', 'AuthDialogManager',
        function ($rootScope, $scope, $controller, $q, AuthSvc, settings, AuthDialogManager) {

            $scope.user = {
                signup: {},
                signin: {
                    email: '',
                    password: ''
                }
            };

            $scope.errors = {
                signup: [],
                signin: []
            };

            $scope.fbAppId = settings.facebookAppId;
            $scope.googleClientId = settings.googleClientId;

            $scope.$digest();

            AuthSvc.initFBAPI();

            // react to event fired by goole+ signing directive
            $scope.$on('event:google-plus-signin-success', function (event, authResult) {
                AuthSvc.onGoogleLogIn( authResult[settings.configKeys.googleResponseToken]);
            });

            /** Shows dialog that allows the user to create a new account.*/
            $scope.signup = function (authModel, signUpForm) {
                if (signUpForm.$valid) {
                    AuthSvc.signup(authModel, {}).then(
                        function () {
                            $scope.closeDialog();
                        }, function (response) {
                            $scope.errors.signup = AuthSvc.extractServerSideErrors(response);
                        }
                    );
                }
            };

            /** Shows dialog that allows the user to sign in so account specific information can be accessed. */
            $scope.signin = function (authModel, signinForm) {
                if (signinForm.$valid) {
                    AuthSvc.signin(authModel).then(function () {
                        $scope.closeDialog();
                    }, function (response) {
                        $scope.errors.signin = AuthSvc.extractServerSideErrors(response);
                    });
                }
            };

            /** Closes the dialog. */
            $scope.continueAsGuest = function(){};

            /** Closes the dialog.*/
            $scope.closeDialog = function(){};

            /** Shows the "request password reset" dialog.*/
            $scope.showResetPassword = function () {
                AuthDialogManager.showResetPassword();
            };

            $scope.clearErrors = function(){
                $scope.errors.signin = [];
                $scope.errors.signup = [];
            };


            $scope.fbLogin = function () {
                AuthSvc.faceBookLogin();
            };

            var unbind = $rootScope.$on('user:socialLogIn', function(eve, obj){
                if(obj.loggedIn){
                    $scope.closeDialog();
                } else {
                    $scope.errors.signin.push('LOGIN_FAILED');
                }
            });

            $scope.$on('$destroy', unbind);

        }]);
