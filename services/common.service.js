
class CommonService {

    constructor($http) {
        this.$http = $http;
    }

    updateProperty(controller, id, name, value) {
        return this.$http.patch(`/${controller}/UpdateProperty`, { id: id, name: name, value: value });
    }

    validateForm(form) {
        if (!form.$invalid) return true;
        form.$setDirty();
        form.$setSubmitted();
        return false;
    }

    clearForm(form) {
        form.$setPristine();
        form.$setUntouched();
    }
}

CommonService.$inject = ["$http"];

angular
    .module('common')
    .service('commonService', CommonService);