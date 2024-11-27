import Lion from "./assets/Lion.png";
import "./App.css";
import { useState } from "react";

function App() {
  const [colour, setColour] = useState<string>(""); // Background color
  const [font, setFont] = useState<string>(""); // Font family
  const [detectedFonts, setDetectedFonts] = useState<string[]>([]); // Detected fonts
  const [error, setError] = useState<string | null>(null); // Error handling

  // Function to apply font to the whole page
  const applyChanges = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

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
              style.textContent = `* { font-family: ${font} !important; }`;
              document.head.appendChild(style);
            };
            applyFontWithCSS(font);
          },
        });
      } else {
        setError("No active tab or tab ID is undefined.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while applying the font.");
    }
  };

  // Function to apply font only to the selected text
  const applyFontToSelection = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab && tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [font],
          func: (font) => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0); // Get selected text range
              const span = document.createElement("span");
              span.style.fontFamily = font; // Apply selected font
              span.textContent = range.toString(); // Preserve the selected text
              range.deleteContents(); // Remove the original selection
              range.insertNode(span); // Insert the styled span
            } else {
              alert("Please select text first to apply the font.");
            }
          },
        });
      } else {
        setError("No active tab or tab ID is undefined.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while applying the font.");
    }
  };

  // Function to detect fonts used on the website
  const detectFonts = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab && tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const detectFonts = (): string[] => {
              const elements = document.querySelectorAll("*");
              const fonts = new Set<string>();
              elements.forEach((el) => {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.fontFamily) {
                  fonts.add(computedStyle.fontFamily);
                }
              });
              return Array.from(fonts);
            };

            return detectFonts();
          },
        }, (injectionResults) => {
          if (injectionResults && injectionResults[0]?.result) {
            setDetectedFonts(injectionResults[0].result);
          }
        });
      } else {
        console.error("No active tab or tab ID is undefined");
      }
    } catch (error) {
      console.error("An error occurred while detecting fonts:", error);
    }
  };

  return (
    <div className="app">
      <div>
        <a href="https://yonasku.vercel.app" target="_blank" rel="noopener noreferrer">
          <img src={Lion} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Eglion</h1>
      <div className="card">
        <div>
          <button onClick={detectFonts}>Detect Fonts</button>
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
        <button onClick={applyChanges}>Apply Font to Whole Page</button>
        <button onClick={applyFontToSelection}>Apply Font to Selected Text</button>

        {error && <p className="error">{error}</p>}
        <p>Choose a color and font to update the browser page or apply to selected text.</p>
      </div>

      {detectedFonts.length > 0 && (
        <div className="detected-fonts">
          <h2>Detected Fonts:</h2>
          <ul>
            {detectedFonts.map((font, index) => (
              <li key={index} style={{ fontFamily: font }}>{font}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="read-the-docs">
        Click on the Lion Logo to learn more
      </p>
    </div>
  );
}

export default App;
