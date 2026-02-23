from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("./XGBoost_gpu_based.pkl")

# Load your trained model
# with open("model.pkl", "rb") as f:
#     model = pickle.load(f)

@app.route("/guess", methods=["POST"])
def guess():
   data = request.get_json()
   df = pd.DataFrame([data])
   result = model.predict(df)
   return jsonify({"prediction":int(result[0])})


if __name__ == "__main__":
    app.run(debug=True)