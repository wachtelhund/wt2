#!/bin/bash
cd api && poetry run uvicorn api.main:app --reload