import Lion from "./assets/Lion.png";
import "./App.css";
import { useState } from "react";

function App() {
  const [colour, setColour] = useState<string>(""); // Background color
  const [font, setFont] = useState<string>(""); // Font family
  const [detectedFonts, setDetectedFonts] = useState<string[]>([]); // Detected fonts

  // Function to apply color and font family changes
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

  // Function to detect fonts used on the website
  const detectFonts = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab && tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // Detect and return all unique fonts used on the website
            const detectFonts = (): string[] => {
              const elements = document.querySelectorAll("*"); // Get all elements
              const fonts = new Set<string>(); // Use a Set to store unique fonts

              elements.forEach((el) => {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.fontFamily) {
                  fonts.add(computedStyle.fontFamily);
                }
              });

              return Array.from(fonts); // Convert Set to an Array
            };

            return detectFonts();
          },
        }, (injectionResults) => {
          // Receive detected fonts from the content script
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
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
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
        <button onClick={applyChanges}>Apply Changes</button>

        <p>Choose a color and font to update the browser page or detect fonts used.</p>
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
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
