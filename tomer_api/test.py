from PIL import Image
from numpy import asarray

image = Image.open('shoe.png')
numpydata = asarray(image)
# summarize some details about the image
print(image.format)
print(image.size)
print(image.mode)
print(numpydata)
