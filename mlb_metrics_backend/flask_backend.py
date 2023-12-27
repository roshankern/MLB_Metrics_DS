import uuid
import warnings

warnings.filterwarnings("ignore")

import mlb_metrics_helpers

import pandas as pd

from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)

trained_models = {}


@app.route("/api/v1/player-id", methods=["GET"])
def get_player_id():
    last_name = request.args.get("last_name")
    first_name = request.args.get("first_name")
    player_num = request.args.get("player_num", default=0, type=int)  # Set default to 0

    if not last_name or not first_name:
        return jsonify({"error": "Missing last name or first name"}), 400

    try:
        player_id = mlb_metrics_helpers.player_id(last_name, first_name, player_num)
        return jsonify({"player_id": int(player_id)}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@app.route("/api/v1/player-general-metrics", methods=["GET"])
def get_player_general_metrics():
    player_id = request.args.get("player_id")

    if not player_id:
        return jsonify({"error": "Missing player ID"}), 400

    try:
        player_id = int(player_id)  # Convert to integer
        general_stats = mlb_metrics_helpers.player_general_metrics(player_id)
        return jsonify(general_stats), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@app.route("/api/v1/player-career-timeline", methods=["POST"])
def get_player_career_timeline():
    player_general_metrics = request.get_json()

    if not player_general_metrics:
        print("No data provided")
        return jsonify({"error": "No data provided"}), 400

    try:
        # Here, ensure that 'general_metrics' is in the correct format expected by parse_career_timeline
        start_dt, end_dt = mlb_metrics_helpers.parse_career_timeline(
            player_general_metrics
        )

        return (
            jsonify({"start_dt": start_dt, "end_dt": end_dt}),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/player-specific-metrics", methods=["GET"])
def get_player_specific_metrics():
    player_id = request.args.get("player_id")
    metric_type = request.args.get("metric_type")
    start_dt = request.args.get("start_dt")
    end_dt = request.args.get("end_dt")

    # Check for required parameters
    if not all([player_id, metric_type, start_dt, end_dt]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        player_id = int(player_id)  # Convert to integer
        metrics_df = mlb_metrics_helpers.player_specific_metrics(
            player_id, metric_type, start_dt, end_dt
        )

        # Convert DataFrame to JSON
        metrics_json = metrics_df.to_json(orient="records", date_format="iso")
        return metrics_json, 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@app.route("/api/v1/plate-crossing-metrics", methods=["POST"])
def plate_crossing_metrics():
    try:
        data = request.get_json()
        player_metrics = data["player_metrics"]
        metric_type = data["metric_type"]

        if metric_type not in ["pitching", "batting"]:
            return jsonify({"error": "Invalid or missing metric type"}), 400

        # Convert JSON data to DataFrame
        player_specific_metrics = pd.DataFrame(player_metrics)

        # Apply plate_crossing_metrics function
        plate_metrics = mlb_metrics_helpers.plate_crossing_metrics(
            player_specific_metrics, metric_type
        )

        # Convert DataFrame to JSON
        plate_metrics_json = plate_metrics.to_json(orient="records", date_format="iso")
        return plate_metrics_json, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/v1/model-data", methods=["POST"])
def model_data():
    try:
        # Retrieve JSON data from the request
        data = request.get_json()
        player_metrics = data["player_metrics"]
        metric_type = data["metric_type"]

        # Convert JSON data to DataFrame
        player_specific_metrics = pd.DataFrame(player_metrics)

        # Process the data using the relevant model_data function
        if metric_type == "pitching":
            processed_data = mlb_metrics_helpers.pitcher_model_data(
                player_specific_metrics
            )
        else:
            processed_data = mlb_metrics_helpers.batter_model_data(
                player_specific_metrics
            )

        # Convert processed data back to JSON
        processed_json = processed_data.to_json(orient="records", date_format="iso")

        return processed_json, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/v1/tested-model", methods=["POST"])
def tested_model():
    data = request.get_json()
    model_data = pd.DataFrame(data["model_data"])
    target = data["target"]
    model_type = data["model_type"]

    # Training the model
    trained_model, accuracy = mlb_metrics_helpers.tested_model(
        model_data, target, model_type
    )

    # Generating a UUID for the model
    model_uuid = str(uuid.uuid4())
    trained_models[model_uuid] = trained_model

    return jsonify({"model_uuid": model_uuid, "accuracy": accuracy}), 200


# Endpoint for making predictions
@app.route("/api/v1/predict", methods=["POST"])
def predict():
    data = request.get_json()
    model_uuid = data["model_uuid"]
    feature_data = data["feature_data"]

    # Convert JSON data to DataFrame
    feature_data = pd.DataFrame(feature_data)

    if model_uuid in trained_models:
        model = trained_models[model_uuid]
        prediction, prediction_probas = mlb_metrics_helpers.model_prediction(
            model, feature_data
        )
        return (
            jsonify({"prediction": prediction, "prediction_probas": prediction_probas}),
            200,
        )
    else:
        return jsonify({"error": "Model not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)  # Turn on debug mode for development
