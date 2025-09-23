document.getElementById("clickMe").addEventListener("click", () => {
  chrome.scripting.executeScript({
    target: {tabId: chrome.tabs.TAB_ID_CURRENT},
    func: () => alert("Hello from your extension!")
  });
});
