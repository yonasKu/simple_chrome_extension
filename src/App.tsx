import Lion from "./assets/Lion.png";
import "./App.css";
import { useState } from "react";

function App() {
  const [colour, setColour] = useState<string>(""); // Background color
  const [font, setFont] = useState<string>(""); // Font family

  const onclick = async () => {
    try {
      // Query the active tab in the current window
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Ensure the tab exists and has a valid ID
      if (tab && tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [colour, font],
          func: (colour: string, font: string) => {
            // Apply background color
            document.body.style.backgroundColor = colour;

            // Dynamically inject CSS to force font-family change with higher specificity
            const applyFontWithCSS = (font: string) => {
              const style = document.createElement("style");
              style.textContent = `
                * {
                  font-family: ${font} !important;
                }
              `;
              document.head.appendChild(style);
            };
            applyFontWithCSS(font);
          },
        });
      } else {
        console.error("No active tab or tab ID is undefined");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={Lion} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Eglion</h1>
      <div className="card">
        <div>
          <label>Choose Background Color:</label>
          <input
            type="color"
            onChange={(e) => setColour(e.currentTarget.value)}
            value={colour}
          />
        </div>
        <div>
          <label>Choose Font Family:</label>
          <select
            onChange={(e) => setFont(e.currentTarget.value)}
            value={font}
          >
            <option value="">Select a font</option>
            <option value="Arial">Arial</option>
            <option value="'Courier New'">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
            <option value="'Times New Roman'">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="'Comic Sans MS'">Comic Sans MS</option>
          </select>
        </div>
        <button onClick={onclick}>Apply Changes</button>
        <p>Choose a color and font to update the browser page</p>
      </div>
      <p className="read-the-docs">
        Click on the Lion Logo to learn more
      </p>
    </>
  );
}

export default App;
