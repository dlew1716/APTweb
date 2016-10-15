import requests
import time
import base64


f=open ("mono_best.wav", "rb") 

data = f.read()
b64data = base64.b64encode(data)

postdata = {'wav':b64data}

res = requests.post('http://192.168.0.23:8080',postdata)


f.close


