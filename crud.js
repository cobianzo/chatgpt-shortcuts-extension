/**
 * An object that manages shortcuts in the browser's local storage.
 * @namespace manageShortcuts
 */
const manageShortcuts = {
  /**
   * The key used to store shortcuts in the browser's local storage.
   * @type {string}
   */
  storageKey: "cobi-shortcuts",

  /**
   * Retrieves the shortcuts from the browser's local storage.
   * @return {Object} The shortcuts.
   */
  getShortcuts() {
    const shortcuts = localStorage.getItem(this.storageKey);
    return shortcuts ? JSON.parse(shortcuts) : {};
  },

  /**
   * Saves the shortcuts in the browser's local storage.
   * @param {Object} shortcuts - The shortcuts to save.
   */
  saveShortcuts(shortcuts) {
    localStorage.setItem(this.storageKey, JSON.stringify(shortcuts));
  },

  /**
   * Creates or updates a shortcut.
   * @param {string} key - The key of the shortcut.
   * @param {string} description - The description of the shortcut.
   * @param {Object} [options] - The options of the shortcut.
   * @param {string} [options.position="before"] - The position of the shortcut.
   */
  createOrUpdateShortcut(key, description, options = { position: "before" }) {
    const shortcuts = this.getShortcuts();
    shortcuts[key] = Object.assign({ description }, options);
    this.saveShortcuts(shortcuts);
  },

  /**
   * Retrieves a shortcut by its key.
   * @param {string} key - The key of the shortcut.
   * @return {Object|null} The shortcut or null if it does not exist.
   */
  getShortcut(key) {
    const shortcuts = this.getShortcuts();
    return Object.keys(shortcuts).find((k) => k === key)
      ? shortcuts[key]
      : null;
  },

  /**
   * Removes a shortcut by its key.
   * @param {string} key - The key of the shortcut.
   */
  removeShortcut(key) {
    const shortcuts = this.getShortcuts();
    delete shortcuts[key];
    this.saveShortcuts(shortcuts);
  },

  /**
   * Retrieves all shortcuts.
   * @return {Object} The shortcuts.
   */
  getAllShortcuts() {
    return this.getShortcuts();
  },
};
