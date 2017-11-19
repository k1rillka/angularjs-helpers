angular
    .module('common')
    .directive('InlineEditActions', inlineEditActionsDirective);

function inlineEditActionsDirective() {
    var directive = {
        scope: {},
        require: '^form',
        bindToController: {
            isEditable: "=",
            item: "=",
            update: "&",
            afterUpdate: "&",
            onCancel: "&?",
            updateLocally: "&?",
            showOnlyEdit: "=?",
            doNotShowCancel: "=?"
        },
        templateUrl: templateSelector,
        restrict: 'E',
        controller: inlineEditActionsController,
        controllerAs: "vm",
        link: function (scope, element, attrs, formCtrl) {
            scope.formCtrl = formCtrl;
        }
    };
    return directive;

    function templateSelector(element, attrs) {
        if (attrs.templateUrl) {
            return attrs.templateUrl;
        }
        return "inline-edit-actions.tmpl.html";
    }
}

inlineEditActionsController.$inject = ["$scope", "$attrs"];

function inlineEditActionsController($scope, $attrs) {

    var vm = this;
    var backUpItem = null;

    vm.actions = {
        initEdit: initEdit,
        canUpdate: canUpdate,
        update: update,
        cancelEdit: cancelEdit
    };

    init();

    function init() {
        setIsEditableIfShowOnlyEditNotExists(vm.isEditable);
    }

    function setIsEditableIfShowOnlyEditNotExists(flag) {
        vm.isEditable = vm.showOnlyEdit ? vm.showOnlyEdit : flag;
    }

    function initEdit($event) {
        $event.stopPropagation();
        backUpItem = angular.copy(vm.item);
        setIsEditableIfShowOnlyEditNotExists(true);
    }

    function canUpdate() {
        return $scope.formCtrl.$valid;
    }

    function update($event) {
        $event.stopPropagation();
        if ($attrs.lockUpdate != undefined) {
            setIsEditableIfShowOnlyEditNotExists(false);

            if (backUpItem === null) {
                backUpItem = angular.copy(vm.item);

            } else {
                angular.extend(backUpItem, vm.item);
            }
            if (vm.updateLocally)
                vm.updateLocally(backUpItem);
            vm.afterUpdate();
        }
        else {
            return vm.update(vm.item).then((updatedItem) => {
                setIsEditableIfShowOnlyEditNotExists(false);
                angular.extend(vm.item, updatedItem);
                vm.afterUpdate();
            });
        }
    }

    function cancelEdit($event) {
        $event.stopPropagation();
        setIsEditableIfShowOnlyEditNotExists(false);
        angular.extend(vm.item, backUpItem);

        if (vm.onCancel)
            vm.onCancel();
    }
}
