import sys
import json
import csv
import pandas as pd
import re
import demoji
import emoji
from datetime import datetime
from sentistrength import PySentiStr
from langdetect import detect

#prendo in input la caption. Deve essere stringa. Es: python3 txt_features.py "ciao come stai?" 
caption = sys.argv[1]
senti = PySentiStr()

#impostare i 3 percorsi corretti, trovate i tre file nella cartella SentiStrength - 1) SentiStrength.jar - 2) SentStrength_Data_EN - 3) SentStrength_Data_IT2
senti.setSentiStrengthPath('./SentiStrength/SentiStrength.jar')
eng_path = './SentiStrength/SentStrength_Data_EN'
ita_path = './SentiStrength/SentStrength_Data_IT2'

def deEmojify(inputString):
    return inputString.encode('ascii', 'ignore').decode('ascii')

#number of hashtag
def hashtag_count(string):
    count = len( [string for words in string.split() if words.startswith('#')] )
    return count

#number of users tagged
def tagged_count(string):
    count = len( [string for words in string.split() if words.startswith('@')] )
    return count

#number of words
def words_count(string):
    string = deEmojify(string)
    count = len( [string for words in string.split() if not words.startswith('@') and not words.startswith('#')] )
    return count

#Calcolo del sentiment score
def get_sentiment(string):
	string = emoji.demojize(string)
	string = " ".join(filter(lambda x:x[0]!='#', string.split()))
	string = " ".join(filter(lambda x:x[0]!='@', string.split())) 

	try:
		language = detect(string)
		if language == 'en':
			senti.setSentiStrengthLanguageFolderPath(eng_path)
		else:
			senti.setSentiStrengthLanguageFolderPath(ita_path)
            
		sentiment_score = senti.getSentiment(string)
	except:
		sentiment_score = [0]
	return sentiment_score

#emojis lists
happiness_list = ["😀","😃","😄","😁","😆","🤣","😂","🙂","🙃","😉","😊","🤩","☺","🥳","😎","✌"]      
love_list = ["🥰","😍","😘","😗","😚","😙","😻","😽","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣","❤","🖤","💜","🤰","💏","👩‍❤️‍💋‍👨","👨‍❤️‍💋‍👨","👩‍❤️‍💋‍👩","💑"]  
sadness_list = ["😔","😪","🤕","🤢","🤮","😕","😟","🙁","☹","🥺","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😩","😫"] 
travel_list = ["✈","🧳","🗺","🏔","🏕","🏖","🏝","🏞","🚄","🚌","🧑‍✈️","🌍","🌎","🌏","🧭","⛰", "🗻","🏜", "🏛","🚃","🚅","🚆","🚇","🚗","🚘","🚙","🛫","🛳"]  
food_list = ["😋","🤤","🍖","🥩","🍔","🍟","🌭","🍱","🍽","🍒","🍓","🍞","🥐","🥞","🍗","🥪","🌮","🍳","🍲","🍿","🍙","🍜","🍝","🍩","🍴"]  
pet_list = ["🐶","🐱","🐹","🐢","🐟","😻","😹","🐕","🐈","🦮","🐩","🐈‍⬛","🐭","🐁","🐀","🐾","🐦","🦜"]    
angry_list = ["😤","😡","🤬","👿","😠"]  
music_list = ["🎧","🎼","🎷","🎸","🎹","🎻","🥁","🎙","🎤","🎵","🎶","📻","🎺","🪕","🧑‍🎤","👩‍🎤","👨‍🎤"]
party_list = ["🥳","🎉","🎊","🍻","🍺","🥂","🍾","🍸","💃","🕺","🍷","🍹","🥤"]
sport_list = ["⚽","⚾","🏀","🏐","🎾","🏆","🥇","🏅","🏃","🏃‍♀️","🏇","⛷","🏂","🏊","🏊‍♀️","⛹","⛹️‍♀️","🏋️‍♂️","🏋️‍♀️","🚵","🛹","🏈"]   

#classificazione delle emoji all'interno della caption
def emoji_list(x):
 
    happiness = 0.0
    love = 0.0
    sadness = 0.0
    travel = 0.0
    food = 0.0
    pet = 0.0
    angry = 0.0
    music = 0.0
    party = 0.0
    sport = 0.0
 
    if any(el in x for el in happiness_list):
        happiness = 1.0
    if any(el in x for el in love_list):
        love = 1.0
    if any(el in x for el in sadness_list):
        sadness = 1.0
    if any(el in x for el in travel_list):
        travel = 1.0
    if any(el in x for el in food_list):
        food = 1.0
    if any(el in x for el in pet_list):
        pet = 1.0
    if any(el in x for el in angry_list):
        angry = 1.0
    if any(el in x for el in music_list):
        music = 1.0
    if any(el in x for el in party_list):
        party = 1.0
    if any(el in x for el in sport_list):
        sport = 1.0

    return pd.Series((happiness, love, sadness, travel, food, pet, angry, music, party, sport))

#estrazione di alcuni campi necessari per la predizione
n_words = words_count(caption)
n_hashtag = hashtag_count(caption)
n_tagged = tagged_count(caption)
sent_score = get_sentiment(caption)
emojis = emoji_list(caption)
hashtag_list = re.findall(r"#(\w+)", caption)

#output dei campi
result = {"hashtags_count": n_hashtag,
          "sentiment_score": sent_score,
          "happiness": emojis[0],
          "love" : emojis[1],
          "sadness": emojis[2],
          "travel":emojis[3],
          "food":emojis[4],
          "pet":emojis[5],
          "angry":emojis[6],
          "music":emojis[7],
          "party":emojis[8],
          "sport":emojis[9],
          "hashtag_list": hashtag_list,
          "n_words": n_words
          }
json_dump = json.dumps(result)
print(json_dump)
#json_object = json.loads(json_dump)
#print(json_object["hashtags_count"])
#result = {"hashtags_count":n_hashtag, "sentiment_score":sent_score, "happiness":emojis[0], "love":emojis[1], "sadness" : emojis[2], "travel":emojis[3], "food":emojis[4], "pet":emojis[5], "angry":emojis[6], "music":emojis[7], "party":emojis[8], "sport":emojis[9], "hashtag_list": hashtag_list}
#print(result)




 
