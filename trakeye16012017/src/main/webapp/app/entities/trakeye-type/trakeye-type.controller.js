(function() {
    'use strict';

    angular
        .module('trakeyeApp')
        .controller('TrakeyeTypeController', TrakeyeTypeController);

    TrakeyeTypeController.$inject = ['$scope', '$state', 'TrakeyeType', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants','TrakeyeTypeSearch'];

    function TrakeyeTypeController ($scope, $state, TrakeyeType, ParseLinks, AlertService, pagingParams, paginationConstants,TrakeyeTypeSearch) {
        var vm = this;
        
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.filterSearch=filterSearch;

        
        function filterSearch(){
        	
			if($scope.search!=null && $scope.search!="" && !angular.isUndefined($scope.search)){
				TrakeyeTypeSearch.query({userId:$scope.search,
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                  //  result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.trakeyeTypes= data;
                vm.page = pagingParams.page;
        
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
			}else{
				loadAll ();
			}
		}
        
        loadAll();

        function loadAll () {
            TrakeyeType.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                  //  result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.trakeyeTypes = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch
            });
        }
    }
})();
