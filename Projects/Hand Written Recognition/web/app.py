from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
# from tensorflow import keras
import numpy as np

app = Flask(__name__)
CORS(app)

model_ml = joblib.load("./XGBoost_gpu_based.pkl")
# model_cnn = keras.models.load_model("mnist_cnn_model.h5")


@app.route("/guess-ml", methods=["POST"])
def guess_ml():
   data = request.get_json()
   df = pd.DataFrame([data])
   result_ml = model_ml.predict(df)
   return jsonify({"prediction_ml":int(result_ml[0])})

# @app.route("/guess-cnn",methods=["POST"])
# def guess_cnn():
#    data = request.get_json()
#    pixels = [data[f'pixel_{i}'] for i in range(784)]
#    img = np.array(pixels, dtype=np.float32)
#    img = img.reshape(1, 28, 28, 1)
#    pred = model_cnn.predict(img)
#    result_cnn = np.argmax(pred)
#    return jsonify({"prediction_cnn":int(result_cnn)})

@app.route("/", methods=["GET"])
def landing():
    return "<h1>Helloworld</h1>"

@app.route("/health",methods=["GET"])
def health():
    return ({"status":"ok"}),200

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True)