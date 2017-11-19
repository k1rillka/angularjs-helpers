
angular
    .module("common")
    .directive("WatchChanges", watchChangesDirective);

function watchChangesDirective() {
    var directive = {
        scope: {},
        bindToController: {
            data: "=",
            onSave: "&"
        },
        restrict: "A",
        controller: watchChangesController,
        controllerAs: "vm"
    };
    return directive;
}

watchChangesController.$inject = ["$window", "$rootScope", "$element", "watchChangesService", "enumService", "modalAlertService", "$state"];

function watchChangesController($window, $rootScope, element, service, enumService, modalAlertService, $state) {

    var vm = this;
    service.clear();
    service.watch(vm.data);

    function save() {
        service.update();
        return vm.onSave();
    }

    element.click(() => {
        save();
    });

    $window.onbeforeunload = () => {
        return service.isModified()
            ? "You have unsaved changes to this page. Are you sure you want to continue?"
            : null;
    }

    $window.onunload = () => {
        service.clear();
    }
    var changeWatcher = $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
        if (service.isModified()) {
            event.preventDefault();
            modalAlertService.confirm("You have unsaved changes to this page. Are you sure you want to continue?", "Warning", enumService.modalEnum.Confirm,
                function (button) {
                    if (button === enumService.buttonType.Yes) {
                        service.clear();
                        changeWatcher();                        
                        $state.go(toState, toParams);
                    }
                });
        } else {
            changeWatcher();
            service.clear();
        }        
    });
}