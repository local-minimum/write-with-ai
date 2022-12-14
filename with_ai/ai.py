from functools import cache
from glob import glob
import logging
import os
from random import sample
from typing import Optional

from gensim.models.keyedvectors import KeyedVectors  # type: ignore
import gensim.downloader as api  # type: ignore


MAX_CONTEXT = 26
PUNCTUATION = """ ,.:?!;_/\\+*=%&^@#$()[\]{}<>'"\-"""
MODELS = {
    "model": 'glove-wiki-gigaword-50',
    "twitter": 'glove-twitter-25',
}


def defined_or(value, fallback):
    return fallback if value is None else value


@cache
def load_model() -> KeyedVectors:
    model = defined_or(os.environ.get('WIA_MODEL'), 'model')
    if model not in MODELS:
        logging.warning(f'Model {model} is not known.')
        model = 'model'

    path = os.path.join(
        os.path.dirname(__file__),
        'data',
        model,
    )

    if not glob(f'{path}*'):
        logging.info(f'Downloading {model} model.')
        model = api.load(MODELS[model])
        model.save(path)

    vectors = KeyedVectors.load(path)
    logging.info('Model loaded')
    return vectors


def unique(options: list[str]) -> list[str]:
    return list(set(o.strip().lower() for o in options))


def get_target_words(
    prompt: list[str],
    *,
    n: int = 6,
    pre: int = 50,
    samples: int = 50,
) -> list[str]:
    model = load_model()
    text = list(w.lower() for w in prompt if w in model)
    original = list(text)

    for _ in range(pre):
        (w, _) = model.most_similar(positive=text[-MAX_CONTEXT:])[0]
        text.append(w)

    options = []

    for _ in range(samples):
        (w, _) = model.most_similar(positive=text[-MAX_CONTEXT:])[0]
        text.append(w)
        if w not in original and w not in PUNCTUATION:
            options.append(w)

    options = unique(options)
    # TODO: Consider weighting based on word length with prio for 3-5 long words

    return list(sample(options, n))


def get_next_word(
    prompt: list[str],
    lead: bool,
    target: Optional[str],
    guess_word_lengths: list[int],
    secrets: list[str],
) -> str:
    model = load_model()
    text = list(w.lower().strip() for w in prompt if w in model)
    vec = text[-MAX_CONTEXT:] + ([target] if target and lead else [])

    options = model.most_similar(positive=vec)
    options = [(lex, weight) for lex, weight in options if lex not in secrets]

    if target is not None:
        for i, (word, weight) in enumerate(options):
            weight2 = model.similarity(w1=word, w2=target)
            options[i] = (
                word,
                weight + weight2 if lead else weight + 0.1 * weight2
            )

    for i, (word, weight) in enumerate(options):
        if word in text:
            options[i] = (
                word,
                weight * 0.1
            )
        elif guess_word_lengths:
            options[i] = (
                word,
                weight * 1.5 if len(word) in guess_word_lengths else weight,
            )

    return sorted(
        options,
        key=lambda option: (
            option[1] if option[0] not in text else option[1] * 0.5
        ),
    ).pop()[0]
