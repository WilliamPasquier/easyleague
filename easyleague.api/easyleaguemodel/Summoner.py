from datetime import date

class Summoner:
    def __init__(
            self, 
            name: str, 
            profile_icon_id: int, 
            summoner_level: int, 
            last_date_connection: int,
            region: str
        ):
        self.name = name
        self.profileIconId = profile_icon_id
        self.summonerLevel = summoner_level
        self.lastDateConnection = last_date_connection
        self.region = region
