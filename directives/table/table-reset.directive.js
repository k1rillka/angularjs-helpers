angular
    .module("common")
    .directive("TableReset", tableResetDirective);

function tableResetDirective() {
    var directive = {
        require: "^stTable",
        restrict: "A",
        link: (scope, element, attrs, ctrl) => {
            element.click(() => {
                return scope.$apply(function() {
                    var tableState = ctrl.tableState();
                    tableState.search.predicateObject = {};
                    tableState.pagination.start = 0;
                    return ctrl.pipe();
                });
            });
        }
    };
    return directive;
}