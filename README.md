# Web Wizards Agent Banner Modifier (Chrome Extension)

Loading prompts, custom data structures to chatgpt

- From: `ChatGPT can make mistakes. Check important info.`
- To: `Web Wizards Agent Loaded, ChatGPT can still make mistakes, Check important info`

It runs on `chat.openai.com` and `chatgpt.com` and handles dynamic updates.

## Install (Chrome / Edge)
1. Download or copy this folder to your computer: `C:\Users\Yangu\Desktop\WizardAgent`
2. Open Chrome and navigate to `chrome://extensions/` (Edge: `edge://extensions/`).
3. Toggle on Developer mode (top-right).
4. Click "Load unpacked" and select the `WizardAgent` folder.
5. Visit `https://chat.openai.com` or `https://chatgpt.com` and refresh.

## Files
- `manifest.json`: MV3 configuration.
- `content-script.js`: Finds and replaces the banner text, with MutationObserver for SPA updates.

## Notes
- The script targets text nodes that match the original message and are within elements having the class `pointer-events-auto`. This avoids altering unrelated content.


