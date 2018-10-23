import sys
import numpy as np
import pandas as pd
import sklearn
import xgboost as xgb
from sklearn.svm import SVC
from sklearn.model_selection import StratifiedKFold
from sklearn.feature_selection import RFECV
from sklearn.cross_validation import train_test_split
from sklearn.metrics import classification_report

def feature_select(data,y):
    svc = SVC(kernel="linear")
    rfecv = RFECV(estimator=svc, step=1, cv=StratifiedKFold(2),scoring='accuracy')
    print(data.shape,y.shape)
    rfecv.fit(data,y)

    return rfecv.ranking_

def predictor(X,Y,Threshold,unrequired):
    X_train, X_test, y_train, y_test = train_test_split(X, Y)

    model = xgb.XGBClassifier()
    print(X_train,y_train)
    predictor = model.fit(X_train,y_train)

    pred = predictor.predict(X_test)
    x=0
    print(pred,y_test)
    for i in range(pred.shape[0]):
        if pred[i]==y_test[i]:
            x+=1
    acc=x/pred.shape[0]
    #print(pred)
    #acc = classification_report(y_test,pred)
    #print(acc)
    if(acc>=Threshold):
        predictor.save_model('predictor.xgb')
        #arr=np.asarray(unrequired)
        #df=pd.DataFrame(arr)
        #df.to_csv('unrequired.csv')
        print(True)
    else:
        print(False)

if __name__=='__main__':
    data=pd.read_csv('data.csv')
    data=data.values
    y=pd.read_csv('result.csv')
    y=y.values
    y=y[:,1]
    Threshold = 0.7
    data=np.delete(data,[13,15],1)
    norm_data=sklearn.preprocessing.scale(data)
    #feature_ranking=feature_select(norm_data,y)
    unrequired=[]
    #for i in range(feature_ranking.shape[0]):
    #    if(feature_ranking[i]>15):
#            unrequired.append(i)

    filtered_data=np.delete(norm_data,unrequired,1)
    #print(filtered_data.shape,y.shape)
    predictor(filtered_data,y,Threshold,unrequired)
