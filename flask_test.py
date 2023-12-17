from flask import Flask

from pybaseball import playerid_lookup
from pybaseball import statcast_pitcher


app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


def test_pitcher_stats():
    playerid = playerid_lookup("kershaw", "clayton")["key_mlbam"][0]
    kershaw_stats = statcast_pitcher("2017-06-01", "2017-07-01", playerid)
    grouped = kershaw_stats.groupby("pitch_type").release_speed.agg("mean")
    print(kershaw_stats.columns)


if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=105)

    test_pitcher_stats()
