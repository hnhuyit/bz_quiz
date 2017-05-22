angular
    .module('Anwser')
    .controller('AnwserByStudentController', AnwserByStudentController)
    .controller('AnwserByTeacherController', AnwserByTeacherController);

function AnwserByStudentController($scope, $filter, AnwserService, AnwserFactory, $cookies, toastr, localStorageService) {


    //Var
    var localStorageName = "answer.filterData";
    $scope.search = {};
    $scope.rowsSelected = {};
    $scope.isLoading = false;
    $scope.currentPage = 1;   

    //Method
    $scope.setPage = setPage;
    $scope.pageChanged = pageChanged;
    $scope.find = find;
    $scope.filter = filter;


    function showLoading() {
        $scope.isLoading = true;
    }

    function hideLoading() {
        $timeout(function () {
            $scope.isLoading = false;
        }, 500);
    }
	function getListData() {

        showLoading();
        // Reset selected row
        $scope.rowsSelected = {};

        // get filter from local storage
        getFilterToLocalStorage();

        AnwserFactory
            .getAnwsersByStudent(getOptionsQuery(), function (data) {
                setScopeAfterQuery(data);
                hideLoading();
            });
    }
    
    function setFilterToLocalStorage() {
        localStorageService.set(localStorageName, {
            currentPage: $scope.currentPage,
            search: $scope.search
        });
    }

    function getFilterToLocalStorage() {
        var filterData = localStorageService.get(localStorageName);
        if (!$.isEmptyObject(filterData)) {
            $scope.currentPage = Number.isInteger(filterData.currentPage) ? Number(filterData.currentPage) : 1;
            if (!$.isEmptyObject(filterData.search)) {
                // $scope.search.keyword = filterData.search.keyword ? filterData.search.keyword : "";
                $scope.search.quiz_id = filterData.search.quiz_id ? filterData.search.quiz_id : null;
            }

        }
    }
    function find() {
        getListData();
    };
    function filter() {
        setPage(1);
        setFilterToLocalStorage();
        getListData();
    };
    function setPage(pageNo) {
        $scope.currentPage = pageNo;
    };

    function pageChanged(page) {
        setPage(page);
        setFilterToLocalStorage();
        getListData();
    };
    function getOptionsQuery() {
        var options = {
            page: $scope.currentPage,
            // keyword: $scope.search.keyword,
            quiz_id: $scope.search.quiz_id,
        };
        return options;
    }

    function setScopeAfterQuery(data) {
        $scope.anwsers = data.items;
        $scope.totalItems = data.totalItems;
        $scope.totalPage = data.totalPage;
        $scope.itemsPerPage = data.itemsPerPage;
        $scope.numberVisiblePages = data.numberVisiblePages;
    }
    $scope.reset = function reset() {
        // $scope.search.keyword = "";
        $scope.search.quiz_id = "";
        $scope.currentPage = 1;
        setFilterToLocalStorage();
        getListData();
    };

}

function AnwserByTeacherController($scope, $filter, AnwserService, AnwserFactory, $cookies, toastr, localStorageService) {

    //Var
    var localStorageName = "answer.filterData";
    $scope.search = {};
    $scope.rowsSelected = {};
    $scope.isLoading = false;
    $scope.currentPage = 1;   

    //Method
    $scope.setPage = setPage;
    $scope.pageChanged = pageChanged;
    $scope.find = find;
    $scope.filter = filter;


    function showLoading() {
        $scope.isLoading = true;
    }

    function hideLoading() {
        $timeout(function () {
            $scope.isLoading = false;
        }, 500);
    }
    function getListData() {

        showLoading();
        // Reset selected row
        $scope.rowsSelected = {};

        // get filter from local storage
        getFilterToLocalStorage();

        AnwserFactory
            .query(getOptionsQuery(), function (data) {
                setScopeAfterQuery(data);
                hideLoading();
            });
    }
    
    function setFilterToLocalStorage() {
        localStorageService.set(localStorageName, {
            currentPage: $scope.currentPage,
            search: $scope.search
        });
    }

    function getFilterToLocalStorage() {
        var filterData = localStorageService.get(localStorageName);
        if (!$.isEmptyObject(filterData)) {
            $scope.currentPage = Number.isInteger(filterData.currentPage) ? Number(filterData.currentPage) : 1;
            if (!$.isEmptyObject(filterData.search)) {
                // $scope.search.keyword = filterData.search.keyword ? filterData.search.keyword : "";
                $scope.search.quiz_id = filterData.search.quiz_id ? filterData.search.quiz_id : null;
            }

        }
    }
    function find() {
        getListData();
    };
    function filter() {
        setPage(1);
        setFilterToLocalStorage();
        getListData();
    };
    function setPage(pageNo) {
        $scope.currentPage = pageNo;
    };

    function pageChanged(page) {
        setPage(page);
        setFilterToLocalStorage();
        getListData();
    };
    function getOptionsQuery() {
        var options = {
            page: $scope.currentPage,
            // keyword: $scope.search.keyword,
            quiz_id: $scope.search.quiz_id,
        };
        return options;
    }

    function setScopeAfterQuery(data) {
        $scope.anwsers = data.items;
        $scope.totalItems = data.totalItems;
        $scope.totalPage = data.totalPage;
        $scope.itemsPerPage = data.itemsPerPage;
        $scope.numberVisiblePages = data.numberVisiblePages;
    }
    $scope.reset = function reset() {
        // $scope.search.keyword = "";
        $scope.search.quiz_id = "";
        $scope.currentPage = 1;
        setFilterToLocalStorage();
        getListData();
    };

}