angular
    .module('common')
    .service('watchChangesService', watchChangesService);

watchChangesService.$inject = ["$state"];

function watchChangesService($state) {

    var items = {};

    var service = {
        watch: watch,
        update: update,
        isModified: isModified,
        clear: clear
    };

    function watch(item) {
        var state = $state.current.name;
        if (items[state]) return;
        items[state] = {
            reference: item,
            copy: angular.copy(item)   
        }
    }

    function update() {
        var state = $state.current.name;
        var current = items[state].reference;
        items[state] = {
            reference: current,
            copy: angular.copy(current)
        }
    }

    function clear() {
        delete items[$state.current.name];
    }

    function isModified() {
        var state = $state.current.name;
        if (!items[state]) return false;
        return !angular.equals(items[state].reference, items[state].copy);
    }

    return service;
}
