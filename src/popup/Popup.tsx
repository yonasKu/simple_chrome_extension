import { useState } from "react";
import './popup.css';

const Popup = () => {
  const [font, setFont] = useState<string>("Arial");

  const applyFontToPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (fontFamily: string) => {
            document.body.style.fontFamily = fontFamily;
          },
          args: [font],
        });
      } else {
        console.error("Tab ID is undefined");
      }
    });
  };

  return (
    <div>
      <h1>Choose a Font</h1>
      <select onChange={(e) => setFont(e.target.value)} value={font}>
        <option value="Arial">Arial</option>
        <option value="'Courier New'">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>
      <button onClick={applyFontToPage}>Apply Font</button>
    </div>
  );
};

export default Popup;
