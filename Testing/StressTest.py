from __future__ import division
from threading import Thread
import requests, json, time

url = 'http://api.kaching.xyz/TransactionServlet'
#url = 'http://128.4.26.233:8080/TransactionServlet'
balance = {
    "type" : "balance",
    "info" : {
        "account_number" : "1111111111"
    }
}
withdraw = {
    "type" : "withdraw",
    "info" : {
        "account_number" : "1111111111",
        "amount" : 0.01
    }
}
deposit = {
    "type" : "deposit",
    "info" : {
        "account_number" : "1111111111",
        "amount" : 0.01
    }
}

# Send a number of requests to the URL with a specified payload
def send_request(threadName, numRequests, payload):
    startThread = time.time()
    appServerTimes = []
    totalAppServerTime = 0
    for i in range(0, numRequests):
        startRequest = time.time()
        r = requests.post(url, json.dumps(payload))
        endRequest = time.time()
        elapsedRequestTime = endRequest - startRequest

        appServerTime = r.json()['elapsed_time'] #elapsed_time field in response is in ms
        appServerTimes.append(appServerTime)
        totalAppServerTime += appServerTime

        #print "%s: POST request %d processed in %s ms" % (threadName, i, elapsedRequestTime)

    endThread = time.time()
    elapsedThreadTime = endThread - startThread
    averageRequestTime = (elapsedThreadTime/numRequests)

    averageAppServerTime = (totalAppServerTime/numRequests)

    #print "%s: processed %d requests at %f requests/second" % (threadName, numRequests, averageRequestTime)
    return (elapsedThreadTime, averageAppServerTime)


# Class that allows the Thread.join() method to return the function's value
class ThreadWithReturnValue(Thread):
    def __init__(self, group=None, target=None, name=None,
                 args=(), kwargs={}, Verbose=None):
        Thread.__init__(self, group, target, name, args, kwargs, Verbose)
        self._return = None

    def run(self):
        if self._Thread__target is not None:
            self._return = self._Thread__target(*self._Thread__args,
                                                **self._Thread__kwargs)
    def join(self):
        Thread.join(self)
        return self._return


# Main method
def main():
    startMain = time.time()

    numThreads = 25     # Number of threads to start
    numRequests = 20    # Number of requests per thread

    # Dispatch threads
    options = [balance, deposit, withdraw] #payload options
    threads = []
    for i in range(0, numThreads):
        payload = options[i%len(options)]
        t = ThreadWithReturnValue(target=send_request, args=("Thread-"+`i+1`, numRequests, payload, ))
        t.start()
        threads.append(t)

    # Wait for threads to finish and process metrics
    threadTimes = []
    totalAppServerTime = 0
    for t in threads:
        elapsedThreadTime = t.join()
        threadTimes.append(elapsedThreadTime)
        totalAppServerTime += elapsedThreadTime[1]


    endMain = time.time()
    elapsedMainTime = endMain - startMain
    averageAppServerTime = (totalAppServerTime/1000) / numThreads # App server times are in ms
    print "Sent %d requests in %f seconds" % ((numThreads * numRequests), elapsedMainTime)
    print "Processed transactions at %f transactions per second" % ((numThreads * numRequests)/elapsedMainTime)
    print "API processed transactions at %f transactions per second" % (1/averageAppServerTime)


if __name__=='__main__':
    main()
