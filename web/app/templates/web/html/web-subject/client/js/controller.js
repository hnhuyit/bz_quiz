angular
    .module('Subject')
    .controller('SubjectController', SubjectController)
    .controller('SubjectByTeacherController', SubjectByTeacherController)
    .controller('SubjectByStudentController', SubjectByStudentController);

function SubjectController($scope, $filter, SubjectService, SubjectFactory, $cookies, toastr) {
	// $scope.hello = 111111;
    // console.log(111111);

}
function SubjectByTeacherController($scope, $filter, $timeout, SubjectService, SubjectFactory, $cookies, toastr, localStorageService) {

    //Var
    var localStorageName = "subjectbyteacher.filterData";
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

        SubjectFactory
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
                $scope.search.keyword = filterData.search.keyword ? filterData.search.keyword : "";
                $scope.search.key = filterData.search.key ? filterData.search.key : null;
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
            keyword: $scope.search.keyword,
            key: $scope.search.key,
        };
        return options;
    }

    function setScopeAfterQuery(data) {
        $scope.subjects = data.items;
        $scope.totalItems = data.totalItems;
        $scope.totalPage = data.totalPage;
        $scope.itemsPerPage = data.itemsPerPage;
        $scope.numberVisiblePages = data.numberVisiblePages;
    }
    $scope.reset = function reset() {
        $scope.search.keyword = "";
        $scope.search.key = "";
        $scope.currentPage = 1;
        setFilterToLocalStorage();
        getListData();
    };
}
function SubjectByStudentController($scope, $filter, SubjectService, SubjectFactory, $cookies, toastr) {

    $scope.subjectLists = SubjectFactory.getSubjectsByStudent({});

}