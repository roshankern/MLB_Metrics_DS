# mlb_metrics_backend

Python-based backend API for MLB metrics.

Right now this project includes simple functions for:

- Get baseball player API ID
- Get player career timeline
- Get player general metrics
- Get player specific metrics

The functions are defined in [mlb_metrics_helpers.py](mlb_metrics_helpers.py) and used for the Flask backend in [flask_backend.py](flask_backend.py).
Examples for 

Future additions to this project include:

- Machine learning models for batter stat prediction
- Machine learning models for pitcher stat prediction
- Simple React application using this backend
- Documentation for Flask backend