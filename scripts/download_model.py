#!/usr/bin/env python3.9

import gensim.downloader as api

model = api.load('glove-wiki-gigaword-50')
model.save('./with_ai/model')
