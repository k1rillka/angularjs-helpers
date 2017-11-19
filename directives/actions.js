angular
    .module("common")
    .directive("Add", addButtonDirective)
    .directive("Remove", removeButtonDirective);

removeButtonDirective.$inject = ["modalAlertService", "enumService"];

function addButtonDirective() {
    var directive = {
        scope: {
            Add: "=",
            action: "&",
            init: "&",
            onAdd: "&",
            addFirst: "="
        },
        restrict: "AE",
        link: link
    };
    return directive;

    function link(scope, element, attrs) {

        var inProgress = false;

        var form = null;
        if (attrs.validate) {
            form = scope.$parent[attrs.validate];
        }

        function prepare() {
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
            scope.init();
        }

        prepare();


        element.click(function () {

            if (inProgress) return;

            if (form && !form.$valid) {
                scope.$apply(function () {
                    form.$setDirty();
                    form.$setSubmitted();
                });
                return;
            }

            inProgress = true;
            scope.action().finally(function () {
                inProgress = false;
            }).then(function (item) {
                scope.addFirst ? scope.Add.unshift(item) : scope.Add.push(item);
                if (scope.onAdd) {
                    scope.onAdd();
                }
                prepare();
            });
        });
    }
}

function removeButtonDirective(modalAlertService, enumService) {

    var directive = {
        scope: {
            Remove: "=",
            action: "&",
            confirmMessage: "@",
            onRemove: "&"
        },
        restrict: "AE",
        link: link
    };
    return directive;

    function link(scope, element) {

        var inProgress = false;

        if (!scope.confirmMessage) {
            scope.confirmMessage = "Are you sure you want to delete this item?";
        }

        element.click(function () {
            if (inProgress) return;
            modalAlertService.confirm(scope.confirmMessage, "Warning", enumService.modalEnum.Confirm,
                function (button) {
                    if (button === enumService.buttonType.Yes) {
                        inProgress = true;
                        scope.action().finally(function () {
                            inProgress = false;
                        }).then(function () {
                            scope.Remove.splice(scope.$parent.$index, 1);
                            scope.onRemove();
                        });
                    }
                });
        });
    }
}