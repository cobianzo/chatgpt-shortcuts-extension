/**
 * The shortcut that has been loaded and we are editing. (object)
 */
let currentShortcutEditing = null;

/**
 * If we are writing a new shortcut (true when starting the creation, string when it's ready to be saved)
 */
let writingShortcut = false;

const statuses = ["creating", "editing"];

function addEditorPanelWithCommands(DOMEl = null) {
  if (!DOMEl) return;
  DOMEl.insertAdjacentHTML(
    "afterend",
    `<div id="editor-panel" class="overlay hide cobi-extension-namespace">
      <div class="editor-panel__content">
        
        <button id="close-editor-panel" class="close-button button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="rgba(0, 0, 0, 0.54)" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <textarea id="editor-shortcut"></textarea>

        <div class="row">
          <div>
            <span>/</span><input id="current-shortcut" type="text" />
          </div>
          <select id="shortcut-position">  
            <option value=""></option>
            <option value="before">Before the query</option>
            <option value="after">After the query</option>
          </select>
          <button id="add-shortcut" class="button">Save</button>
          <button id="remove-shortcut" class="button remove-button">Remove</button>
        </div>
      
        <ul class="shortcuts-wrapper">

        </ul>
      </div>
    </div>`
  );

  const editorPanel = document.getElementById("editor-panel");

  // Add the tag cloud with very shortcut saved in localstorage
  // This fn is in crud.js
  loadShortcutsTagCloud(editorPanel.querySelector(".shortcuts-wrapper"));
  bindTagCloudActions();

  // Bind actions to elements in the editor panel
  bindEditorActions(editorPanel);
}

function bindEditorActions(panelEl) {
  const editor = panelEl.querySelector("#editor-shortcut");
  const addShortcut = panelEl.querySelector("#add-shortcut");

  // different captures while writing in the textarea.
  editor.addEventListener("keydown", (e) => {
    // calculate the position of the cursor inside the textarea:
    const cursorPosition = editor.selectionStart;
    console.log("keydown", cursorPosition, writingShortcut, e);

    if (e.key === "/" && cursorPosition === 0) {
      // we have just started writing a shortcut. Take the text from position 0 to current:
      writingShortcut = true;
      // remove all status class and add creating
      panelEl.classList.remove(...statuses);
      panelEl.classList.add("editing");
      setCurrentShortcutEditing(null);
    }
    if (e.key === " " && writingShortcut === true) {
      // we have just written a shortcut. Take the text from position 0 to current:
      const shortcut = editor.value.slice(0, cursorPosition);
      console.log("shortcut", shortcut);
      writingShortcut = shortcut.replace("/", "");
      document.querySelector("#current-shortcut").value = writingShortcut;
      // remove all status class and add creating
      panelEl.classList.remove(...statuses);
      panelEl.classList.add("creating");
    }

    // caputre CAPS+RETURN to do the same as if we click on SAVE
    if (e.key === "Enter" && e.shiftKey) {
      addShortcut.click();
    }
  });

  // Click on the X => close the editor panel
  const closeEditorPanel = panelEl.querySelector("#close-editor-panel");
  closeEditorPanel.addEventListener("click", () => {
    closePanelEditor();
  });

  // Event on click SAVE button. If we have a shortcut value in
  // writingShortcut then we save it in the localstorage
  addShortcut.addEventListener("click", () => {
    let updateShortcut = null;

    // Case 1) the shortcut has been created by adding '/rb ' at the beginning of the text.
    if (writingShortcut && writingShortcut !== true) {
      updateShortcut = writingShortcut;
      const cleanDescription = editor.value.replace(
        "/" + writingShortcut + " ",
        ""
      );
      editor.value = cleanDescription; // the shortcut removed from the beginning of the text
    }
    // Case 2) We have loaded a shortcut from localstorage and we are editing it.
    else {
      if (currentShortcutEditing) {
        updateShortcut = currentShortcutEditing;
        panelEl.classList.remove(...statuses);
        panelEl.classList.add("editing");
      }
    }
    if (updateShortcut) {
      // save changes
      let options = {};
      if (document.querySelector("#shortcut-position").value) {
        options.position = document.querySelector("#shortcut-position").value;
      }
      manageShortcuts.createOrUpdateShortcut(
        updateShortcut,
        editor.value,
        options
      );
      // update UI
      setCurrentShortcutEditing(updateShortcut);
      loadShortcutsTagCloud(
        document.querySelector("#editor-panel .shortcuts-wrapper")
      );
      bindTagCloudActions();
    }
  });

  // Click on remove
  document.getElementById("remove-shortcut").addEventListener("click", () => {
    console.log("removing shortcut", currentShortcutEditing);
    manageShortcuts.removeShortcut(currentShortcutEditing);
    setCurrentShortcutEditing(null);
    loadShortcutsTagCloud(
      document.querySelector("#editor-panel .shortcuts-wrapper")
    );
    bindTagCloudActions();
  });
}

function bindTagCloudActions() {
  // Click on a tag shortcut
  const shortcutTags = document.querySelectorAll(
    "#editor-panel .shortcuts-wrapper li"
  );
  Array.from(shortcutTags).forEach((tag) => {
    tag.addEventListener("click", (e) => {
      const key = e.target.textContent.replace("/", "");
      setCurrentShortcutEditing(key);
    });
  });
}

function setCurrentShortcutEditing(key) {
  currentShortcutEditing = key;
  document.getElementById("current-shortcut").value = key || "";

  let description = "";
  let position = "";
  const shortcut = manageShortcuts.getShortcut(key);
  if (shortcut) {
    description = shortcut.description;
    position = shortcut.position;
    // activate button delete
    document.getElementById("remove-shortcut").classList.remove("hide");
  } else {
    document.getElementById("remove-shortcut").classList.add("hide");
  }

  document.getElementById("editor-shortcut").value = description;
  document.getElementById("shortcut-position").value = position;
}

function openPanelEditor() {
  document.getElementById("editor-panel").classList.remove(...statuses);
  document.getElementById("editor-panel").classList.remove("hide");

  // set the focus in the textarea
  document.getElementById("editor-shortcut").focus();
}
function closePanelEditor() {
  document.getElementById("editor-panel").classList.remove(...statuses);
  document.getElementById("editor-panel").classList.add("hide");
}
