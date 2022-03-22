from distutils.dir_util import copy_tree
import os, io
from urllib import response
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from model import *
import json
import numpy as np
import cv2
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
)
model = GeneratorUNet()


@app.post("/predict")
def predict(file: UploadFile = File(...)):
    contents = file.file.read()
    # Save the image to a temporary file
    with open('temp.png', 'wb') as f:
        f.write(contents)
    # Load the image
    model.predict('temp.png')
    # Return the image
    # with open('shoe.jpeg', 'rb') as f:
    #     pil_im = Image.open(f)
    #     b = io.BytesIO()
    #     pil_im.save(b, 'JPEG')
    #     im_bytes = b.getvalue()
    #     json_object = {"success": True, "file": str(im_bytes)}
    #     return JSONResponse(content=json_object)
    cv2img = np.array(Image.open('shoe.png'))
    cv2img = cv2.cvtColor(cv2img, cv2.COLOR_BGR2RGB)
    res, im_png = cv2.imencode(".png", cv2img)
    im_png = base64.b64encode(im_png)
    return im_png
    # Image.open('shoe.png').save('shoe.png', 'PNG')
    # return FileResponse('shoe.png', media_type="image/png")