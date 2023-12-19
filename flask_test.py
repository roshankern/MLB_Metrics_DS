from flask import Flask, jsonify
import mlb_metrics_helpers

app = Flask(__name__)


@app.route("/api/v1/player-id/<last_name>/<first_name>", methods=["GET"])
def get_player_id(last_name, first_name):
    try:
        player_id = mlb_metrics_helpers.player_id(last_name, first_name)
        return jsonify({"player_id": int(player_id)}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


if __name__ == "__main__":
    app.run(debug=True)  # Turn on debug mode for development
