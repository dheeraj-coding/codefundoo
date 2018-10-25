import requests
import json


def detect(url, subscription_key, request_data):
    headers = {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': subscription_key}
    response = requests.post(url, data=json.dumps(request_data), headers=headers)
    if response.status_code == 200:
        return json.loads(response.content.decode("utf-8"))
    else:
        print(response.status_code)
        raise Exception(response.text)

with open('test.json') as data_file:
    data=json.load(data_file)
sample_data = data
endpont = "https://api.labs.cognitive.microsoft.com/anomalyfinder/v1.0/anomalydetection"
subscription_key = ""

result = detect(endpont, subscription_key, sample_data)
val={}
val['IsAnomaly']=result['IsAnomaly']
val['Status']='success'
json_data=json.dumps(val)
print(json_data)
