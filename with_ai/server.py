import os
import logging
from secrets import token_urlsafe

from flask import Flask, abort, jsonify, request
from flask_cors import CORS

from .ai import get_next_word, get_target_words


logging.basicConfig(
    level=int(os.environ.get("WAI_LOGLEVEL", logging.INFO)),
    format="%(asctime)s  %(levelname)s  %(message)s",
)


app = Flask('Collab with AI')
CORS(app)
""", origins=[
    'https://local_minimum.itch.io/contribute-human',
    'https://hum.localminimum.se',
    'http://localhost:8099',
])"""
app.config['SECRET_KEY'] = token_urlsafe(16)


def defined_or(value, fallback):
    return fallback if value is None else value


@app.post('/api/create')
def create_game():
    prompt = request.get_json()
    if prompt is None:
        abort(400, 'Request must be json')

    logging.info(f'Making game from {prompt}')
    per_player = 4
    words = get_target_words(prompt, n=(2 * per_player))

    human = words[:per_player]
    ai = words[per_player:]
    return jsonify({'human': human, 'ai': ai})


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
    guess_word_lengths = defined_or(json.get('guessWordLengths'), [])
    secrets = defined_or(json.get('aiSecrets'), [])

    return jsonify({
        'guess': get_next_word(prompt, lead, target, guess_word_lengths, secrets),
    })
