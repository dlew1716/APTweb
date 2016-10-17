import requests
import time
import base64
import datetime
#N18_4827.wav
f=open ("satmatt3.wav", "rb") 

data = f.read()
b64data = base64.b64encode(data)

postdata = {'wav':b64data,'date':datetime.datetime.now().strftime('%Y-%m-%dT%Hz%Mz%S')}

res = requests.post('http://127.0.0.1:8080',postdata)


f.close

time.sleep(.1)
