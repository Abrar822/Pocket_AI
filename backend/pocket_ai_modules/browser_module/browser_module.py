import webbrowser
from urllib.parse import quote
from playwright.sync_api import sync_playwright


class BrowserModule:

    def __init__(self):
        self.actions = {
            "open_website": self.open_website,
            "summarize_website": self.summarize_website,
            "search": self.search,
        }
        self.search_engines = {
            "youtube": "https://www.youtube.com/results?search_query={}",
            "google": "https://www.google.com/search?q={}",
            "github": "https://www.github.com/search?q={}&type=repositories",
            "wikipedia": "https://en.wikipedia.org/wiki/{}",
            "reddit": "https://www.reddit.com/search/?q={}",
            "amazon": "https://www.amazon.in/s?k={}",
            "linkedin": "https://www.linkedin.com/search/results/all/?keywords={}",
            "facebook": "https://www.facebook.com/search/top?q={}",
            "instagram": "https://www.instagram.com/explore/tags/{}/",
            "twitter": "https://twitter.com/search?q={}",
            "x": "https://twitter.com/search?q={}",
            "spotify": "https://open.spotify.com/search/{}",
        }

    def open_website(self, task):
        webbrowser.open(task.parameters.url)

    def search(self, task):
        query = quote(task.parameters.query)
        website_name = task.parameters.website_name
        search_url = self.search_engines[website_name.strip().lower()]
        webbrowser.open(search_url.format(query))

    def summarize_website(self, task):

        url = task.parameters.url

        engine = sync_playwright().start()
        browser = engine.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(url, wait_until="domcontentloaded")
        page.wait_for_timeout(5000)
        text = page.locator("body").inner_text()

        browser.close()
        engine.stop()
        print(text)

    def execute(self, task):
        action = self.actions.get(task.action)
        if action:
            action(task)
