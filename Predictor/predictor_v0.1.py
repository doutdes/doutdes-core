# multiclass classification
import pandas as pd
import xgboost
from xgboost import Booster
import numpy as np
import sys

# required features
input_item = {	"is_video": [float(sys.argv[1])], 
					"num_follower" : [float(sys.argv[2])],
					"hour" : [float(sys.argv[3])],
					"hashtags_count" : [float(sys.argv[4])],
					"sentiment_score" : [float(sys.argv[5])],
					"num_words": [float(sys.argv[6])],
					"week_day": [float(sys.argv[7])],
					"month": [float(sys.argv[8])],
					"season": [float(sys.argv[9])],
					"mean_5": [float(sys.argv[10])],
					"mean_10": [float(sys.argv[11])],
					"mean_15": [float(sys.argv[12])],
					"mean_20": [float(sys.argv[13])],
					"mean_30": [float(sys.argv[14])],
					"mean_50": [float(sys.argv[15])],
					"like_prepost": [float(sys.argv[16])],
					"like_pprepost": [float(sys.argv[17])],
					"like_ppprepost": [float(sys.argv[18])],
					"like_pppprepost": [float(sys.argv[19])],
					"happiness": [float(sys.argv[20])],
					"love": [float(sys.argv[21])],
					"sadness": [float(sys.argv[22])],
					"travel": [float(sys.argv[23])],
					"food": [float(sys.argv[24])],
					"pet": [float(sys.argv[25])],
					"angry": [float(sys.argv[26])],
					"music": [float(sys.argv[27])],
					"party": [float(sys.argv[28])],
					"sport": [float(sys.argv[29])],
					"hashtags_pop_1": [0],
					"hashtags_pop_2": [0],
					"hashtags_pop_3": [0],
					"hashtags_pop_4": [0],
					"hashtags_pop_5": [0],
					"hashtags_pop_6": [0], 
					"hashtags_pop_7": [0], 
					"hashtags_pop_8": [0], 
					"hashtags_pop_9": [0], 
					"hashtags_pop_10": [0],
					"baseline": [float(sys.argv[30])]
					}
					 
df = pd.DataFrame.from_dict(input_item)	
model = Booster()
model.load_model('Predictor/xgb_if_model_2020_v1.json')

output = model.predict(xgboost.DMatrix(df))
print(output)
