import Lion from "./assets/Lion.png";
import "./App.css";
import { useState } from "react";

function App() {
  const [colour, setColour] = useState<string>(""); // Background color
  const [font, setFont] = useState<string>(""); // Font family
  const [detectedFonts, setDetectedFonts] = useState<string[]>([]); // Detected fonts
  const [error, setError] = useState<string | null>(null); // Error handling
  const [isSelectionActive, setIsSelectionActive] = useState<boolean>(true);

  // const logSelectedTextAndFont = async () => {
  //   try {
  //     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  //     if (tab && tab.id !== undefined) {
  //       chrome.scripting.executeScript({
  //         target: { tabId: tab.id },
  //         func: () => {
  //           const selection = window.getSelection();
  //           if (selection && selection.rangeCount > 0) {
  //             const range = selection.getRangeAt(0); // Get the selected text range
  //             const selectedText = range.toString(); // Get the actual selected text
  //             const selectedElement = range.startContainer.parentElement; // Get the parent element of the selected text

  //             if (selectedElement) {
  //               // Get the computed style (font-family) of the selected element
  //               const computedStyle = window.getComputedStyle(selectedElement);
  //               const fontFamily = computedStyle.fontFamily;

  //               // Log the selected text and font style to the browser console
  //               console.log(`Selected Text: ${selectedText}`);
  //               console.log(`Font Style: ${fontFamily}`);
  //             }
  //           } else {
  //             console.log("No text selected.");
  //           }
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error logging selected text and font:", error);
  //     setError("An error occurred while retrieving the selected text or font.");
  //   }
  // };

  // const showFontTooltip = async () => {
  //   try {
  //     const [tab] = await chrome.tabs.query({
  //       active: true,
  //       currentWindow: true,
  //     });

  //     if (tab && tab.id !== undefined) {
  //       chrome.scripting.executeScript({
  //         target: { tabId: tab.id },
  //         func: () => {
  //           const selection = window.getSelection();
  //           if (selection && selection.rangeCount > 0) {
  //             const range = selection.getRangeAt(0); // Get the selected text range
  //             const selectedElement = range.startContainer.parentElement; // Get the parent element of the selected text

  //             if (selectedElement) {
  //               // Get the computed style (font-family) of the selected element
  //               const computedStyle = window.getComputedStyle(selectedElement);
  //               const fontFamily = computedStyle.fontFamily;

  //               // Calculate the position of the selected text on the page
  //               const rect = range.getBoundingClientRect();
  //               const tooltip = document.createElement("div");
  //               tooltip.textContent = `Font: ${fontFamily}`;
  //               tooltip.style.position = "absolute";
  //               tooltip.style.backgroundColor = "#333";
  //               tooltip.style.color = "#fff";
  //               tooltip.style.padding = "5px";
  //               tooltip.style.borderRadius = "5px";
  //               tooltip.style.fontSize = "12px";
  //               tooltip.style.zIndex = "9999"; // Ensure it's on top
  //               tooltip.style.left = `${rect.left + window.scrollX}px`; // Horizontal position
  //               tooltip.style.top = `${rect.top + window.scrollY - 25}px`; // Vertical position, above the selection

  //               // Append the tooltip to the body
  //               document.body.appendChild(tooltip);

  //               // Remove the tooltip after 2 seconds
  //               setTimeout(() => {
  //                 document.body.removeChild(tooltip);
  //               }, 2000);
  //             }
  //           } else {
  //             console.log("No text selected.");
  //           }
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error showing font tooltip:", error);
  //     setError("An error occurred while retrieving the selected text or font.");
  //   }
  // };

  // const showFontTooltip = async () => {
  //   try {
  //     const [tab] = await chrome.tabs.query({
  //       active: true,
  //       currentWindow: true,
  //     });

  //     if (tab && tab.id !== undefined) {
  //       chrome.scripting.executeScript({
  //         target: { tabId: tab.id },
  //         args: [isSelectionActive],
  //         func: (isSelectionActive) => {
  //           let tooltip: HTMLDivElement | null = null;

  //           // Function to create or update the tooltip
  //           const createOrUpdateTooltip = (
  //             fontFamily: string,
  //             rect: DOMRect
  //           ) => {
  //             if (!tooltip) {
  //               // Create a tooltip if it doesn't exist
  //               tooltip = document.createElement("div");
  //               tooltip.style.position = "absolute";
  //               tooltip.style.backgroundColor = "#333";
  //               tooltip.style.color = "#fff";
  //               tooltip.style.padding = "5px";
  //               tooltip.style.borderRadius = "5px";
  //               tooltip.style.fontSize = "12px";
  //               tooltip.style.zIndex = "9999"; // Ensure it's on top
  //               document.body.appendChild(tooltip);
  //             }

  //             // Update tooltip content and position
  //             tooltip.textContent = `Font: ${fontFamily}`;
  //             tooltip.style.left = `${rect.left + window.scrollX}px`; // Horizontal position
  //             tooltip.style.top = `${rect.top + window.scrollY - 25}px`; // Vertical position, above the selection
  //           };

  //           // Function to handle selection changes
  //           const handleSelectionChange = () => {
  //             if (!isSelectionActive) return;

  //             const selection = window.getSelection();
  //             if (selection && selection.rangeCount > 0) {
  //               const range = selection.getRangeAt(0); // Get the selected text range
  //               const selectedElement = range.startContainer.parentElement; // Get the parent element of the selected text

  //               if (selectedElement) {
  //                 // Get the computed style (font-family) of the selected element
  //                 const computedStyle =
  //                   window.getComputedStyle(selectedElement);
  //                 const fontFamily = computedStyle.fontFamily;

  //                 // Calculate the position of the selected text on the page
  //                 const rect = range.getBoundingClientRect();
  //                 createOrUpdateTooltip(fontFamily, rect);
  //               }
  //             } else if (tooltip) {
  //               // Remove the tooltip if no text is selected
  //               tooltip.remove();
  //               tooltip = null;
  //             }
  //           };

  //           if (isSelectionActive) {
  //             document.addEventListener(
  //               "selectionchange",
  //               handleSelectionChange
  //             );
  //           } else {
  //             document.removeEventListener(
  //               "selectionchange",
  //               handleSelectionChange
  //             );
  //             if (tooltip) {
  //               tooltip.remove(); // Safely removes the tooltip if it exists
  //               tooltip = null; // Reset tooltip to null
  //             }
  //           }
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error toggling font tooltip functionality:", error);
  //     setError(
  //       "An error occurred while toggling the selected text functionality."
  //     );
  //   }
  // };

  const showFontTooltip = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [isSelectionActive],
          func: (isSelectionActive: boolean) => {
            let tooltip: HTMLDivElement | null = null;

            // Function to create or update the tooltip
            const createOrUpdateTooltip = (
              fontFamily: string,
              rect: DOMRect
            ) => {
              if (!tooltip) {
                // Create a tooltip if it doesn't exist
                tooltip = document.createElement("div") as HTMLDivElement;
                tooltip.style.position = "absolute";
                tooltip.style.backgroundColor = "#333";
                tooltip.style.color = "#fff";
                tooltip.style.padding = "5px";
                tooltip.style.borderRadius = "5px";
                tooltip.style.fontSize = "12px";
                tooltip.style.zIndex = "9999"; // Ensure it's on top
                document.body.appendChild(tooltip);
              }

              // Update tooltip content and position
              if (tooltip) {
                tooltip.textContent = `Font: ${fontFamily}`;
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 25}px`;
              }
            };

            // Function to handle selection changes
            const handleSelectionChange = () => {
              if (!isSelectionActive) return;

              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedElement = range.startContainer.parentElement;

                if (selectedElement) {
                  const computedStyle =
                    window.getComputedStyle(selectedElement);
                  const fontFamily = computedStyle.fontFamily;

                  const rect = range.getBoundingClientRect();
                  createOrUpdateTooltip(fontFamily, rect);
                }
              } else if (tooltip) {
                // Send message to the extension to remove the tooltip
                chrome.runtime.sendMessage({ action: "removeTooltip" });

                tooltip = null; // Reset tooltip to null
              }
            };

            // Add or remove event listener based on selection activity
            if (isSelectionActive) {
              document.addEventListener(
                "selectionchange",
                handleSelectionChange
              );
            } else {
              document.removeEventListener(
                "selectionchange",
                handleSelectionChange
              );

              // Send message to remove tooltip when toggling off
              if (tooltip) {
                chrome.runtime.sendMessage({ action: "removeTooltip" });
                tooltip = null; // Reset tooltip to null
              }
            }
          },
        });
      }
    } catch (error) {
      console.error("Error toggling font tooltip functionality:", error);
      setError(
        "An error occurred while toggling the selected text functionality."
      );
    }
  };

  // Function to apply font to the whole page
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
          setIsSelectionActive((prev) => !prev);
          showFontTooltip(); // Reapply the functionality with the new state
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
