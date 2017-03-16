(function() {
  'use strict';

  angular
    .module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = [
    'notificationService',
    'settingsModel',
    'dialogService',
    'trans',
    '$translate'
  ];

  function SettingsController(notificationService,
                              settingsModel,
                              dialogService,
                              trans,
                              $translate) {

    // HEADER //
    var vm = this;
    vm.settings = {};
    vm.saveSettings = saveSettings;
    vm.resetSettings = resetSettings;

    _activate();

    // BODY //
    function _activate() {
      settingsModel
        .getSettings()
        .then(function(settings) {
          vm.settings = settings;
        });
    }

    function saveSettings() {
      $translate.use(vm.settings.lang);
      settingsModel
        .saveSettings(vm.settings)
        .then(function() {          
          notificationService.success(
            trans('Settings saved'),
            trans('The editor settings has been updated.')
          );
        });
    }

    function resetSettings() {
      dialogService.confirm(
        trans('Reset Settings?'),
        trans('Are you sure you want to reset to the default settings?')
      ).then(function() {
        settingsModel
          .resetSettings()
          .then(function() {
            notificationService.success(
              trans('Settings reseted'),
              trans('The editor settings has been updated to default values.')
            );
            _activate();
          });
      });
    }
  }
})();