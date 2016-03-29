import config from '../util/config.js';
import Signal from '../util/Signal.js';

class KeywordStore {
  constructor() {
    this._keywords = [];

    // Signal
    // @param [keywords]
    this.onUpdate = new Signal();
  }

  /*
   * Add a keyword
   * Replaces existing keyword
   */
  add(keyword) {
    var i = this._keywords.indexOf(keyword);

    if (i > -1) {
      this._keywords.splice(i, 1, keyword);
    } else {
      this._keywords.push(keyword);
    }

    this.onUpdate.dispatch(this._keywords);
  }

  /*
   * Remove keyword
   */
  remove(keyword) {
    var i = this._keywords.indexOf(keyword);

    if (i > -1) {
      this._keywords.splice(i, 1);
      this.onUpdate.dispatch(this._keywords);
    }
  }

  /*
   * Get all keywords
   */
  getAll() {
    // Create shallow copy
    return this._keywords.slice();
  }
}

module.exports = KeywordStore;
