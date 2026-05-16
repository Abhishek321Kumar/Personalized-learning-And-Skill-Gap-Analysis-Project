from flask import Flask, jsonify, request
from flask_cors import CORS

from services.analyzer import analyze_profile
from services.text_extractor import extract_text_from_file

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "skillbridge-ml"})


@app.post("/extract-file")
def extract_file():
    payload = request.get_json(force=True)
    file_path = payload.get("filePath")

    if not file_path:
        return jsonify({"message": "filePath is required."}), 400

    try:
        text = extract_text_from_file(file_path)
        return jsonify({"text": text})
    except Exception as error:
        return jsonify({"message": str(error)}), 400


@app.post("/analyze")
def analyze():
    payload = request.get_json(force=True)
    result = analyze_profile(payload)
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8001, debug=False)
