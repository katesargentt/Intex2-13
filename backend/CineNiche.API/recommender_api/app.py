# app.py
from flask import Flask, jsonify
from recommender_logic import Recommender
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

recommender = Recommender()

@app.route("/api/recommend/user/<int:user_id>", methods=["GET"])
def recommend_for_user(user_id):
    try:
        recs = recommender.get_user_recommendations(user_id)
        return jsonify(recs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)
