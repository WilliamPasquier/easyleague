from datetime import datetime
from flask import Flask
from flask_cors import CORS
from easyleaguemodel import Summoner
import json
import os
import requests
import sys

def get_region_summoner(region):
    '''Encode la région en fonction du paramètre reçu'''
    if(region == 'euw'):
        return 'euw1'
    if(region == 'eun'):
        return 'eun1'
    if(region == 'jp'):
        return 'jp1'
    if(region == 'kr'):
        return 'kr'
    if(region == 'na'):
        return 'na1'
    
def get_region_matches(region):
    '''Encode la région en fonction du paramètre reçu'''
    if(region == 'euw'):
        return 'europe'
    if(region == 'eun'):
        return 'europe'
    if(region == 'jp'):
        return 'asia'
    if(region == 'kr'):
        return 'asia'
    if(region == 'na'):
        return 'americas'

def create_header():
    '''Construit le header de l'app en fournissant le token d'authentification'''
    global riot_token

    return {
        'content-type': 'application/json',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Riot-Token': f'{riot_token}'
    }

def save_json(content, username, id, file_type='timeline'):
    path = os.getcwd() + f'\\json_test\\{file_type}'

    if not os.path.exists(path):
        os.makedirs(path)

    file_path = path + f'\\{file_type}_{username}_{id}.json'

    with open(file_path, 'w') as file:
        json.dump(content, file, indent=4)

app = Flask(__name__)
app.debug = True
CORS(app)

########################################################
# Défintion des routes de l'application
########################################################
@app.route('/<region>/summoner/<username>', methods=['GET', 'POST'])
def get_summoner_data(region, username):
    '''Récupère les informations d'un "Summoner" via le pseudo et la région (europe pour l'instant)'''
    region_api = get_region_summoner(region)

    url = f'https://{region_api}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{username}'

    headers = create_header()

    summoner_result = requests.get(url, headers=headers).json()

    summoner = Summoner.Summoner(
        username,
        summoner_result['profileIconId'],
        summoner_result['summonerLevel'],
        summoner_result['revisionDate'],
        region.upper()
    )

    return json.dumps(summoner.__dict__)

@app.route('/<region>/summoner/<username>/matches', methods=['GET', 'POST'])
def get_matches(region, username):
    '''Récupère les ids des 20 dernières parties du joueur via le pseudo'''
    region_matches = get_region_matches(region)
    puuid = get_summoner_data(region, username)['puuid']

    headers = create_header()

    url = f'https://{region_matches}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20'

    matches = requests.get(url, headers=headers).json()

    return matches

@app.route('/<region>/summoner/<username>/match/<id>', methods=['GET', 'POST'])
def get_match_info(region, username, id):
    '''Récupère les informations d'un match grâce à l'id'''
    region_matches = get_region_matches(region)

    headers = create_header()

    url = f'https://{region_matches}.api.riotgames.com/lol/match/v5/matches/{id}'

    match_info = requests.get(url, headers=headers).json()

    save_json(match_info, username, id, file_type='match_info')

    return match_info

@app.route('/<region>/summoner/<username>/match/<id>/timeline', methods=['GET', 'POST'])
def get_match_timeline(region, username, id):
    '''Récupère les informations dans le temps d'un match grâce à l'id'''
    region_matches = get_region_matches(region)

    headers = create_header()

    url = f'https://{region_matches}.api.riotgames.com/lol/match/v5/matches/{id}/timeline'

    timeline = requests.get(url, headers=headers).json()

    save_json(timeline, username, id)

    return timeline

############################
# "Fonction" Principale
############################
if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Erreur: Nombres d'arguments incorrect\nUtilisation: python app.py <token api Riot>")
        sys.exit(1)

    riot_token = sys.argv[1]

    headers = create_header()
    url = f'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/BetterCallHomie'
    resp = requests.get(url, headers=headers)

    if(resp.status_code != 200):
        sys.stderr.write('Response from Riot API not "200 OK" Please check your token')
        sys.exit(1)

    app.run(host='0.0.0.0', port=7000)
    