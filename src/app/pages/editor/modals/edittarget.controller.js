(function() {
  'use strict';

  angular
    .module('app')
    .controller('EditTargetController', EditTargetController);

  EditTargetController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$stateParams',
    'dialogService',
    'notificationService',
    'trans'
  ];

  function EditTargetController($scope,
                              $window,
                              $state,
                              $stateParams,
                              dialogService,
                              notificationService,
                              trans) {
    var vm = this;
    vm.action = 'New target';
    vm.target = null;
    vm.blacklist = null;
    vm.original = null;
    vm.save = save;
    vm.remove = remove;

    _active();

    function _active() {
      var p = $window.editor.project.get();

      if ($stateParams.name) {
        var target = p.targets.get($stateParams.name);
        vm.target = target.copy();
        vm.original = target;
        vm.action = 'Update target';
      } else {
        vm.target = new b3e.Target();
      }

      var blacklist = [];
      p.targets.each(function(target) {
        if (target.name !== vm.target.name) {
          blacklist.push(target.name);
        }
      });
      vm.blacklist = blacklist.join(',');
    }

    function save() {
      var p = $window.editor.project.get();

      if (vm.original) {
        p.targets.update(vm.original, vm.target);  
      } else {
        p.targets.add(vm.target);
      }

      $state.go('editor');
      notificationService
        .success(trans('Target created'), trans('Target has been created successfully.'));
    }

    function remove() {
      dialogService.
        confirm(
          trans('Remove target?'), 
          trans('Are you sure you want to remove this target?\n\nNote: all blocks using this target will be removed.')
        ).then(function() {
          var p = $window.editor.project.get();
          p.targets.remove(vm.original);
          notificationService.success(
            trans('Target removed'),
            trans('The target has been removed from this project.')
          );
          $state.go('editor');
        });
    }
  }

})();