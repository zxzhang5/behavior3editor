(function() {
  'use strict';

  angular
    .module('app')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = [
    '$state',
    '$window',
    'dialogService',
    'systemService', 
    'notificationService',
    'projectModel',
    'trans'
  ];

  function ProjectsController($state,
                              $window,
                              dialogService, 
                              systemService,
                              notificationService,
                              projectModel,
                              trans) {

    // HEAD //
    var vm = this;
    vm.recentProjects = [];
    vm.isDesktop = null;

    vm.newProject = newProject;
    vm.openProject = openProject;
    vm.editProject = editProject;
    vm.saveProject = saveProject;
    vm.closeProject = closeProject;
    vm.removeProject = removeProject;

    _activate();

    // BODY //
    function _activate() {
      vm.isDesktop = systemService.isDesktop;
      projectModel
        .getRecentProjects()
        .then(function(recents) {
          vm.recentProjects = recents;
        });
    }

    function _newProject(path, name) {
      projectModel
        .newProject(path, name)
        .then(function() {
          $state.go('editor');
        });
    }

    function newProject() {
      function doNew() {
        // Get project name
        dialogService
          .prompt(trans('New Project'), null, 'input', trans('Project name'))
          .then(function(name) {
            // If no name provided, abort
            if (!name) {
              notificationService.error(
                trans('Invalid name'),
                trans('You must provide a name for the project.')
              );
              return;
            }

            // If desktop, open file dialog
            if (vm.isDesktop) {
              var placeholder = name.replace(/\s+/g, "_").toLowerCase();

              dialogService
                .saveAs(placeholder, ['.b3', '.json'])
                .then(function(path) {
                  _newProject(path, name);
                });
            } else {
              var path = 'b3projects-'+b3.createUUID();  
              _newProject(path, name);
            }
          });
      }

      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            trans('Leave without saving?'), 
            trans('If you proceed you will lose all unsaved modifications.'), 
            null, {closeOnConfirm: false})
          .then(doNew);
      } else {
        doNew();
      }
    }

    function _openProject(path) {
      projectModel
        .openProject(path)
        .then(function() {
          $state.go('editor');
        }, function() {
          notificationService.error(
            trans('Invalid file'),
            trans('Couldn not open the project file.')
          );
        });
    }
    function openProject(path) {
      function doOpen() {
        if (path) {
          _openProject(path);
        } else {
          dialogService
            .openFile(false, ['.b3', '.json'])
            .then(function(path) {
              _openProject(path);
            });
        }
      }

      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            trans('Leave without saving?'), 
            trans('If you proceed you will lose all unsaved modifications.'))
          .then(doOpen);
      } else {
        doOpen();
      }
    }

    function editProject() {
      var project = projectModel.getProject();

      dialogService
        .prompt(trans('Rename project'), null, 'input', project.name)
        .then(function(name) {
          // If no name provided, abort
          if (!name) {
            notificationService.error(
              trans('Invalid name'),
              trans('You must provide a name for the project.')
            );
            return;
          }

          project.name = name;
          projectModel
            .saveProject(project)
            .then(function() {
              _activate();
              notificationService.success(
                trans('Project renamed'),
                trans('The project has been renamed successfully.')
              );
            });
        });
    }

    function saveProject() {
      projectModel
        .saveProject()
        .then(function() {
          notificationService.success(
            trans('Project saved'),
            trans('The project has been saved.')
          );
        }, function() {
          notificationService.error(
            trans('Error'),
            trans('Project could not be saved.')
          );
        });
    }

    function closeProject() {
      function doClose() {
        projectModel.closeProject();
      }

      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            trans('Leave without saving?'), 
            trans('If you proceed you will lose all unsaved modifications.'), 
            null)
          .then(doClose);
      } else {
        doClose();
      }
    }

    function removeProject(path) {
      dialogService.
        confirm(
          trans('Remove project?'), 
          trans('Are you sure you want to remove this project?')
        ).then(function() {
          projectModel
            .removeProject(path)
            .then(function() {
              _activate();
              notificationService.success(
                trans('Project removed'),
                trans('The project has been removed from editor.')
              );
            });
        });
    }
  }
})();