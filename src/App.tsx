import Lion from "./assets/Lion.png";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [colour, setColour] = useState<string>(""); // Background color
  const [font, setFont] = useState<string>(""); // Font family
  const [detectedFonts, setDetectedFonts] = useState<string[]>([]); // Detected fonts
  const [error, setError] = useState<string | null>(null); // Error handling
  const [isSelectionActive, setIsSelectionActive] = useState<boolean>(true);

  useEffect(() => {
    const savedColour = localStorage.getItem("colour");
    const savedFont = localStorage.getItem("font");
    const savedIsSelectionActive = localStorage.getItem("isSelectionActive");

    if (savedColour) setColour(savedColour);
    if (savedFont) setFont(savedFont);
    if (savedIsSelectionActive)
      setIsSelectionActive(JSON.parse(savedIsSelectionActive));
  }, []);

  // Save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("colour", colour);
    localStorage.setItem("font", font);
    localStorage.setItem(
      "isSelectionActive",
      JSON.stringify(isSelectionActive)
    );
  }, [colour, font, isSelectionActive]);

  const showFontTooltip = async () => {
    try {
      console.log("isSelectionActive:", isSelectionActive); // Log the state

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [isSelectionActive], // Pass the state to the function
          func: (isSelectionActive) => {
            console.log(
              "isSelectionActive in executed script:",
              isSelectionActive
            );

            let tooltip: HTMLDivElement | null = null;

            const createTooltip = (fontFamily: string, rect: DOMRect) => {
              console.log("createTooltip called with fontFamily:", fontFamily);
              if (!tooltip) {
                console.log("Creating tooltip...");
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
              tooltip.style.left = `${Math.min(
                rect.left + window.scrollX,
                window.innerWidth - 100
              )}px`;
              tooltip.style.top = `${Math.max(
                rect.top + window.scrollY - 30,
                0
              )}px`;
            };

            const handleSelectionChange = () => {
              console.log("selectionchange event triggered");

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
                console.log("No selection, removing tooltip");
                tooltip.remove();
                tooltip = null; // Ensure tooltip is removed
              }
            };

            const removeListenersAndTooltip = () => {
              console.log("Removing listeners and tooltip");
              document.removeEventListener(
                "selectionchange",
                handleSelectionChange
              );
              if (tooltip) {
                tooltip.remove();
                tooltip = null; // Explicit cleanup of tooltip
              }
            };

            // Clean up any existing listeners first
            document.removeEventListener(
              "selectionchange",
              handleSelectionChange
            );

            if (isSelectionActive) {
              console.log("Enabling selection feature");
              document.addEventListener(
                "selectionchange",
                handleSelectionChange
              );
            } else {
              console.log("Disabling selection feature");
              removeListenersAndTooltip();
            }
          },
        });
      }
    } catch (error) {
      console.error("Error toggling font tooltip functionality:", error);
    }
  };

  
  const applyChanges = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

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
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

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
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab && tab.id !== undefined) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              const elements = document.querySelectorAll("*");
              const fonts = new Set<string>();
              elements.forEach((el) => {
                const computedStyle = window.getComputedStyle(el);
                const fontFamilies = computedStyle.fontFamily
                  .split(",")
                  .map((f) => f.trim());
                fontFamilies.forEach((font) => fonts.add(font)); // Add each font individually
              });
              return Array.from(fonts);
            },
          },
          (injectionResults) => {
            if (injectionResults && injectionResults[0]?.result) {
              setDetectedFonts(injectionResults[0].result);
            }
          }
        );
      }
    } catch (error) {
      console.error("Error detecting fonts:", error);
    }
  };

  return (
    <div className="app">
      <div>
        <a
          href="https://yonasku.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
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
          <select onChange={(e) => setFont(e.currentTarget.value)} value={font}>
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
        <button onClick={applyFontToSelection}>
          Apply Font to Selected Text
        </button>

        {error && <p className="error">{error}</p>}
        <p>
          Choose a color and font to update the browser page or apply to
          selected text.
        </p>
      </div>

      {detectedFonts.length > 0 && (
        <div className="detected-fonts">
          <h2>Detected Fonts:</h2>
          <ul>
            {detectedFonts.map((font, index) => (
              <li key={index} style={{ fontFamily: font }}>
                {font}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Button to trigger the log of selected text and font */}
      {/* <button onClick={logSelectedTextAndFont}>
        Log Selected Text and Font
      </button> */}
      {/* Button to trigger the display of font style tooltip */}
      <button
        onClick={() => {
          setIsSelectionActive((prev) => !prev); // Toggle the state
          showFontTooltip(); // Enable/disable tooltip logic based on the new state
        }}
      >
        {isSelectionActive
          ? "Disable Selection Feature"
          : "Enable Selection Feature"}
      </button>

      {error && <p className="error">{error}</p>}
      <p>
        Select some text on the page, then click the button to log the selected
        text and its font style.
      </p>
      <p className="read-the-docs">Click on the Lion Logo to learn more</p>
    </div>
  );
}

export default App;
