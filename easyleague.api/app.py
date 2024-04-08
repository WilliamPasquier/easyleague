from datetime import datetime
from flask import Flask
import requests
import sys

def get_region_summoner(region):
    '''Encode la région en fonction du paramètre reçu'''
    if(region == 'euw'):
        return 'euw1'
    
def get_region_matches(region):
    '''Encode la région en fonction du paramètre reçu'''
    if(region == 'euw'):
        return 'europe'

def create_header():
    '''Construit le header de l'app en fournissant le token d'authentification'''
    global riot_token

    return {
        'content-type': 'application/json',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Riot-Token': f'{riot_token}'
    }

app = Flask(__name__)
app.debug = True

@app.route('/<region>/summoner/<username>', methods=['GET', 'POST'])
def get_summoner_data(region, username):
    '''Récupère les informations d'un "Summoner" via le pseudo et la région (europe pour l'instant)'''
    region = get_region_summoner(region)

    url = f'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{username}'

    headers = create_header()

    summoner = requests.get(url, headers=headers)

    return summoner.json()

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

    return match_info

@app.route('/<region>/summoner/<username>/match/<id>/timeline', methods=['GET', 'POST'])
def get_match_timeline(region, username, id):
    '''Récupère les informations dans le temps d'un match grâce à l'id'''
    region_matches = get_region_matches(region)

    headers = create_header()

    url = f'https://{region_matches}.api.riotgames.com/lol/match/v5/matches/{id}/timeline'

    timeline = requests.get(url, headers=headers).json()

    with open(f'./json_test/timeline_{datetime.now()}.json', 'w') as file:
        file.write(timeline)

    return timeline

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Erreur: Nombres d'arguments incorrect\nUtilisation: python app.py <token api Riot>")
        sys.exit(1)

    riot_token = sys.argv[1]

    app.run(host='0.0.0.0', port=7000)
    