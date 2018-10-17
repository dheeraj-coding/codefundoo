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
    for i in range(30-day):
        temp+=data['prior'][i]['max_temp']
    for i in range(day):
        temp+=data['forecast'][i]['max_temp']
    temp/=30
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


def heat_wave(args):
    #pred = np.array(eval(sys.argv[1]))
    prev_data=pd.read_csv('weather.csv')
    prev_data=data.apply(lambda x: x.sort_values().values)
    with open('data.json') as data_file:
        data=json.load(data_file)

    EHI_accl1=EHI_accl(data,0)
    EHI_accl2=EHI_accl(data,1)
    EHI_accl3=EHI_accl(data,2)

    EHI_sig1=EHI_sig(prev_data,data,0)
    EHI_sig2=EHI_sig(prev_data,data,1)
    EHI_sig3=EHI_sig(prev_data,data,2)

    EHF1=np.max(1,EHI_accl1)*EHI_sig1
    EHF2=np.max(1,EHI_accl2)*EHI_sig2
    EHF3=np.max(1,EHI_accl3)*EHI_sig3
    if(EHF1>0 and EHF2 >0 and EHF3 >0):
        EHF_avg=(EHF1+EHF2+EHF3)/3
        json_data=json.dumps({})
        json_data['HEAT_WAVE_STATUS']=True
        json_data['EHF']=EHF_avg
        print(json_data)
    else:
        json_data=json.dumps({})
        json_data['HEAT_WAVE_STATUS']=False
        json_data['EHF']=0
        print(json_data)


if __name__=='__main__':
    heat_wave(sys.argv)
