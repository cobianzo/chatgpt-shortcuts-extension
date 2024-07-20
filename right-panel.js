/**
 * Creation of the right panel with javascript.
 *
 *
 */

/**
 * Function to add a panel with commands to the DOM.
 *
 * @param {HTMLElement} DOMEl
 * @return {void}
 */
function addPanelWithCommands(DOMEl = null) {
  if (!DOMEl) return;
  DOMEl.insertAdjacentHTML(
    "afterend",
    `<div id="right-panel" class="cobi-extension-namespace">
      <button id="add-shortcut" class="button">Edit Shortcuts</button>

      <ul class="shortcuts-wrapper">

      </ul>
    </div>`
  );

  loadShortcutsTagCloud(
    document.querySelector("#right-panel .shortcuts-wrapper")
  );

  return document.querySelector("#right-panel");
}

function bindEventsToPanel() {
  const panel = document.getElementById("right-panel");

  if (!panel) console.error("Panel not found");

  const button = panel.querySelector("#add-shortcut");
  const shortcutsWrapper = panel.querySelector("#shortcuts-wrapper");

  button.addEventListener("click", () => {
    openPanelEditor();
  });
}

function loadShortcutsTagCloud(wrapperUl) {
  wrapperUl.innerHTML = "";
  const allShortcuts = manageShortcuts.getAllShortcuts();
  for (const key in allShortcuts) {
    // add the dom element for the shortcut
    const shortcutEl = document.createElement("li");
    shortcutEl.textContent = `/${key}`;
    wrapperUl.appendChild(shortcutEl);
    // Add an attribute to the element
    shortcutEl.setAttribute("title", allShortcuts[key].description);

    // bind the onclick event:
    // [TODO]
  }
}
