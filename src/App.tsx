import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [colour, setColour] = useState("");

  const onclick = async () => {
    // Query the active tab in the current window
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Ensure the tab exists and has a valid id
    if (tab && tab.id !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [colour],
        func: (colour) => {
          document.body.style.backgroundColor = colour;
        },
      });
    } else {
      console.error("No active tab or tab ID is undefined");
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <input
          type="color"
          onChange={(e) => setColour(e.currentTarget.value)}
          value={colour}
        />
        <button onClick={onclick}>Click Me</button>
        <p>
          choose a color and make a change to the browser page 
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
