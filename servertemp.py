import socket
import sys
import time
import os
s = socket.socket()
s.bind(("localhost",9999))
s.listen(1) 



while True:
    sc, address = s.accept()

    print address
    l = sc.recv(13) #TODO remove + 
    l = time.gmtime(float(l))
    l = time.strftime('%Y.%m.%d %H:%M:%S',l)

    f = open(os.getcwd()+'/wavs/'+l,'wb') 

    while (l):
    	l = sc.recv(1024)
        f.write(l)
    	#print l
    f.close()


    sc.close()
    print 'Done'

s.close()
