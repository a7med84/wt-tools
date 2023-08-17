from fastapi import File, UploadFile
from fastapi.exceptions import HTTPException
from typing_extensions import Annotated
from typing import List

from shutil import rmtree
from os import mkdir, path

from PyPDF4 import PdfFileMerger, PdfFileReader
from .utils import *


def merge_pdf(files: Annotated[
    List[UploadFile], File(description="Multiple files as UploadFile")
],) -> str:
    dir = new_dir('pdf')
    input_dir = f"{dir}/input"
    mkdir(input_dir)
    try:
        mergeFile = PdfFileMerger()
        for i, file in enumerate(files):
            if not file.content_type == "application/pdf":
                raise HTTPException(status_code=400, detail="Invalid file type")
            
            saveas = path.join(input_dir, f'file{i}.pdf')
            save_file(file, saveas)
            out = f"{dir}/merged.pdf"
            mergeFile.append(PdfFileReader(saveas), import_bookmarks=False)    
        mergeFile.write(out)
        yield f"/download/{out}"
    except:
        raise HTTPException(status_code=400, detail="Error merging")
    finally:
        # clean files after sending response
        rmtree(input_dir)
