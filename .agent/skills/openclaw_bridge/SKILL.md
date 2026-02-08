# OpenClaw (Larissa) Bridge Protocol

## Description
This skill enables communication between Antigravity (the current agent) and OpenClaw (Larissa), a self-hosted AI assistant connected to Telegram. The communication is asynchronous and file-based (IPC), avoiding the need for OCR or direct API integration.

## Communication Channels

### 1. Reception (OpenClaw -> Antigravity)
*   **Data File:** `[ProjectRoot]/bridge/from_telegram.md`
*   **Mechanism:** 
    1.  OpenClaw writes the full user message or request into this file.
    2.  **Trigger:** OpenClaw (via AutoHotkey/CLI) sends a short notification to the active chat window (e.g., "/read_bridge" or "Check from_telegram.md").
    3.  **Action:** Upon receiving the trigger in the chat, use `view_file` to read the content of `bridge/from_telegram.md`.

### 2. Transmission (Antigravity -> OpenClaw)
*   **Data File:** `[ProjectRoot]/bridge/to_telegram.md`
*   **Mechanism:**
    1.  To send a message to the user on Telegram, write the content to this file.
    2.  **IMPERATIVE:** Always **OVERWRITE** the entire file content. Do not append.
    3.  OpenClaw watches this file for changes and automatically forwards the new content to the Telegram chat.

## Usage Protocol

1.  **Initialization:**
    *   Check if `[ProjectRoot]/bridge` directory exists.
    *   If not, create it: `mkdir bridge`.
    *   Create empty files `to_telegram.md` and `from_telegram.md` if they don't exist.

2.  **Reading Messages:**
    *   When prompted by a chat message lik "read bridge", read `bridge/from_telegram.md`.
    *   Treat the content of this file as the user's actual prompt.

3.  **Sending Responses:**
    *   Formulate your response intended for the Telegram user.
    *   Use `write_to_file` to save it to `bridge/to_telegram.md` with `Overwrite: true`.
    *   Notify the user in the main chat window that the response has been sent to the bridge (optional but good for debugging).

## Example Workflow

**User (via Telegram):** "Analyze the last error log."
**OpenClaw:** Writes "Analyze the last error log." to `bridge/from_telegram.md`.
**OpenClaw (Trigger):** Injects "Incoming message in bridge." into the code editor chat.
**Antigravity:**
1.  Calls `view_file(".../bridge/from_telegram.md")`.
2.  Reads request.
3.  Performs analysis.
4.  Calls `write_to_file(".../bridge/to_telegram.md", "The error was caused by...")`.
**OpenClaw:** Detects change in `to_telegram.md` and sends text to Telegram.
