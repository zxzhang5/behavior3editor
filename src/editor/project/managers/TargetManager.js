b3e.project.TargetManager = function (editor, project) {
    "use strict";

    /**
   * Register a target to the target list. You can provide:
   * 
   * - a `b3e.Target` instance.
   * - a generic object containing the target prototype.
   */
  this.add = function(target) {
    if (target.prototype) target = target.prototype;

    if (project._targets[target.name]) {
      return false;
    }

    if (!(target instanceof b3e.Target)) {
      var n         = new b3e.Target();
      n.name        = target.name;
      n.title        = target.title;
      n.properties  = target.properties;
      n.methods  = target.methods;
      target = n;
    }

    project._targets[target.name] = target;

    var _old = [this, this.remove, [target]];
    var _new = [this, this.add, [target]];
    project.history._add(new b3e.Command(_old, _new));
    editor.trigger('targetadd', target);
    return target;
  };

  /**
   * 
   */
  this.get = function(target) {
    if (typeof target !== 'string') return target;
    return project._targets[target];
  };

  /**
   * 
   */
  this.update = function(target, template) {
    target = this.get(target);
    var oldName = target.name;

    delete project._targets[target.name];

    if (target.name !== template.name && this.get(template.name)) return false;


    var _oldValues = {
      name        : target.name,
      title       : target.title,
      properties  : target.properties,
      methods     : target.methods
    };

    if (typeof template.name !== 'undefined') {
      target.name = template.name;
    }
    if (typeof template.title !== 'undefined') {
      target.title = template.title;
    }
    if (typeof template.properties !== 'undefined') {
      target.properties  = tine.merge({}, template.properties);
    }
    if (typeof template.methods !== 'undefined') {
      target.methods  = tine.merge({}, template.methods);
    }

    var _newValues = {
      name        : target.name,
      title       : target.title,
      properties  : target.properties,
      methods     : target.methods
    };

    project.history._beginBatch();

    project._targets[target.name] = target;

    var _old = [this, this.update, [target, _oldValues]];
    var _new = [this, this.update, [target, _newValues]];
    project.history._add(new b3e.Command(_old, _new));
    project.history._endBatch();

    editor.trigger('targetchanged', target);
  };

  /**
   * 
   */
  this.remove = function(target) {
    project.history._beginBatch();

    var name = target.name||target;
    delete project._targets[name];

    var _old = [this, this.add, [target]];
    var _new = [this, this.remove, [target]];
    project.history._add(new b3e.Command(_old, _new));

    project.history._endBatch();

    editor.trigger('targetremoved', target);
  };

  /**
   * Iterates over target list.
   */
  this.each = function(callback, thisarg) {
    Object.keys(project._targets).forEach(function(key) {
      callback.call(thisarg, project._targets[key]);
    });
  };

  this._applySettings = function(settings) {};
};