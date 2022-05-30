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
    cv2img = np.array(Image.open('shoe.png'))
    cv2img = cv2.cvtColor(cv2img, cv2.COLOR_BGR2RGB)
    res, im_png = cv2.imencode(".png", cv2img)
    im_png = base64.b64encode(im_png)
    return im_png
   