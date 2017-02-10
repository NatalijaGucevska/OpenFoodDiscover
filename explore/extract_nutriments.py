import os
import csv
import json
import requests
import matplotlib.pyplot as plt
import numpy as np

ACCESS_TOKEN = os.getenv('OPEN_DATA_TOKEN')
URL = 'https://www.openfood.ch/api/v2/products/_search'
NUTRIENTS = {'Salt': 0, 'Protein': 0, 'Sugars': 0, 'Carbohydrates': 0, 'Saturated fat': 0, 'Fat': 0, 'Fiber': 0, 'Sodium':0, 'Iodine':0}


with open('receipts-details.csv', 'rt') as csvfile:
    reader = csv.reader(csvfile, delimiter=';', quotechar='|')
    for row in reader:
        json_data = {'_source': True, 'query': {'match': {'name_translations.fr': row[5]}}}
        headers = {'Authorization': 'Token token=' + ACCESS_TOKEN}

        ## Request
        response = requests.post(URL, data=json.dumps(json_data), headers=headers)
        data = json.loads(response.text)['hits']['hits']
        if len(data) > 0:
            for n in (data[0])['_source']['nutrients']:
                if n['name_en'] != 'Energy (kCal)' and n['name_en']!= 'Energy':
                    NUTRIENTS[n['name_en']] += float(n['per_hundred'])

X = np.arange(len(NUTRIENTS.keys()))

plt.bar(X, NUTRIENTS.values(),  align='center', width=0.5)
plt.xticks(X, NUTRIENTS.keys())
ymax = max(NUTRIENTS.values()) + 1
plt.ylim(0, ymax)
plt.show()
print(NUTRIENTS)


