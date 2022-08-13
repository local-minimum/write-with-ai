FROM python:3.9-slim

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --no-color --compile -r /tmp/requirements.txt

COPY with_ai /srv/with_ai

WORKDIR /srv
CMD gunicorn  --bind 0.0.0.0:8080 with_ai.server:app
