# Gyobango2

**Gyobango2** is a Visual Studio Code extension that allows you to know the visual line number (wrapped line number)  from the top of a file. Line numbers are not displayed to the left of each line. Instead, it opens a new file to display line numbers. Please run it again if the screen scrolls or the display width of the editor window is changed.

## Features

- **Calculating the visible line number:**  
  Visually moves the cursor upwards (for each wrapped line) and counts the number of times the cursor moves until it reaches the top.

- **Auto-Generated Number File:**  
  If a numbered file already exists, reuse it. If not, create a new one in a separate editor pane. Manually change the display width of the numbered file if necessary.
  
- **Dynamic Number Generation:**  
  Write numbers from `00001` to `current line + 100` consecutively, without gaps, to a numbered sequential file.
  
- **Automatic Window Management:**  
  Ensures that only the necessary editor windows remain open by closing the original editor pane when a secondary window is opened.

## Requirements

- Visual Studio Code (or CURSOR, as it is based on VS Code)
- No additional dependencies are required.

## Usage

1. Open a text file in VS Code (or CURSOR).
2. Select Edit shortcut keys from Ctrl+Shift+P and assign "Gyobango2: Gyo Bango2" to any shortcut key.
3. Press the shortcut key to run it.
4. Cursor movements are counted and a number sequence file is created or updated accordingly.
5. Please run it again if you change the display width of the window you are editing. The first time you run it, the display width of the screen should have changed because the numbered file was opened. In that case, run it again.
6. If you scroll the screen on the file you are editing, there will be a difference in the line numbers, so please run it again.
7. Please use this function without displaying "Breadcrumbs", i.e., the navigation hierarchical links at the top of each editing window. If it is enabled, one extra line number will be displayed. We recommend that you turn off "Breadcrumbs" by pressing "Ctrl-,".

## Commands

- **Gyobango2: Gyo Bango2**  
  Run the above process only once.

## Extension Settings

_No extension-specific settings are provided at this time._

## Known Issues

- The extension currently supports a single primary cursor only.
- The process relies on the built-in `cursorMove` command, meaning future VS Code updates could affect its behavior.
- If an existing number file is manually edited, gaps may occur in numbering.

## Release Notes

### 0.1.1

- The README file was incorrect, so we fixed it.

### 0.0.1

- Initial release of Gyobango2.
- Added automated number sequence file handling.
- Implemented cursor tracking and window management.

## Contributing

Contributions, bug reports, and feature requests are welcome! Please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/hortense667/gyobango2).

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
