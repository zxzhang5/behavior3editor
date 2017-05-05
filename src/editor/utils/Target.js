/** @module b3e */
(function() {
  'use strict';

  /**
   * A target specification.
   *
   * @class Target  
   * @constructor
   */
  b3e.Target = function() {
    this.name = null;
    this.title = null;
    this.properties = {};
    this.methods = {};

    /**
     * Copy this target.
     *
     * @method copy
     * @returns {b3e.Target} A copy of this target
     */
    this.copy = function() {
      var n         = new b3e.Target();
      n.name        = this.name;
      n.title        = this.title;
      n.properties  = this.properties;
      n.methods  = this.methods;
      return n;
    };
  };
})();