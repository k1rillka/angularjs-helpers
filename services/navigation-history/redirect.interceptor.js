(function () {
    'use strict';

    angular.module('StN')
        .factory('redirectInterceptor', redirectInterceptor)
        .config(redirectInterceptorConfig);

    redirectInterceptor.$inject = ['$q', '$location', '$window'];

    function redirectInterceptor($q, $location, $window) {
        return {
            'response': function (response) {
                if (typeof response.data === 'string' && response.data.indexOf("Log On") > -1) {
                    $window.location.href = "/account/login";
                    return $q.reject(response);
                } else {
                    return response;
                }
            }
        }

    };

    redirectInterceptorConfig.$inject = ['$httpProvider'];

    function redirectInterceptorConfig($httpProvider) {
        $httpProvider.interceptors.push('redirectInterceptor');
    }
})();