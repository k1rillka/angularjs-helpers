describe('navigationHistoryService Tests', function () {
    let navigationHistoryService, $rootScope, $state ;

    jasmine.createConfig();

    beforeEach(inject(function (_$rootScope_, _navigationHistoryService_, _$state_) {
        $rootScope = _$rootScope_;
        navigationHistoryService = _navigationHistoryService_;
        $state = _$state_;
    }));

    describe('mapSearchValues', function () {
        it('maps search values correctly', function () {

            let search = {
                one: 'true',
                two: '1',
                three: 'false',
                four: '2017-01-20'
            };

            let { hasSearchValue, resultSearch } = navigationHistoryService.mapSearchValues(search);

            expect(hasSearchValue).toEqual(true);
            expect(resultSearch.one).toEqual(true);
            expect(resultSearch.two).toEqual(1);
            expect(resultSearch.three).toEqual(false);
            expect(resultSearch.four).toEqual(new Date('2017-01-20'));

        });
        it('maps empty search values correctly', function () {

            let search = {
                
            };

            let { hasSearchValue } = navigationHistoryService.mapSearchValues(search);

            expect(hasSearchValue).toEqual(false);

        });
        it('maps search values correctly with function', function () {

            const value = 'Custom value';

            let search = {
                one: value
            };

           

            let { hasSearchValue, resultSearch } = navigationHistoryService.mapSearchValues(search, (search, prop, resultSearch) => {
                if (prop === 'one') {
                    resultSearch[prop] = value;
                    return;
                }
            });

            expect(hasSearchValue).toEqual(true);
            expect(resultSearch.one).toEqual(value);
        });
    });
});

