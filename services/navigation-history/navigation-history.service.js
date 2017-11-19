angular
    .module('common')
    .service('navigationHistoryService', navigationHistoryService);


navigationHistoryService.$inject = ["$rootScope", "$state", "dateService"];

function navigationHistoryService($rootScope, $state, dateService) {

    var service = {
        returnToState: returnToState,
        getPreviousStateParams: getPreviousStateParams,
        clearSearchValues: clearSearchValues,
        mapSearchValues: mapSearchValues,
        getPreviousState: getPreviousState
    }

    function returnToState(state) {
        if (state === $rootScope.fromState.name) {
            $state.go(state, $rootScope.fromParams);
        } else {
            $state.go(state);
        }
    }

    function getPreviousState() {
        return $rootScope.fromState.name;
    }

    function getPreviousStateParams(state) {
        if (state === $rootScope.fromState.name) {
            return $rootScope.fromParams;
        } else {
            return {};
        }
    }

    function clearSearchValues(search) {
        _.forOwn(search, (value, key) => {
            search[key] = undefined;
        });
    }

    function mapSearchValues(search, conditions) {
        let resultSearch = {};
        let hasSearchValue = false;
        _.forOwn(search, (value, key) => {
            if (!value) {
                return;
            }
            hasSearchValue = true;

            if (conditions) {
                conditions(search, key, resultSearch);
                if (resultSearch[key]) {
                    return;
                }
            }

            if (value === 'true' || value === 'false') {
                resultSearch[key] = JSON.parse(value);
                return;
            }

            if (dateService.isCorrectDate(value)) {
                resultSearch[key] = new Date(value);
                return;
            }

            if (!isNaN(value) && search[key]) {
                resultSearch[key] = parseInt(value);
                return;
            }
            if (!resultSearch[key] && resultSearch[key] !== false) {
                resultSearch[key] = value;
            }

        });

        return { hasSearchValue, resultSearch }
        
    }

    return service;

}

