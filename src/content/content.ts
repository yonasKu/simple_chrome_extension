let tooltip: HTMLDivElement | null = null;

const createTooltip = (fontFamily: string, rect: DOMRect) => {
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "12px";
    tooltip.style.zIndex = "9999";
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = `Font: ${fontFamily}`;
  tooltip.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 100)}px`;
  tooltip.style.top = `${Math.max(rect.top + window.scrollY - 30, 0)}px`;
};

const handleSelectionChange = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const parentElement = range.startContainer.parentElement;

    if (parentElement) {
      const computedStyle = window.getComputedStyle(parentElement);
      const fontFamily = computedStyle.fontFamily;

      const rect = range.getBoundingClientRect();
      createTooltip(fontFamily, rect);
    }
  } else if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
};

const removeListenersAndTooltip = () => {
  document.removeEventListener("selectionchange", handleSelectionChange);
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
};

chrome.storage.local.get("isSelectionActive", (data) => {
  const isSelectionActive = data.isSelectionActive ?? true;
  if (isSelectionActive) {
    document.addEventListener("selectionchange", handleSelectionChange);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_SELECTION_FEATURE") {
    if (message.isActive) {
      document.addEventListener("selectionchange", handleSelectionChange);
    } else {
      removeListenersAndTooltip();
    }
  }
});
