from fastapi import Form, UploadFile
from typing_extensions import Annotated
from fastapi.exceptions import HTTPException
import operator
from bs4 import BeautifulSoup
from shutil import rmtree
from .utils import *

def extraxt_text(sessions: Annotated[str, Form()]) -> str:
    print('*' * 100)
    print(sessions)
    try:
        soup = BeautifulSoup(sessions, 'html.parser')
        labels =list(map(operator.attrgetter("text"), soup.find_all('span', {'class': 'd-inline'})))
        txt = [x.get('placeholder') for x in soup.find_all('textarea')]

        res = ''
        if len(labels) == len(txt):
            for i in range(1, len(txt) + 1):
                res += f'<h3 style="font-weight: bold;">{labels[-i]}</h3>'
                res += f'<p>{txt[-i]}</p>'
        return res
    except:
        raise HTTPException(status_code=400, detail="Error parsing")
    finally:
        pass

