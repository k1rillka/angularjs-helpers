angular
    .module('common')
    .service('roleService', roleService);

roleService.$inject = ['$q', '$http'];

function roleService($q, $http) {
    var service = {
        hasRole: hasRole
    };

    var userRoles = null;
    var rolesPromise = null;


    function getRole() {
        if (!rolesPromise) {
            rolesPromise = $http.get('/account/GetRoles').then((response)=> {
                userRoles = response.data;
                return response.data;
            });
        }
        return rolesPromise;
    }

    function hasRole(roles) {
        var deferred = $q.defer();
        getRole().then(function() {
            var isAvailable = _.some(roles, x => _.contains(userRoles, x));
            deferred.resolve(isAvailable);
        },function() {
            deferred.reject();
        });
        return deferred.promise;
    }

    return service;
}
