import webbrowser
import psutil

class EmailGenerationModule:

  def compose_email(self, task):
    header = "this is header"
    body = "this is body"
    # for p in psutil.process_iter(["name"]):
    #   if p.info["name"] in ["chrome.exe"]:

        
    # webbrowser.open("https://gmail.com")

    print('Mail Composed')

  def execute(self, task):
    match task.action:
      case 'compose_email':
        self.compose_email(task)
   