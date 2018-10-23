import sys
import numpy as np
import pandas as pd
import json

def EHI_accl(data,day):
    EHI_accl=0
    for i in range(day,day+3):
        EHI_accl+=data['forecast'][i]['max_temp']
    EHI_accl/=3
    temp=0
    for i in range(8-day):
        temp+=data['prior'][i]['max_temp']
    for i in range(day):
        temp+=data['forecast'][i]['max_temp']
    temp/=8
    EHI_accl-=temp
    return EHI_accl

def EHI_sig(T,data,day):
    EHI_sig=0
    for i in range(day,day+3):
        EHI_sig+=data['forecast'][i]['max_temp']
    EHI_sig/=3
    month=data['month']
    prev_data=T.values
    T_95=np.percentile(prev_data[month],95)
    EHI_sig-=T_95
    return EHI_sig


def heat_wave():
    #pred = np.array(eval(sys.argv[1]))
    prev_data=pd.read_csv('weather.csv')
    prev_data=prev_data.apply(lambda x: x.sort_values().values)
    with open('data.json') as data_file:
        data=json.load(data_file)

    EHI_accl1=EHI_accl(data,0)
    EHI_accl2=EHI_accl(data,1)
    EHI_accl3=EHI_accl(data,2)

    EHI_sig1=EHI_sig(prev_data,data,0)
    EHI_sig2=EHI_sig(prev_data,data,1)
    EHI_sig3=EHI_sig(prev_data,data,2)

    EHF1=np.maximum(1.0,EHI_accl1)*EHI_sig1
    EHF2=np.maximum(1.0,EHI_accl2)*EHI_sig2
    EHF3=np.maximum(1.0,EHI_accl3)*EHI_sig3
    if(EHF1>0 and EHF2 >0 and EHF3 >0):
        EHF_avg=(EHF1+EHF2+EHF3)/3
        val={}
        val['HEAT_WAVE_STATUS']='True'
        val['EHF']=str(EHF_avg)
        json_data=json.dumps(val)
        result=np.zeros((8,1))
        result[:,0]=1
        df=pd.DataFrame(result)
        df.to_csv('result.csv')
        print(json_data)
    else:
        val={}
        val['HEAT_WAVE_STATUS']='False'
        val['EHF']='0'
        json_data=json.dumps(val)
        result=np.zeros((8,1))
        result[:,0]=0
        df=pd.DataFrame(result)
        df.to_csv('result.csv')
        print(json_data)


if __name__=='__main__':
    heat_wave()
