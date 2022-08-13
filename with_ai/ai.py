from functools import cache
import os
from random import sample
from typing import Optional

from gensim.models.keyedvectors import KeyedVectors


MAX_CONTEXT = 26


@cache
def load_model() -> KeyedVectors:
    return KeyedVectors.load(os.path.join(os.path.dirname(__file__), 'model'))


def unique(options: list[str]) -> list[str]:
    return list(set(o.strip().lower() for o in options))


def get_target_words(
    prompt: list[str],
    *,
    n: int = 6,
    pre: int = 25,
    samples: int = 50,
) -> list[str]:
    model = load_model()
    text = list(w.lower() for w in prompt if w in model)

    for _ in range(pre):
        (w, _) = model.most_similar(positive=text[-MAX_CONTEXT:])[0]
        text.append(w)

    options = []

    for _ in range(samples):
        (w, _) = model.most_similar(positive=text[-MAX_CONTEXT:])[0]
        text.append(w)
        options.append(w)

    options = unique(options)
    return list(sample(options, n))


def get_next_word(
    prompt: list[str],
    lead: bool,
    target: Optional[str]
) -> str:
    model = load_model()
    text = list(w.lower().strip() for w in prompt if w in model)
    options = model.most_similar(positive=text[-MAX_CONTEXT:])

    if target is not None:
        for i, (word, weight) in enumerate(options):
            weight2 = model.similarity(w1=word, w2=target)
            options[i] = (
                word,
                weight + weight2 if lead else weight + 0.1 * weight2
            )

    return sorted(
        options,
        key=lambda option: option[1] if option[0] not in text else option[1] * 0.5,
    ).pop()
