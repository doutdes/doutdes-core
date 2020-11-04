#!/bin/bash

input="Dataset/UserLists/list20.txt"
while IFS= read -r line
do
    echo "$line"
    python3 crawler.py posts_full -u $line -o ./risultati -n 100
    cat 'risultati' | python3 -m json.tool > risultati.json
    python3 crawler.py profile -u $line -o ./risultati_profilo
    cat 'risultati_profilo' | python3 -m json.tool > risultati_profilo.json
    python3 Python_Scripts/modify_json.py
    python3 Python_Scripts/json_to_csv.py
    python3 Python_Scripts/mean_likes.py
    rm -r risultati
    rm -r risultati_profilo
    mkdir Dataset/Users/$line
    mv risultati.csv "$line".csv
    mv "$line".csv Dataset/CSV/
    mv risultati_profilo.json Dataset/Users/$line
    mv risultati.json Dataset/Users/$line
  
done < "$input"


