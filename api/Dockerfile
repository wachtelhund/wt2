FROM python:3.9

WORKDIR /app

COPY . /app

RUN pip install poetry
RUN poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock* /app/
RUN poetry install --no-dev

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--reload"]
