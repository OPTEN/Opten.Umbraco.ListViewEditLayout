﻿(function () {
	"use strict";

	function ListViewEditLayout($scope, iconHelper, listViewHelper, $location, $http) {

		function activate() {
			for (var i = 0; i < $scope.items.length; i++) {
				$scope.items[i].preview = false;
				$http.get("/umbraco/ListViewEditLayout/ContentRender/index/" + $scope.items[i].id).then(createUpdateItem(i));
			}
		}

		function createUpdateItem(index) {
			return function (response) {
				$scope.items[index].preview = response.data;
			};
		}

		$scope.clickItem = function (selectedItem, $index, $event) {
			listViewHelper.selectHandler(selectedItem, $index, $scope.items, $scope.selection, $event);
		};

		$scope.getIcon = function(entry) {
			return iconHelper.convertFromLegacyIcon(entry.icon);
		};

		$scope.isSelected = function (entry) {
			return _.some($scope.selection, function (sel) {
				return sel.id === entry.id;
			});
		};

		activate();
	}

	angular.module("umbraco").controller("OPTEN.ListViewEditLayout", ListViewEditLayout);


	function ListViewEditor(contentResource, fileManager, $routeParams) {

		var link = function ($scope, $element) {
			contentResource.getById($scope.ngModel.id)
				.then(function (content) {
					$scope.content = content;
				});

			$scope.$on("formSubmitting", function (bla, action) {
				if ($element.is(".ng-dirty")) { // only save if a value has changed
					if (action.action === "publish") {
						contentResource.publish($scope.content, $routeParams.create, fileManager.getFiles());
					}
					else if (action.action === "save") {
						contentResource.save($scope.content, $routeParams.create, fileManager.getFiles());
					}
				}
			});
		};

		return {
			restrict: "E",
			replace: true,
			templateUrl: Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + "/OPTEN.ListViewEditLayout/listviewlayout.editor.html",
			scope: {
				ngModel: '='
			},
			link: link
		};

	}

	angular.module("umbraco.directives").directive('op10ListViewEditor', ListViewEditor);
})();


