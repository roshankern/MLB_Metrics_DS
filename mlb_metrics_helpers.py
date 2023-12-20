from typing import Literal
import datetime

import pybaseball as pb
import statsapi
import pandas as pd


from sklearn.model_selection import train_test_split


def player_id(last_name: str, first_name: str, player_num: int = 0) -> int:
    """
    Finds the player ID based on the player's last name and first name.
    Uses pybaseball's playerid_lookup function.

    Args:
        last_name (str): The last name of the player.
        first_name (str): The first name of the player.
        player_num (int, optional): The player number to specify which player to look at if there are multiple players with the same name. Defaults to 0.

    Returns:
        int: The player ID.

    Raises:
        ValueError: If the player ID lookup is empty.
    """

    try:
        return pb.playerid_lookup(last_name, first_name)["key_mlbam"][player_num]
    except KeyError:
        raise ValueError(
            "Player ID lookup failed. No player found with the given name."
        )


def player_general_metrics(
    player_id: int, timeline_type: Literal["career", "season"] = "career"
) -> dict:
    """
    Retrieves the general metrics for a player based on their ID.
    Uses MLB-StatsAPI's player_stat_data function.

    Args:
        player_id (int): The ID of the player.
        timeline_type (str): The type of metrics to retrieve. Should be either "career" or "season". Defaults to "career".

    Returns:
        dict: A dictionary containing the general metrics of the player.
    """

    return statsapi.player_stat_data(player_id, type=timeline_type)


def player_specific_metrics(
    player_id: int,
    metric_type: Literal["pitching", "batting"],
    start_dt: str,
    end_dt: str,
) -> pd.DataFrame:
    """
    Retrieves the specific metrics for a player based on their ID, metric type, and date range.
    Only works for pitcher and batter metrics.
    Uses pybaseball's statcast_pitcher and statcast_batter functions.

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


def parse_career_timeline(player_metrics: dict) -> tuple[str, str]:
    """
    Parses the career timeline of a player and returns a tuple with the start and end dates in the format "YYYY-MM-DD".
    If player is still active, the end date will be the current date.


    Args:
        player_metrics (dict): A dictionary containing the player's metrics from MLB-StatsAPI.

    Returns:
        tuple[str, str]: A tuple with the start and end dates of the player's career.
    """

    start_dt = player_metrics["mlb_debut"]
    end_dt = player_metrics["last_played"] or datetime.date.today().strftime("%Y-%m-%d")

    return (start_dt, end_dt)


def batter_model_metrics(player_specific_metrics: pd.DataFrame) -> pd.DataFrame:
    """
    Processes player-specific metrics for model training.

    Parameters:
        player_specific_metrics (pd.DataFrame): DataFrame containing player-specific metrics.

    Returns:
        pd.DataFrame: DataFrame prepared for batter model training (predict result of swing).
    """
    # columns to use as features and classes
    col_to_keep = [
        "pitch_type",
        "release_speed",
        "release_pos_x",
        "release_pos_y",
        "release_spin_rate",
        "spin_axis",
        "p_throws",
        "plate_x",
        "plate_z",
        "vx0",
        "vy0",
        "vz0",
        "ax",
        "ay",
        "az",
        "description",
    ]

    # Select only the relevant columns
    model_data = player_specific_metrics[col_to_keep]
    model_data = model_data[
        (model_data["description"] == "hit_into_play")
        | (model_data["description"] == "swinging_strike")
    ]

    # Drop rows with missing values
    model_data.dropna(inplace=True)

    return model_data


def batter_model_datasets(
    model_data: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Splits the model data into training and testing datasets.

    Parameters:
        model_data (pd.DataFrame): DataFrame containing model data.

    Returns:
        tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]: A tuple containing the training and testing datasets.
            - X_train (pd.DataFrame): Training feature dataset.
            - X_test (pd.DataFrame): Testing feature dataset.
            - y_train (pd.Series): Training class dataset.
            - y_test (pd.Series): Testing class dataset.
    """
    # metric we want to predict (swing result)
    target = "description"

    # Split into feature and class datasets
    X = model_data.drop(columns=[target])
    y = model_data[target]

    # Split into training and testing datasets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, random_state=0, test_size=0.1, stratify=target
    )

    return (X_train, X_test, y_train, y_test)
