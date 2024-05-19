from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS
from easyleaguemodel import Summoner, DateTimeEncoder
import json
import os
import requests
import sys
import time

def get_region_summoner(region):
    '''Encode la région en fonction du paramètre reçu'''
    if region == 'euw':
        return 'euw1'
    elif region == 'eun':
        return 'eun1'
    elif region == 'br':
        return 'br1'
    elif region == 'lan':
        return 'la1'
    elif region == 'las':
        return 'la2'
    elif region == 'oce':
        return 'oc1'
    elif region == 'ru':
        return 'ru'
    elif region == 'tr':
        return 'tr1'
    elif region == 'ph':
        return 'ph2'
    elif region == 'sg':
        return 'sg2'
    elif region == 'tw':
        return 'tw2'
    elif region == 'th':
        return 'th2'
    elif region == 'vn':
        return 'vn2'
    elif region == 'jp':
        return 'jp1'
    elif region == 'kr':
        return 'kr'
    elif region == 'na':
        return 'na1'
    
def get_region_matches(region):
    '''Encode la région en fonction du paramètre reçu'''
    if region in 'euw|eun|ru|tr':
        return 'europe'
    elif region in 'br|lan|las|na':
        return 'americas'
    elif region in 'oce|ph|sg|tw|th|vn':
        return 'sea'
    elif region in 'jp|kr':
        return 'asia'

def create_header():
    '''Construit le header de la requête http en fournissant le token RIOT d'authentification'''
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

def get_summoner_ranks(region, id):
    region_api = get_region_summoner(region)
    url_rank = f'https://{region_api}.api.riotgames.com/lol/league/v4/entries/by-summoner/{id}'
    headers = create_header()

    rank_json = requests.get(url_rank, headers=headers).json()

    return rank_json

def get_matches(region, puuid):
    '''Récupère les ids des 20 dernières parties du joueur via le pseudo'''
    region_matches = get_region_matches(region)
    url = f'https://{region_matches}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20'
    headers = create_header()

    matches = requests.get(url, headers=headers).json()

    return matches

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
    summoner_puuid = summoner_json['puuid']

    ranks = get_summoner_ranks(region, summoner_id)

    for rank in ranks:
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

    matches = get_matches(region, summoner_puuid)

    summoner = Summoner.Summoner(
        username,
        summoner_json['profileIconId'],
        summoner_json['summonerLevel'],
        revision_date,
        region,
        ranks
    )

    return json.dumps(summoner.__dict__, indent=4, cls=DateTimeEncoder.DateTimeEncoder)

@app.route('/summoner/<username>/all', methods=['GET', 'POST'])
def get_summoner_data_all_region(username):
    ''''''
    global regions

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


########################################################
# Défintion des NOUVELLES routes de l'application
########################################################

def get_summoner_by_puuid(region, puuid):
    '''Récupère les informations d'un summoner via le puuid'''
    region_summoner = get_region_summoner(region)
    url = f'https://{region_summoner}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}'
    headers = create_header()

    try:
        summoner_request = requests.get(url, headers=headers)
        summoner_request.raise_for_status()
        summoner_data = summoner_request.json()

        summoner = {
            'id': summoner_data['id'],
            'profileIconId': summoner_data['profileIconId'],
            'revisionDate': round(summoner_data['revisionDate'] / 1000),
            'summonerLevel': summoner_data['summonerLevel'],
            'region': region
        }
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Error when requesting Riot API'}), 500

    return summoner

def get_account_puuid(region, gamename, tagline):
    url = f'https://{region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gamename}/{tagline}'
    headers = create_header()

    try:
        account_request = requests.get(url, headers=headers)
        account_request.raise_for_status()
        account = account_request.json()

        return account
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Error when requesting Riot API'}), 500

@app.route('/v2/<account_region>/account/<gamename>/<tagline>', methods=['GET', 'POST'])
def get_account(account_region, gamename, tagline):
    '''Récupère le PUUID d'un utilisateur selon sa région, son gameName et son tagLine'''
    global regions

    result = {
        'summoner': None,
        'duration': 0 
    }

    ranks = []
    matches = []
    summoner_data = None
    summoner_id = None
    correct_region = None
    revision_date = None

    started = time.perf_counter()

    try:
        account = get_account_puuid(account_region, gamename, tagline)
        puuid = account['puuid']

        # EXEMPLE FOR DOCUMENTATION ! 
        # for region in regions:
        #     summoner_result = get_summoner_by_puuid(region, puuid)

        #     if summoner_result != None:
        #         summoner_data = summoner_result
        #         summoner_id = summoner_data['id']
        #         correct_region = summoner_data['region']
        #         revision_date = datetime.fromtimestamp(summoner_data['revisionDate'])

        # MULTITHREADED VERSION 
        with ThreadPoolExecutor(max_workers=16) as pool:
            requests = {pool.submit(get_summoner_by_puuid, region, puuid): region for region in regions}
            for request in as_completed(requests):
                summoner_result = request.result()

                if summoner_result is not None:
                    summoner_data = summoner_result
                    summoner_id = summoner_data['id']
                    correct_region = summoner_data['region']
                    revision_date = datetime.fromtimestamp(summoner_data['revisionDate'])
                    break

        if summoner_data is None:
            raise Exception("Summoner non trouvé")

        ranks_data = get_summoner_ranks(correct_region, summoner_id)
        for rank in ranks_data:
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

        matches = get_matches(correct_region, puuid)

        summoner = Summoner.Summoner(
            account['gameName'],
            account['tagLine'],
            summoner_data['profileIconId'],
            summoner_data['summonerLevel'],
            revision_date,
            correct_region,
            ranks, 
            matches
        )

        result['summoner'] = summoner.__dict__
    except Exception as e:
        return jsonify({'error': 'The user you are looking for does not exist'}), 404

    finished = time.perf_counter()

    result['duration'] = round(finished - started, 2)

    return json.dumps(result, indent=4, cls=DateTimeEncoder.DateTimeEncoder)



############################
# "Fonction" Principale
############################
if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Erreur: Nombres d'arguments incorrect\nUtilisation: python app.py <token api Riot>")
        sys.exit(1)

    riot_token = sys.argv[1]

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

    headers = create_header()
    url = f'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/BetterCallHomie/SEXY'
    resp = requests.get(url, headers=headers)

    if(resp.status_code != 200):
        sys.stderr.write('Response from Riot API not "200 OK" Please check your token')
        sys.exit(1)

    app.run(host='0.0.0.0', port=7000)

    