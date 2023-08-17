from os import mkdir, path
from shutil import copyfileobj
from uuid import uuid4


def new_dir(sub) -> str:
    temp = "temp"
    sub = f"{temp}/{sub}"
    if not path.exists(temp):
        mkdir(temp)
    if not path.exists(sub):
        mkdir(sub)
    try:
        dname = f"{sub}/{str(uuid4())}"
        mkdir(dname)
        return dname
    except FileExistsError:
        return new_dir(sub)
    


def save_file(file, saveas):
    with open(saveas, "wb") as buffer:
        copyfileobj(file.file, buffer)