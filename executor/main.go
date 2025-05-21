package main

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
)

func main() {
	// Define the command to execute based on the operating system.
	var cmd *exec.Cmd
	// The command to be executed in the new shell.
	commandToExecute := "npm run preview -- --open" // Example command

	// Check the operating system and set the appropriate command to open a new shell tab/window.
	switch runtime.GOOS {
	case "windows":
		// On Windows, 'start cmd.exe /k "command"' opens a new command prompt window
		// and executes the command, keeping the window open (/k).
		// Note: This opens a new window, not a new tab, as native Windows cmd.exe doesn't support tabs.
		// For Windows Terminal, you might use 'wt.exe new-tab --title "Go Command" cmd.exe /k "..."'
		// but this requires Windows Terminal to be installed and in the PATH.
		cmd = exec.Command("cmd.exe", "/C", fmt.Sprintf("start cmd.exe /k %s", commandToExecute))
	case "darwin":
		// On macOS, use 'osascript' to send AppleScript commands to the default Terminal.app.
		// This script opens a new tab in the frontmost Terminal window and executes the command.
		// If no Terminal window is open, it will open a new one.
		appleScript := fmt.Sprintf(`
			tell application "Terminal"
				activate
				tell application "System Events"
					keystroke "t" using command down
				end tell
				delay 0.5 -- Give a moment for the new tab to open
				do script "%s" in front window
			end tell`, commandToExecute)
		cmd = exec.Command("osascript", "-e", appleScript)
	case "linux":
		// On Linux, opening a new tab/window is highly dependent on the terminal emulator.
		// This example attempts to use 'gnome-terminal', which is common on Gnome-based systems.
		// You might need to change this to 'konsole', 'xterm', 'alacritty', etc., depending on your setup.
		// '--tab' opens a new tab, '--command' specifies the command to run.
		// If gnome-terminal is not found or not your default, this might fail.
		cmd = exec.Command("gnome-terminal", "--tab", "--command", commandToExecute)
	default:
		fmt.Printf("Unsupported operating system for opening new shell tab/window: %s\n", runtime.GOOS)
		os.Exit(1) // Exit with an error code for unsupported OS
	}

	// Set the standard output and standard error of the *parent* command to the current process's output.
	// This will show any errors from the command that *launches* the new shell.
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// Run the command to open the new shell.
	err := cmd.Run()
	if err != nil {
		// If there's an error executing the command (e.g., 'gnome-terminal' not found), print it.
		fmt.Printf("Error launching new shell/tab: %v\n", err)
		os.Exit(1) // Exit with an error code
	}

	// If the command to open the new shell executed successfully, print a success message.
	fmt.Println("Attempted to open a new shell tab/window and execute command. Program is finishing.")

	// The program will automatically finish after the main function completes.
}
