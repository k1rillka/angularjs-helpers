'use strict';
angular
    .module("common")
    .directive("TableInit", ["stConfig", "$timeout", function (config,$timeout) {
        return {
            require: "^stTable",
            restrict: "A",
            scope: {
                TableInit: "="
            },
            link:{
                post: (scope, element, attrs, ctrl) => {
                    var initFromModel = function (m) {
                        $timeout(function() {
                    if (m) {
                        if (!ctrl.tableState().search.predicateObject) {
                            ctrl.tableState().search.predicateObject = {};
                        }
                        angular.forEach(m, function(value, key) {
                            if (value === undefined|| value===null || value.length === 0) {
                                delete m[key];
                            }
                        });
                        ctrl.tableState().search.predicateObject = angular.merge(ctrl.tableState().search.predicateObject, m);
                    }
                        }, config.pipe.delay);
                }
                if (angular.isFunction(scope.TableInit)) {
                    scope.TableInit(initFromModel, config.pipe.delay, ctrl.tableState());
                }
            }}
        };
    }]);