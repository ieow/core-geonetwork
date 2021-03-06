(function() {
  goog.provide('gn_csw_virtual_controller');


  var module = angular.module('gn_csw_virtual_controller',
      []);


  /**
   * GnCSWVirtualController provides management interface
   * for virtual CSW configuration.
   *
   */
  module.controller('GnCSWVirtualController', [
    '$scope', '$http', '$rootScope', '$translate',
    function($scope, $http, $rootScope, $translate) {

      /**
       * CSW virtual
       */
      $scope.cswVirtual = {};
      $scope.virtualCSWSelected = null;
      $scope.virtualCSWUpdated = false;
      $scope.virtualCSWSearch = '';
      $scope.groupsFilter = {};
      $scope.sourcesFilter = {};
      $scope.categoriesFilter = {};
      var operation = '';

      /**
         * Load catalog settings and extract CSW settings
         */
      function loadCSWVirtual() {
        $scope.virtualCSWSelected = {};
        $http.get('admin.config.virtualcsw.list@json').success(function(data) {
          $scope.cswVirtual = data;
        }).error(function(data) {
          // TODO
        });

        // TODO : load categories and sources
        // to display combo in edit form
      }


      function loadFilterList() {
        $http.get('admin.group.list@json').success(function(data) {
          $scope.groupsFilter = data;
        }).error(function(data) {
        });
      }

      $scope.updatingVirtualCSW = function() {
        $scope.virtualCSWUpdated = true;
      };

      $scope.selectVirtualCSW = function(v) {
        operation = 'updateservice';
        $http.get('admin.config.virtualcsw.get@json?id=' + v.id)
              .success(function(data) {
              $scope.virtualCSWSelected = data;
              // FIXME: XML to JSON converter only convert
              // lonely child as array and not as object
              $scope.virtualCSWUpdated = false;
            }).error(function(data) {
              // TODO
            });
      };

      $scope.addVirtualCSW = function() {
        operation = 'newservice';
        $scope.virtualCSWSelected = {
          'record': {
            'id': '',
            'name': 'csw-servicename',
            'description': ''
          },
          'filter': {
            'any': '',
            'abstract': '',
            'title': '',
            '_source': '',
            '_groupPublished': '',
            'keyword': '',
            '_cat': '',
            'denominator': '',
            'type': ''
          }
        };
      };
      $scope.saveVirtualCSW = function(formId) {

        $http.get('admin.config.virtualcsw.update@json?operation=' + operation +
                  '&' + $(formId).serialize())
          .success(function(data) {
              loadCSWVirtual();
              $rootScope.$broadcast('StatusUpdated', {
                msg: $translate('virtualCswUpdated'),
                timeout: 2,
                type: 'success'});
            })
          .error(function(data) {
              $rootScope.$broadcast('StatusUpdated', {
                title: $translate('virtualCswUpdateError'),
                error: data,
                timeout: 0,
                type: 'danger'});
            });
      };

      $scope.deleteVirtualCSW = function() {
        $http.get('admin.config.virtualcsw.remove?id=' +
                  $scope.virtualCSWSelected.record.id)
          .success(function(data) {
              loadCSWVirtual();
            })
          .error(function(data) {
              $rootScope.$broadcast('StatusUpdated', {
                title: $translate('virtualCswDeleteError'),
                error: data,
                timeout: 0,
                type: 'danger'});
            });
      };

      $scope.getCapabilitiesUrl = function(v) {
        if (v && v.record) {
          return v.record.name + '?SERVICE=CSW&REQUEST=GetCapabilities';
        } else {
          return null;
        }
      };

      loadCSWVirtual();
      loadFilterList();

    }]);

})();
