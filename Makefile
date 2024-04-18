run_app:
	@echo "Running the app"
	@echo "Client is running on http://localhost:4200"
	@echo "Server is running on http://localhost:8000"
	./scripts/run_server.sh& ./scripts/run_client.sh

install_deps:
	@echo "Installing dependencies"
	./scripts/install_deps.sh

run_server_prod:
	@echo "Running the server in production mode"
	cd /var/www/assignment-wt2/api/ &&  poetry run uvicorn api.main:app --root-path /wt2/api  --host 0.0.0.0 --port 8000 --reload
