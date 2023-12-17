from typing import Literal

import pybaseball as pb
import statsapi
import pandas as pd


def find_player_id(last_name: str, first_name: str, player_num: int = 0) -> int:
    """
    Finds the player ID based on the player's last name and first name.

    Args:
        last_name (str): The last name of the player.
        first_name (str): The first name of the player.
        player_num (int, optional): The player number to specify which player to look at if there are multiple players with the same name. Defaults to 0.

    Returns:
        int: The player ID.
    """

    return pb.playerid_lookup(last_name, first_name)["key_mlbam"][player_num]


def get_general_metrics(
    player_id: int, timeline_type: Literal["career", "season"]
) -> dict:
    """
    Retrieves the general metrics for a player based on their ID.

    Args:
        player_id (int): The ID of the player.
        timeline_type (str): The type of metrics to retrieve. Should be either "career" or "season".

    Returns:
        dict: A dictionary containing the general metrics of the player.
    """

    return statsapi.player_stats(player_id, type=timeline_type)


def get_specific_metrics(
    player_id: int,
    metric_type: Literal["pitching", "batting"],
    start_dt: str,
    end_dt: str,
) -> pd.DataFrame:
    """
    Retrieves the specific metrics for a player based on their ID.

    Args:
        player_id (int): The ID of the player.
        metric_type (Literal["pitching", "batting"]): The type of metric to retrieve (either "pitching" or "batting").
        start_dt (str): The start date for the metrics retrieval in the format "YYYY-MM-DD".
        end_dt (str): The end date for the metrics retrieval in the format "YYYY-MM-DD".

    Returns:
        pd.DataFrame: A DataFrame containing the specific metrics of the player.
    """

    if metric_type == "pitching":
        return pb.statcast_pitcher(
            start_dt=start_dt, end_dt=end_dt, player_id=player_id
        )
    elif metric_type == "batting":
        return pb.statcast_batter(start_dt=start_dt, end_dt=end_dt, player_id=player_id)
    else:
        raise ValueError("Invalid metric_type. Must be either 'pitching' or 'batting'.")
