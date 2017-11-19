angular
    .module("common")
    .directive("Table", tableDirective);

function tableDirective() {
	var directive = {
		scope: {},
		bindToController: {
			params: "=",
			count: "=?",
            onInit: "&",
            onSearch: "&"
		},
		templateUrl: templateSelector,
		replace: true,
		restrict: "E",
		controller: controller,
		controllerAs: "vm"
	};
	return directive;

	function templateSelector(element, attrs) {
		return attrs.templateUrl;
	}

}

controller.$inject = ['navigationHistoryService'];

function controller(navigationHistoryService) {

    var vm = this;

    if (!vm.count) {
        vm.count = 5;
    }

    vm.list = [];

    vm.actions = {
        search: search,
        filter: filter,
        clearSearch: clearSearch
    };

    function search(tableState) {
        vm.tableState = tableState;
        var pagination = tableState.pagination;
        var params = angular.copy(vm.params);
        angular.extend(params, { skip: pagination.start, take: pagination.number }, vm.search, vm.tableState.sort);
        return vm.onSearch({ params: params }).then(function (response) {
            vm.list = response.data.List;
            pagination.numberOfPages = Math.ceil(response.data.Count / pagination.number);
        });
    }

    function filter() {
        vm.tableState.pagination.start = 0;
        return search(vm.tableState);
    }

    function clearSearch() {
        navigationHistoryService.clearSearchValues(vm.search);
        vm.search = null;        
        return search(vm.tableState);
    }

    vm.onInit({ tableVm: vm });
}