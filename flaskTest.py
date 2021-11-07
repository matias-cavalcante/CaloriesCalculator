from flask import Flask, jsonify, make_response
from flask import request
from flask_cors import CORS
import contextvars
import csv


app = Flask(__name__)
CORS(app)


def getMyCSV(filePath):
    with open(filePath, newline='') as f:
        reader = csv.reader(f)
        data = list(reader)
        return data


def deleteTxtFileCont(fileName):
    file = open(fileName, "r+")
    file.truncate(0)
    file.close()


def bidimArrayToJSON(array):
    id = 0
    json = []
    for line in array:
        element = {}
        element["id"] = str(id)
        element["name"] = line[0]
        element["portion"] = line[1]
        element["calories"] = line[2]
        json.append(element)
        id = id + 1
    return json


@ app.route('/connectWithBack', methods=['POST', 'GET'])
def get_post_javascript_data():
    file = "GENERIC VALUE"
    #filePath = 'C:/Users/35476/Desktop/caloriesFiles/variable.txt'
    filePath = 'caloriesFiles/variable.txt'
    #fileGetPath = 'C:/Users/35476/Desktop/caloriesFiles/'
    fileGetPath = 'caloriesFiles/'
    if request.method == 'POST':
        openFile = request.get_json(force=True)
        openFile = openFile['name']
        with open(filePath, 'w') as f:
            f.write(openFile)
            f.close()
    elif request.method == 'GET':
        with open(filePath) as f:
            contents = f.read()
            f.close()
        fileNAME = fileGetPath + str(contents) + '.csv'
        print("File name ", fileNAME)
        file = bidimArrayToJSON(getMyCSV(fileNAME))
        file = str(file).replace('[', '{')
        file = file.replace(']', '}')
        deleteTxtFileCont(filePath)
        return file
    return file


if __name__ == '__main__':
    #app.run(debug=True, port=4000)
    app.run(debug=True, port=80)
