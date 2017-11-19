describe("Inject DI Tests", function () {

    init();

    function init() {

    }

    function moduleTest(moduleName) {

        var mainModuleName = moduleName;
        var mainModule = angular.module(mainModuleName);

        jasmine.applyConfig(mainModule);

        var injector = angular.injector(['ngMock', 'ng', mainModuleName], true);

        var providerServiceType = '$provide';
        var providerServiceName = 'service';
        var providerControllerType = '$controllerProvider';
        var providerControllerName = 'register';
        var providerDirectiveType = '$compileProvider';
        var providerDirectiveName = 'directive';
        var providerFilterType = '$filterProvider';
        var providerFilterName = 'register';

        var servicesInfo = getProvidersInfo(mainModule, providerServiceType, providerServiceName);
        var controllersInfo = getProvidersInfo(mainModule, providerControllerType, providerControllerName);
        var directivesInfo = getProvidersInfo(mainModule, providerDirectiveType, providerDirectiveName);
        var filtersInfo = getProvidersInfo(mainModule, providerFilterType, providerFilterName);

        angular.forEach(mainModule.requires, function(requiredModuleName) {
            var mod = angular.module(requiredModuleName);
            servicesInfo = servicesInfo.concat(getProvidersInfo(mod, providerServiceType, providerServiceName));
            controllersInfo = controllersInfo.concat(getProvidersInfo(mod, providerControllerType, providerControllerName));
            directivesInfo = directivesInfo.concat(getProvidersInfo(mod, providerDirectiveType, providerDirectiveName));
            filtersInfo = filtersInfo.concat(getProvidersInfo(mod, providerFilterType, providerFilterName));
        });

        describe("Inject Services", function() {
            servicesInfo.forEach(function(serviceInfo) {
                providerInjectTest(serviceInfo, injector);
            });
        });

        describe("Inject Controllers", function() {
            controllersInfo.forEach(function(controllerInfo) {
                providerInjectTest(controllerInfo, injector);
            });
        });

        describe("Inject Directives", function () {

            var exceptedDirectives = ["mustHaveRole"];

            directivesInfo.forEach(function(directiveInfo) {
                providerInjectTest(directiveInfo, injector);

                //check directive's controller
                if (exceptedDirectives.indexOf(directiveInfo.name) > -1) {
                    return;
                }

                var directiveFunc = directiveInfo.func;
                if (Array.isArray(directiveInfo.func)) {
                    directiveFunc = directiveInfo.func[directiveInfo.func.length - 1];
                }

                var directiveObj = directiveFunc();
                if (directiveObj.hasOwnProperty("controller")) {
                    if (Array.isArray(directiveObj.controller) || typeof directiveObj.controller === "function") {
                        providerInjectTest(providerInfo(directiveInfo.name + " (controller)", directiveObj.controller), injector);
                    }
                }
            });
        });

        describe("Inject Filters", function() {
            filtersInfo.forEach(function(filterInfo) {
                providerInjectTest(filterInfo, injector);
            });
        });
    }

    function providerInjectTest(providerInfo, injector) {
        it('should inject ' + providerInfo.name, function() {
            expect(function() { injector.annotate(providerInfo.func, true); }).not.toThrow();
        });
    }

    function getProvidersInfo(module, providerType, providerName) {
        var result = [];
        module._invokeQueue.forEach(function(value) {
            if (value[0] === providerType && value[1] === providerName) {
                result.push(providerInfo(value[2][0], value[2][1]));
            }
        });
        return result;
    }

    function providerInfo(name, func) {
        return { name: name, func: func };
    }
});