"use strict";

// Espera a que la página esté completamente cargada
window.addEventListener("load", () => {
  // Selecciona el campo de entrada del prompt
  const promptInput = document.querySelector("#prompt-textarea"); // Cambia 'selector_del_prompt' por el selector correcto
  const sendBtn = document.querySelector('[data-testid="send-button"]');
  if (!promptInput) return;

  console.log(manageShortcuts.getAllShortcuts());

  const rightPanelEl = addPanelWithCommands(promptInput);
  addEditorPanelWithCommands(rightPanelEl);

  bindEventsToPanel();

  sendBtn.addEventListener("click", (e) => {
    promptInput.value = replaceShortcutsByDescriptions(promptInput.value);
  });

  document.querySelector("main form #prompt-textarea").addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter" || (e.key === "Enter" && e.shiftKey)) {
        promptInput.value = replaceShortcutsByDescriptions(promptInput.value);
      }
    },
    true
  );
});

function replaceShortcutsByDescriptions(inputValue) {
  const regex = /\/[^\s]+ /g;
  let modifiedQuery = inputValue + " ";
  const matches = modifiedQuery.match(regex);
  console.log("Checking shortcuts in query...", matches);

  // Examples of "matches" values:
  // - [" /sa ", " /foo "] (2 matches)
  // - [" /sa "] (1 match)
  // - null (0 matches)
  if (matches) {
    const allShortcuts = manageShortcuts.getAllShortcuts();
    const shortcutKeys = Object.keys(allShortcuts);
    const filteredShortcuts = shortcutKeys.filter((shortcutKey) =>
      matches.includes(`/${shortcutKey} `)
    );

    console.log("Found shortcuts:", filteredShortcuts);

    // now we replace the shortcuts with the texts.
    filteredShortcuts.forEach((shortcutKey) => {
      const { position, description } = allShortcuts[shortcutKey];

      if (position === "before" || !position) {
        modifiedQuery = `${description}\n${modifiedQuery}`;
      }
      if (position === "after") {
        modifiedQuery = `${modifiedQuery}\n${description}`;
      }

      // remove the shortcut from the query
      modifiedQuery = modifiedQuery.replace(`/${shortcutKey} `, "");
    });

    return modifiedQuery;
  }
  return inputValue;
}
