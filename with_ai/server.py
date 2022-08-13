import os
import logging
from secrets import token_urlsafe

from flask import Flask, abort, jsonify, request

from .ai import get_next_word, get_target_words


logging.basicConfig(
    level=int(os.environ.get("WAI_LOGLEVEL", logging.INFO)),
    format="%(asctime)s  %(levelname)s  %(message)s",
)


app = Flask('Collab with AI')
app.config['SECRET_KEY'] = token_urlsafe(16)


@app.post('/api/create')
def create_game():
    json = request.get_json()
    if json is None:
        abort(400, 'Request must be json')

    prompt = json.get('prompt')
    if prompt is None:
        abort(400, 'Missing prompt')

    return jsonify(get_target_words(prompt))


@app.post('/api/play')
def play_game():
    json = request.get_json()
    if json is None:
        abort(400, 'Request must be json')

    prompt = json.get('prompt')
    if prompt is None:
        abort(400, 'Missing prompt')

    lead = json.get('lead', False)
    target = json.get('target')

    return jsonify(get_next_word(prompt, lead, target))