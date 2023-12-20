from typing import Literal
import datetime

import pybaseball as pb
import statsapi
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import make_column_selector as selector
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier,
    HistGradientBoostingClassifier,
)
from sklearn.pipeline import make_pipeline


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

    # Select only the relevant target columns
    batter_model_data = player_specific_metrics[col_to_keep]
    batter_model_data = batter_model_data[
        (batter_model_data["description"] == "hit_into_play")
        | (batter_model_data["description"] == "swinging_strike")
    ]

    # Drop rows with missing values
    batter_model_data.dropna(inplace=True)

    return batter_model_data


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
        X, y, random_state=0, test_size=0.1, stratify=y
    )

    return (X_train, X_test, y_train, y_test)


def trained_batter_model(
    X_train: pd.DataFrame, y_train: pd.Series, sklearn_model: object
) -> object:
    """
    Trains a batter model using the provided training data.

    Parameters:
        X_train (pd.DataFrame): Training feature dataset.
        y_train (pd.Series): Training class dataset.
        sklearn_model (object): Type of model to be trained.

    Returns:
        object
    """
    # Select numerical and categorical columns
    numerical_columns_selector = selector(dtype_exclude=object)
    categorical_columns_selector = selector(dtype_include=object)

    numerical_columns = numerical_columns_selector(X_train)
    categorical_columns = categorical_columns_selector(X_train)

    # Preprocess categorical and numerical columns
    categorical_preprocessor = OneHotEncoder(handle_unknown="ignore")
    numerical_preprocessor = StandardScaler()

    preprocessor = ColumnTransformer(
        [
            ("one-hot-encoder", categorical_preprocessor, categorical_columns),
            ("standard_scaler", numerical_preprocessor, numerical_columns),
        ]
    )

    # Create and train the model
    model = make_pipeline(preprocessor, sklearn_model)
    model.fit(X_train, y_train)

    return model


def tested_batter_model(
    batter_model_data: pd.DataFrame,
    sklearn_model_type: Literal[
        "logistic_regression",
        "random_forest",
        "gradient_boosting",
        "hist_gradient_boosting",
    ],
) -> tuple[object, float]:
    """
    Trains and evaluates a batter model using the specified sklearn model type.

    Args:
        batter_model_data (pd.DataFrame): The input data for training the model.
        sklearn_model_type (Literal): The type of sklearn model to use. Must be one of:
            - "logistic_regression"
            - "random_forest"
            - "gradient_boosting"
            - "hist_gradient_boosting"

    Returns:
        tuple[object, float]: A tuple containing the trained model object and the accuracy score.
    """
    # Split into training and testing datasets
    X_train, X_test, y_train, y_test = batter_model_datasets(batter_model_data)

    # Train the model
    if sklearn_model_type == "logistic_regression":
        model_type = LogisticRegression(random_state=0)
    elif sklearn_model_type == "random_forest":
        model_type = RandomForestClassifier(random_state=0)
    elif sklearn_model_type == "gradient_boosting":
        model_type = GradientBoostingClassifier(random_state=0)
    elif sklearn_model_type == "hist_gradient_boosting":
        model_type = HistGradientBoostingClassifier(random_state=0)
    else:
        raise ValueError(
            "Invalid sklearn_model_type. Please choose a valid model type."
        )

    model = trained_batter_model(X_train, y_train, model_type)

    # Evaluate the model
    accuracy = model.score(X_test, y_test)

    return (model, accuracy)