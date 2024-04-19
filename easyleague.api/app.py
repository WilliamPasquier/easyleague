from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from flask import Flask
from flask_cors import CORS
from easyleaguemodel import Summoner, DateTimeEncoder
import json
import os
import requests
import sys
import time

def get_region_summoner(region):
    '''Encode la région en fonction du paramètre reçu'''
    if(region == 'euw'):
        return 'euw1'
    elif(region == 'eun'):
        return 'eun1'
    elif(region == 'br'):
        return 'br1'
    elif(region == 'lan'):
        return 'la1'
    elif(region == 'las'):
        return 'la2'
    elif(region == 'oce'):
        return 'oc1'
    elif(region == 'ru'):
        return 'ru'
    elif(region == 'tr'):
        return 'tr1'
    elif(region == 'ph'):
        return 'ph2'
    elif(region == 'sg'):
        return 'sg2'
    elif(region == 'tw'):
        return 'tw2'
    elif(region == 'th'):
        return 'th2'
    elif(region == 'vn'):
        return 'vn2'
    elif(region == 'jp'):
        return 'jp1'
    elif(region == 'kr'):
        return 'kr'
    elif(region == 'na'):
        return 'na1'
    
def get_region_matches(region):
    '''Encode la région en fonction du paramètre reçu'''
    if(region == 'euw'):
        return 'europe'
    elif(region == 'eun'):
        return 'europe'
    elif(region == 'br'):
        return 'americas'
    elif(region == 'lan'):
        return 'americas'
    elif(region == 'las'):
        return 'americas'
    elif(region == 'oce'):
        return 'sea'
    elif(region == 'ru'):
        return 'europe'
    elif(region == 'tr'):
        return 'europe'
    elif(region == 'ph'):
        return 'sea'
    elif(region == 'sg'):
        return 'sea'
    elif(region == 'tw'):
        return 'sea'
    elif(region == 'th'):
        return 'sea'
    elif(region == 'vn'):
        return 'sea'
    elif(region == 'jp'):
        return 'asia'
    elif(region == 'kr'):
        return 'asia'
    elif(region == 'na'):
        return 'americas'

def create_header():
    '''Construit le header de l'app en fournissant le token d'authentification'''
    global riot_token

    return {
        'content-type': 'application/json',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Riot-Token': f'{riot_token}'
    }

def get_queue_name(queue_type):
    if (queue_type == 'RANKED_SOLO_5x5'):
        return 'SoloQ / DuoQ'
    elif (queue_type == 'RANKED_FLEX_SR'):
        return 'Flex 5v5'

def save_json(content, username, id, file_type='timeline'):
    path = os.getcwd() + f'\\json_test\\{file_type}'

    if not os.path.exists(path):
        os.makedirs(path)

    file_path = path + f'\\{file_type}_{username}_{id}.json'

    with open(file_path, 'w') as file:
        json.dump(content, file, indent=4)

def get_summoner_puuid(region, username):
    region_api = get_region_summoner(region)
    url= f'https://{region_api}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{username}'
    headers = create_header()

    r = requests.get(url, headers=headers).json()

    return r['puuid']

def get_matches(region, username):
    '''Récupère les ids des 20 dernières parties du joueur via le pseudo'''
    region_matches = get_region_matches(region)
    puuid = get_summoner_puuid(region, username)

    headers = create_header()

    url = f'https://{region_matches}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20'

    matches = requests.get(url, headers=headers).json()

    return matches

def get_summoner_by_puuid(region, puuid):
    print('test')

app = Flask(__name__)
app.debug = True
CORS(app)

########################################################
# Défintion des routes de l'application
########################################################
@app.route('/<region>/summoner/<username>', methods=['GET', 'POST'])
def get_summoner_data(region, username):
    '''Récupère les informations d'un "Summoner" via le pseudo et la région (europe pour l'instant)'''
    
    ranks = []
    region_api = get_region_summoner(region)
    url = f'https://{region_api}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{username}'
    headers = create_header()

    summoner_result = requests.get(url, headers=headers)

    if summoner_result.status_code == 404:
        return {}
    
    summoner_json = summoner_result.json()
    revision_date = datetime.fromtimestamp(round(summoner_json['revisionDate'] / 1000))

    summoner_id = summoner_json['id']

    url_rank = f'https://{region_api}.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner_id}'

    rank_json = requests.get(url_rank, headers=headers).json()

    for rank in rank_json:
        queue_type = get_queue_name(rank['queueType'])

        r = Summoner.Rank(
            rank['queueType'],
            queue_type,
            rank['tier'],
            rank['rank'],
            rank['leaguePoints'],
            rank['wins'],
            rank['losses']
        )

        ranks.append(r.__dict__)

    matches = get_matches(region, username)

    summoner = Summoner.Summoner(
        username,
        summoner_json['profileIconId'],
        summoner_json['summonerLevel'],
        revision_date,
        region,
        ranks,
        matches
    )

    return json.dumps(summoner.__dict__, indent=4, cls=DateTimeEncoder.DateTimeEncoder)

@app.route('/summoner/<username>/all', methods=['GET', 'POST'])
def get_summoner_data_all_region(username):
    ''''''
    regions = [
        'euw',
        'eun',
        'br',
        'lan',
        'las',
        'oce',
        'ru',
        'tr',
        'ph',
        'sg',
        'tw',
        'th',
        'vn',
        'jp',
        'kr',
        'na',
    ]

    result = {
        'regions': [],
        'duration': 0 
    }

    # EXEMPLE FOR DOCUMENTATION ! 
    # started = time.perf_counter()
    # for region in regions:
    #     summoner_result = get_summoner_data(region, username)
    #     if summoner_result != {}:
    #         result['regions'].append(json.loads(summoner_result))

    # finished = time.perf_counter()
    
    # result['duration'] = round(finished - started, 2)

    # MULTITHREADED VERSION    
    started = time.perf_counter()

    with ThreadPoolExecutor(max_workers=16) as pool:
        api_call = {pool.submit(get_summoner_data, region, username): region for region in regions}
        for call in as_completed(api_call):
            summoner_result = call.result()

            if summoner_result != {}:
                result['regions'].append(json.loads(summoner_result))

    finished = time.perf_counter()

    result['duration'] = round(finished - started, 2)

    return json.dumps(result)

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
    