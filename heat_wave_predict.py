import sys
import numpy as np
import pandas as pd
import xgboost as xgb

def predict(data):
    clf = xgb.XGBClassifier()
    booster = xgb.Booster()
    booster.load_model('predictor.xgb')
    clf._Booster = booster

    pred = clf.predict(data)
    print(pred)

def feature_eliminate(data):
    unrequired=pd.read_csv('unrequired.csv')
    unrequired=unrequired.shape[0]

    req_data=np.delete(data,unrequired,1)
    return req_data

if __name__=='__main__':
    data=pd.read_csv('cur_data.csv')
    data=data.values

    req_data=feature_eliminate(data)

    predict(req_data)
