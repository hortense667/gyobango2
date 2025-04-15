# Gyobango2

**Gyobango2** is a Visual Studio Code extension that automatically processes the currently open file based on cursor movement and user inactivity. Unlike standard editor automation tools, Gyobango2 actively tracks user interactions and performs structured operations when the user pauses for a specified duration.

## Features

- **Monitors User Activity:**  
  Detects when a user stops interacting with the editor for 5 seconds and then triggers automated processing.
  
- **Automated Cursor Tracking:**  
  Moves the cursor upwards visually (wrapped line by wrapped line) until it reaches the top, counting the number of movements.
  
- **Auto-Generated Number File:**  
  If a number-sequenced file already exists, it is reused and extended. Otherwise, a new file is created in a secondary editor pane.
  
- **Dynamic Number Generation:**  
  Writes numbers starting from `00001` up to `count + 100` into the designated file, ensuring continuity without gaps.
  
- **Automatic Window Management:**  
  Ensures that only the necessary editor windows remain open by closing the original editor pane when a secondary window is opened.

## Requirements

- Visual Studio Code (or CURSOR, as it is based on VS Code)
- No additional dependencies are required.

## Usage

1. Open a text file in VS Code (or CURSOR).
2. Activate the extension via `Ctrl+Shift+P` and run **Gyobango2: Gyo Bango2**.
3. The extension begins monitoring for user inactivity.
4. After 5 seconds of no input, the automation process starts.
5. The cursor movement is counted, and the number-sequenced file is either created or updated accordingly.
6. The original editor pane is closed to prevent duplicate windows.

## Commands

- **Gyobango2: Gyo Bango2**  
  Starts or stops the monitoring process for automatic cursor tracking and number file generation.

## Extension Settings

_No extension-specific settings are provided at this time._

## Known Issues

- The extension currently supports a single primary cursor only.
- The process relies on the built-in `cursorMove` command, meaning future VS Code updates could affect its behavior.
- If an existing number file is manually edited, gaps may occur in numbering.

## Release Notes

### 0.0.1

- Initial release of Gyobango2.
- Added automated number sequence file handling.
- Implemented cursor tracking and window management.

## Contributing

Contributions, bug reports, and feature requests are welcome! Please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/hortense667/gyobango2).

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
