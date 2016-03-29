class Signal {
  constructor() {
    // [ { callback (function), context (object=null) } ]
    this._listeners = [];
  }

  add(callback, context) {
    if (typeof context === 'undefined') {
      context = null;
    }

    this._listeners.push({
      callback: callback,
      context: context
    });
  }

  remove(callback, context) {
    this._listeners = this._listeners.filter(function(listener) {
      return listener.callback !== callback ||
        listener.context !== context;
    });
  }

  dispatch() {
    var args = arguments;

    this._listeners.forEach(function(listener) {
      listener.callback.apply(listener.context, args);
    });
  }

  clear() {
    this._listeners = [];
  }
}

module.exports = Signal;
