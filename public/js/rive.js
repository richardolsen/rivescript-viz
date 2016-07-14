  app.controller('RiveCtrl', function($scope, $filter, $mdDialog, $mdMedia, $location, $http) {
      $scope.topics = [];
      $scope.rivedata = {};

      $scope.gridOptions = {
          appScopeProvider: this,
          gridMenuShowHideColumns: false,
          data: []
      };

      $scope.gridOptions.columnDefs = [{
          name: 'topic',enableHiding: false,
          displayName: 'Topic',
          width: '12%',
          enableCellEdit: true,
          editFileChooserCallback: $scope.storeFile
      }, {
          name: 'trigger',
          displayName: 'Trigger',
          width: '10%',
          enableCellEdit: true
      }, {
          name: 'condition',
          displayName: 'Condition',
          width: '23%',
          enableCellEdit: true,
          editableCellTemplate: '<textarea ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ngEnter></textarea>'
      }, {
          name: 'value',
          displayName: 'Reply',
          width: '30%',
          enableCellEdit: true,
          editableCellTemplate: '<textarea ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" ngEnter></textarea>'
      }, {
          name: 'goto',
          displayName: 'Topic Destination',
          width: '10%',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownOptionsFunction: function(rowEntity, colDef) {
              if (rowEntity.topic) {
                  return $scope.topics;
              } else {
                  return $scope.topics;
              }
          }
      }, {
          name: 'Previous',
          width: '5%',enableSorting: false,enableHiding: false,
          cellTemplate: '<md-button aria-label="Previous" class="md-fab md-raised md-mini" ng-click="alert(\'Conf not implemented yet\')">' +
              '<md-icon md-font-set="material-icons"> undo </md-icon>' +
              '</md-button>'
      }, {
          name: 'Redirect',
          width: '5%',enableSorting: false,
          cellTemplate: '<md-button aria-label="Redirect" class="md-fab md-raised md-mini" ng-click="alert(\'Conf not implemented yet\')">' +
              '<md-icon md-font-set="material-icons"> call_missed_outgoing </md-icon>' +
              '</md-button>'
      }, {
          name: 'Remove',
          width: '5%',enableSorting: false,
          cellTemplate: '<md-button aria-label="Delete" class="md-fab md-raised md-mini" ng-click="grid.appScope.deleteRow(row)">' +
              '<md-icon md-font-set="material-icons"> delete </md-icon>' +
              '</md-button>'
      }];

      $http.get("/rivescriptviz/topics/spreadsheet").then(function(response) {
          $scope.gridOptions.data = response.data.data;
          $scope.topics = response.data.topics;
          console.log(response.data);
      });

      $scope.write = function() {
          $http.post("/rivescriptviz/topics", $scope.gridOptions.data).then(function(response) {
              alert("Data saved sucessfully");
          });
      };

      $scope.storeFile = function(gridRow, gridCol, files) {
          // ignore all but the first file, it can only select one anyway
          // set the filename into this column
          gridRow.entity.filename = files[0].name;

          // read the file and set it into a hidden column, which we may do stuff with later
          var setFile = function(fileContent) {
              gridRow.entity.file = fileContent.currentTarget.result;
              // put it on scope so we can display it - you'd probably do something else with it
              $scope.lastFile = fileContent.currentTarget.result;
              $scope.$apply();
          };
          var reader = new FileReader();
          reader.onload = setFile;
          reader.readAsText(files[0]);
      };

      $scope.deleteRow = function(row) {
          var index = $scope.gridOptions.data.indexOf(row.entity);
          $scope.gridOptions.data.splice(index, 1);
      };

      $scope.addRow = function(row) {
        //grid.appScope.clickHandler()
          var index = $scope.gridOptions.data.push({
              "topic": "",
              "trigger": "",
              "condition": "",
              "value": "",
              "goto": "",
              delete: true
          });
      };


  });
