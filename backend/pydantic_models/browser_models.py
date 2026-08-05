from pydantic import BaseModel, Field
from typing import Literal, Annotated

class SearchParams(BaseModel):
  website_name: Literal['youtube', 'google', 'github', 'wikipedia', 'reddit', 'amazon', 'linkedin', 'facebook', 'instagram', 'twitter', 'x', 'spotify']
  query: str
class Search(BaseModel):
  id: int
  module: Literal['browser']
  action: Literal['search']
  parameters: SearchParams

class OpenWebsiteParams(BaseModel):
  url: str
class OpenWebsite(BaseModel):
  id: int
  module: Literal['browser']
  action: Literal['open_website']
  parameters: OpenWebsiteParams

class SummarizeWebsiteParams(BaseModel):
  url: str
class SummarizeWebsite(BaseModel):
  id: int
  module: Literal['browser']
  action: Literal['summarize_website']
  parameters: SummarizeWebsiteParams

BrowserTask = Annotated[OpenWebsite | SummarizeWebsite | Search, Field(discriminator='action')]