from datetime import date

class Rank:
    def __init__(
            self,
            queue_type: str,
            queue_name: str,
            tier: str,
            rank: str,
            league_points: int,
            wins: int,
            losses: int
        ):
        self.queueType = queue_type
        self.queueName = queue_name
        self.tier = tier
        self.rank = rank
        self.leaguePoints = league_points
        self.wins = wins 
        self.losses = losses

class Summoner:
    def __init__(
            self, 
            name: str,
            tag_line: str,
            profile_icon_id: int, 
            summoner_level: int, 
            last_date_connection: date,
            region: str,
            ranks: [Rank], # type: ignore
            matches: [str] # type: ignore
        ):
        self.name = name
        self.tagLine = tag_line
        self.profileIconId = profile_icon_id
        self.summonerLevel = summoner_level
        self.lastDateConnection = last_date_connection
        self.region = region
        self.ranks = ranks
        self.matches = matches
