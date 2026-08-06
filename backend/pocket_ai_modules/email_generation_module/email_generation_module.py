import webbrowser
import pyautogui
import pyperclip
import time


class EmailGenerationModule:

    def compose_email(self, task):
        subject = "Request for 7 Days Leave"
        body = """Dear Manager,

I hope you are doing well.

I would like to request leave for seven days, from 12 August 2026 to 18 August 2026, due to personal reasons. I have completed my current tasks and will ensure that any pending work is handed over appropriately before my leave begins.

I would be grateful if you could approve my leave request. Please let me know if you need any additional information.

Thank you for your understanding.

Kind regards,
Abrar"""
        webbrowser.open("https://mail.google.com/mail/u/0/#inbox?compose=new")
        time.sleep(10)

        pyautogui.press("tab")
        pyperclip.copy(subject)
        pyautogui.hotkey("ctrl", "v")

        pyautogui.press("tab")
        pyperclip.copy(body)
        pyautogui.hotkey("ctrl", "v")

    def execute(self, task):
        match task.action:
            case "compose_email":
                self.compose_email(task)
