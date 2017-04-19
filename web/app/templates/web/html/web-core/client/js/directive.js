'use strict'

angular.module('Core')
	.directive('status', status)
	.directive('ckEditor', ckEditor)
	.directive('bzMessage', bzMessage)
	.directive('errorMessage', errorMessage)
	.directive('ngLoading', ngLoading)
	.directive('ngPopupConfirm', ngPopupConfirm)
	.directive('bzPageType', bzPageType)
	.directive('bzPageCell', bzPageCell)
	.directive('bzPagination', bzPagination);

function status() {
	return {
		restrict: 'EA', //E = element, A = attribute, C = class, M = comment
		link: function ($scope, element, attrs) {
			var tag =  '<span class="label label-warning">unpublish</span>';
			
			if(attrs.status==1){
				tag =  '<span class="label label-success">publish</span>';
			}
			element.append(tag);
		}
	}
};

function ckEditor() {
	return {
		require: '?ngModel',
		restrict: 'AEC',
		link: function (scope, elm, attr, model) {
			var isReady = false;
			var data = [];
			var ck = CKEDITOR.replace(elm[0]);

			function setData() {
				if (!data.length) { return; }

				var d = data.splice(0, 1);
				ck.setData(d[0] || '<span></span>', function () {
					setData();
					isReady = true;
				});
			}

			ck.on('instanceReady', function (e) {
				if (model) { setData(); }
			});

			elm.bind('$destroy', function () {
				ck.destroy(false);
			});

			if (model) {
				ck.on('change', function () {
					scope.$apply(function () {
						var data = ck.getData();
						if (data == '<span></span>') {
							data = null;
						}
						model.$setViewValue(data);
					});
				});

				model.$render = function (value) {
					if (model.$viewValue === undefined) {
						model.$setViewValue("");
						model.$viewValue = "";
					}

					data.push(model.$viewValue);

					if (isReady) {
						isReady = false;
						setData();
					}
				};
			}

		}
	};
};

function bzMessage(Notice, $rootScope) {
    var renderNotice = function(message, type) {
        if (type == Notice.ERROR) {
            return '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-exclamation-triangle"></i> Error!</h4><div>' + message + '</div></div>';
        } else if (type == Notice.INFO) {
            return '<div class="alert alert-info alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-info"></i> Infomation!</h4><div>' + message + '</div></div>';
        }
        return '<div class="alert alert-success alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-check"></i> Success!</h4><div>' + message + '</div></div>'
    };

    return {
        restrict: "E",
        template: function(elem, attr) {
            var notice = Notice.getNotice();
            // $("html body").click(function() {
            //     elem.empty();
            // });

            $rootScope.$on("CLEAR_NOTICE", function() {
                elem.empty();
            });

            $rootScope.$on("requireChange", function() {
                notice = Notice.getNotice();
                // console.log('directive', notice);
                if (notice.type == Notice.ERROR) {
                    elem.html(renderNotice(notice.message, Notice.ERROR));
                } else if (notice.type == Notice.INFO) {
                    elem.html(renderNotice(notice.message, Notice.INFO));
                } else {
                    elem.html(renderNotice(notice.message, Notice.SUCCESS));
                }
            });

            if (notice == "") return;
            // console.log("Notice:", notice);
            if (notice.type == Notice.ERROR) {
                return renderNotice(notice.message, Notice.ERROR);
            } else if (notice.type == Notice.INFO) {
                return renderNotice(notice.message, Notice.INFO);
            }
            return renderNotice(notice.message, Notice.SUCCESS);
        }
    };
};

function errorMessage() {
    return {
        restrict: 'E',
        template: function(elem, attr) {
            var requireMsg = attr.requireMsg || "You did not enter a field";
            var minlengthMsg = attr.minlength ? `You should enter longer than ${attr.minlength - 1} characters` : "You should enter longer in this field";
            var maxlengthMsg = attr.maxlength ? `You should enter shorter than ${attr.maxlength + 1} characters` : "You should enter shorter in this field";
            return '<div ng-message="required">' + requireMsg + '</div>' +
                '<div ng-message="email">You did not enter a email format</div>' +
                '<div ng-message="pattern">You did not enter a right pattern</div>' +
                '<div ng-message="number">You did not enter a number</div>' +
                '<div ng-message="min">You should enter bigger value</div>' +
                '<div ng-message="max">You should enter smaller value</div>' +
                '<div ng-message="minlength">' + minlengthMsg + '</div>' +
                '<div ng-message="maxlength">' + maxlengthMsg + '</div>';
        }
    };
};

function ngLoading() {

    var loadingSpinner = '<div id="preview-area">' +
        '<div class="mfp-bg bzFromTop mfp-ready"></div>' +
        '<div class="sk-cube-grid">' +
        '<div class="sk-cube sk-cube1"></div>' +
        '<div class="sk-cube sk-cube2"></div>' +
        '<div class="sk-cube sk-cube3"></div>' +
        '<div class="sk-cube sk-cube4"></div>' +
        '<div class="sk-cube sk-cube5"></div>' +
        '<div class="sk-cube sk-cube6"></div>' +
        '<div class="sk-cube sk-cube7"></div>' +
        '<div class="sk-cube sk-cube8"></div>' +
        '<div class="sk-cube sk-cube9"></div>' +
        '</div>';

    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.loadingDone, function(val) {
                if (val) {
                    element.html(loadingSpinner);
                } else {
                    element.html('');
                }
            });
        }
    };
};

function ngPopupConfirm() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.loadingDone, function(val) {
                if (val) {
                    element.html(loadingSpinner);
                } else {
                    element.html('');
                }
            });
        }
    };
};

function bzPageType($rootScope) {
    var onclick = function(pageType, page, name) {
        $rootScope.$broadcast("PAGE_CHANGE_" + name, {
            pageType: pageType,
            page: page
        });
    };

    return {
        restrict: "A",
        link: function(scope, elem, attr) {
            if (!elem.hasClass('active')) {
                elem.on('click', function() {
                    onclick(attr.bzPageType, attr.page, attr.name);
                });
            }
        }
    };
};

function bzPageCell($compile) {
    var render = function(label, active, disabled, pageType, name) {
        var active = active ? "active" : "";
        var disabled = disabled ? "disabled" : "";
        var classDisabled = disabled && !active ? "disabled" : "";
        return '<li bz-page-type="' + pageType + '" name="' + name + '" page="' + label + '" class="' + active + ' ' + classDisabled + '" disabled="' + disabled + '"><a href="javascript:void(0);" ' + disabled + '>' + label + '</a></li>';
    };

    return {
        restrict: 'E',
        link: function(scope, elem, attr) {
            var {
                label,
                active,
                disabled,
                pageType,
                name
            } = attr;
            var markup = $compile(render(label, active, disabled, pageType, name))(scope);
            elem.replaceWith(markup);
        }
    };
};

function bzPagination($rootScope, $compile, $parse) {
    var currentPage = 1;
    var totalPage = 1;
    var hadChange = false;
    var handlePageChange = null;
    var name = null;
    var maxPage = 5;

    var render = function(page, total_page, name, maxPage) {
        return '<ul class="pagination pagination-sm pull-right">' +
            renderPrevious(name) +
            renderPageCell(page, total_page, name, maxPage) +
            renderNext(name) +
            '</ul>';
    };

    var renderPageCell = function(page, total_page, name, maxPage) {
        var renderHtml = "";
        var start = 1;
        var end = total_page;
        if (total_page > maxPage) {
            var left = maxPage / 2;
            var right = maxPage - (left + 1);
            start = page - left;
            end = page + right;
            if (start < 1) {
                end += (1 - start);
                start += (1 - start);
            }
            if (end > total_page) {
                start -= (end - total_page);
                end -= (end - total_page);
            }
        }
        // var renderCount = 0;
        for (var i = start; i <= end; i++) {
            if (i == page) {
                renderHtml += '<bz-page-cell name="' + name + '" active="true" disabled="true" page-type="page" label="' + i + '" />';
            } else {
                renderHtml += '<bz-page-cell name="' + name + '" page-type="page" label="' + i + '" />';
            }
        }
        return renderHtml;
    };

    var processHadChange = function() {
        if (!hadChange) {
            hadChange = true;
        }
    };

    var renderPrevious = function(name) {
        if (currentPage == 1) {
            var disabled = true;
        } else {
            var disabled = "";
        }
        return '<bz-page-cell name="' + name + '" disabled="' + disabled + '" page-type="first" label="&laquo;" />' +
            '<bz-page-cell name="' + name + '" disabled="' + disabled + '" page-type="previous" label="&lsaquo;" />';
    };

    var renderNext = function(name) {
        if (currentPage == totalPage) {
            var disabled = true;
        } else {
            var disabled = "";
        }
        return '<bz-page-cell name="' + name + '" disabled="' + disabled + '" page-type="next" label="&rsaquo;" />' +
            '<bz-page-cell name="' + name + '" disabled="' + disabled + '" page-type="last" label="&raquo;" />';
    };

    return {
        restrict: 'E',
        link: function(scope, elem, attr) {
            name = attr.name.toUpperCase();
            scope.$watch(function() {
                hadChange = false;
                var _currentPage = $parse(attr.currentPage)(scope);
                var _totalPage = $parse(attr.totalPage)(scope);
                var _handlePageChange = $parse(attr.pageChanged)(scope);
                if (_currentPage && _currentPage != currentPage) {
                    currentPage = _currentPage;
                    processHadChange();
                }
                if (_handlePageChange && _handlePageChange != handlePageChange) {
                    handlePageChange = _handlePageChange;
                    processHadChange();
                }
                if (_totalPage && _totalPage != totalPage) {
                    totalPage = _totalPage;
                    maxPage = _totalPage;
                    processHadChange();
                }
                if (attr.maxPage && Number(attr.maxPage) != maxPage) {
                    maxPage = Number(attr.maxPage);
                    processHadChange();
                }
                if (hadChange) {
                    elem.empty();
                    var markup = $compile(render(currentPage, totalPage, name, maxPage))(scope);
                    elem.html(markup);
                }
            });
            $rootScope.$on("PAGE_CHANGE_" + name, function(event, data) {
                if (data.pageType == "page") {
                    handlePageChange(Number(data.page));
                    currentPage = Number(data.page);
                } else {
                    switch (data.pageType) {
                        case 'first':
                            if (currentPage == 1) {
                                return;
                            }
                            handlePageChange(1)
                            break;
                        case 'previous':
                            if (currentPage == 1) {
                                return;
                            }
                            handlePageChange(currentPage - 1);
                            break;
                        case 'next':
                            if (currentPage == totalPage) {
                                return;
                            }
                            handlePageChange(currentPage + 1);
                            break;
                        case 'last':
                            if (currentPage == totalPage) {
                                return;
                            }
                            handlePageChange(totalPage);
                            break;
                    }
                }
                elem.empty();
                var markup = $compile(render(currentPage, totalPage, name, maxPage))(scope);
                elem.html(markup);
            });
        }
    };
};