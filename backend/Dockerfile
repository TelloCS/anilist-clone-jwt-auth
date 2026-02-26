FROM python:3.13-slim AS python

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/backend

COPY requirements.txt .

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    netcat-openbsd \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

RUN groupadd -r anilist && useradd -r -g anilist anilist

EXPOSE 8000

#######################################################################
FROM python AS dev

COPY --chown=anilist:anilist . .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

RUN chown -R anilist:anilist /app

USER anilist

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]