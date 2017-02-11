import os
import csv
import json
import requests
from flask import Flask

app = Flask(__name__)

ACCESS_TOKEN = os.getenv('OPEN_DATA_TOKEN')
URL = 'https://www.openfood.ch/api/v2/products/_search'
FILE = 'receipts-details1.csv'
NUTRIENTS = dict()
DAYS = 14.0

# Daily quantities of recommended nutrients in grams
TARGET_NUTRIENTS = {
    'Protein': 50,
    'Fat': 70,
    'Saturated fat': 24,
    'Carbohydrates': 310,
    'Sugars': 90,
    'Sodium': 2.3,
    'Salt': 2.3,
    'Fiber': 30
}


@app.route("/")
def data():
    with open(FILE, 'rt') as csvfile:
        reader = csv.reader(csvfile, delimiter=';', quotechar='|')
        for row in reader:
            json_data = {'_source': True, 'query': {'match': {'name_translations.fr': row[5]}}}
            headers = {'Authorization': 'Token token=' + ACCESS_TOKEN}

            ## Request
            response = requests.post(URL, data=json.dumps(json_data), headers=headers)
            data = json.loads(response.text)['hits']['hits']
            if len(data) > 0:
                for n in (data[0])['_source']['nutrients']:

                    ## Don't make recommendations based on calories
                    if n['name_en'] != 'Energy (kCal)' and n['name_en'] != 'Energy' and n['per_portion'] is not None:
                        if n['name_en'] not in NUTRIENTS.keys():
                            NUTRIENTS[n['name_en']] = 0
                        NUTRIENTS[n['name_en']] += float(n['per_portion'])


    return json.dumps(NUTRIENTS)


@app.route("/proposition")
def propose():
    for key in TARGET_NUTRIENTS.keys():
        if key in NUTRIENTS.keys():
            v = NUTRIENTS[key]
            if v is not None:
                if v / DAYS < TARGET_NUTRIENTS[key]:
                    json_data = {'_source': True, 'query': {'match': {'nutrients.name_en': key}}}
                    headers = {'Authorization': 'Token token=' + ACCESS_TOKEN}

                    ## Request
                    response = requests.post(URL, data=json.dumps(json_data), headers=headers)
                    data = json.loads(response.text)['hits']['hits']
                    if len(data) > 0:
                        id = 0
                        final = dict()
                        for product in data:
                            if product['_source']['name_fr'] is not None:
                                id += 1
                                final[id] = {
                                    'name': product['_source']['name_fr'],
                                    'image': product['_source']['images'][1]['data']['url']
                                }


                    return json.dumps(final)


if __name__ == "__main__":

    app.run()
