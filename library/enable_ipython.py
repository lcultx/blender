from IPython import embed
import threading
class ipythonRunner(threading.Thread): #The timer class is derived from the class threading.Thread
    def __init__(self, embed):
        threading.Thread.__init__(self)
        self.embed = embed
    def run(self): #Overwrite run() method, put what you want the thread do here
        self.embed();
    def stop(self):
        self.thread_stop = True

ipythonRunner(embed).start()
