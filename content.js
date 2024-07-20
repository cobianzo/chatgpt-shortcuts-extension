"use strict";

// Espera a que la página esté completamente cargada
window.addEventListener("load", () => {
  // Selecciona el campo de entrada del prompt
  const promptInput = document.querySelector("#prompt-textarea"); // Cambia 'selector_del_prompt' por el selector correcto

  if (!promptInput) return;

  console.log(manageShortcuts.getAllShortcuts());

  const rightPanelEl = addPanelWithCommands(promptInput);
  addEditorPanelWithCommands(rightPanelEl);

  bindEventsToPanel();

  document.querySelector("main form #prompt-textarea").addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter" || (e.key === "Enter" && e.shiftKey)) {
        const inputValue = promptInput.value;
        const regex = /\/[^\s]+ /g;
        const matches = inputValue.match(regex);
        console.log("Checking shortcuts in query...", matches);

        if (matches) {
          const allShortcuts = manageShortcuts.getAllShortcuts();
          const shortcutKeys = Object.keys(allShortcuts);
          const filteredShortcuts = shortcutKeys.filter((shortcutKey) =>
            matches.includes(`/${shortcutKey} `)
          );

          console.log("Found shortcuts:", filteredShortcuts);

          // now we replace the shortcuts with the texts.
          let modifiedQuery = e.target.value;
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

          e.target.value = modifiedQuery;
        }
      }
    },
    true
  );
});
