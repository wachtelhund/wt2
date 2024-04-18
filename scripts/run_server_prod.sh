#!/bin/bash
cd /var/www/assignment-wt2/api && poetry run uvicorn api.main:app --root-path /wt2/api --host 0.0.0.0 --port 8000 --reload
