import logging
import azure.functions as func
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    # Handle login logic (same as your Flask logic)
    return jsonify({"message": "Login successful!"})

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Main entry point for Azure Functions"""
    return func.HttpResponse(
        app(req),
        status_code=200
    )
