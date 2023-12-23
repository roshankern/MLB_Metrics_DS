from flask import Flask, jsonify, request
import pandas as pd
import mlb_metrics_helpers

app = Flask(__name__)


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


@app.route("/api/v1/player-career-timeline", methods=["GET"])
def get_player_career_timeline():
    player_id = request.args.get("player_id")

    if not player_id:
        return jsonify({"error": "Missing player ID"}), 400

    try:
        player_id = int(player_id)  # Convert to integer
        player_metrics = mlb_metrics_helpers.player_general_metrics(player_id)
        career_timeline = mlb_metrics_helpers.parse_career_timeline(player_metrics)

        return (
            jsonify(
                {"mlb_debut": career_timeline[0], "last_played": career_timeline[1]}
            ),
            200,
        )

    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@app.route("/api/v1/pitcher-model-data", methods=["POST"])
def pitcher_model_data():
    try:
        # Retrieve JSON data from the request
        json_data = request.json

        # Convert JSON to DataFrame
        player_specific_metrics = pd.DataFrame(json_data)

        # Process the data using the pitcher_model_data function
        processed_data = mlb_metrics_helpers.pitcher_model_data(player_specific_metrics)

        # Convert processed data back to JSON
        processed_json = processed_data.to_json(orient="records", date_format="iso")

        return processed_json, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)  # Turn on debug mode for development
