document.getElementById("clickMe").addEventListener("click", () => {
  // Find the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tab = tabs[0];
    if (tab && tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert("Hello from your extension!");
        }
      });
    }
  });
});
