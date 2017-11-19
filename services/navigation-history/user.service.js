
class UserService {


    constructor($http) {
        this.user = null;
        this.$http = $http;
    }

    get User() {
        if (!this.user) {
            return this.requestCurrentUser();
        }
        return this.user;
    }

    set User(user) {
        this.user = user;
    }

    requestCurrentUser() {
        if (this.user.then) {
            return this.user;
        }
        this.user = this.$http.get('/base/getcurrentuserinfo');
        return this.user.then(function (result) {
            this.user = result.data.Result;
            return user;
        });
    }

    getActiveUsers() {
        return this.$http.get('/UserManager/GetActiveUsers').then(result => result.data.Result.users);
    }
}

UserService.$inject = ["$http"];
UserService.$classify = true;

angular
    .module('common')
    .service('userService', UserService);