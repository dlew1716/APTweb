import requests
import time
import base64

for x in xrange(1,7):
	f=open ("llama/"+'llama'+str(x)+".jpg", "rb") 

	data = f.read()
	b64data = base64.b64encode(data)

	postdata = {'wav':b64data,'time':str(x+10),'filename':str(x),'type':'wav'}

	res = requests.post('http://127.0.0.1:8080',postdata)


	f.close

	time.sleep(.1)
