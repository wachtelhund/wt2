run_app:
	@echo "Running the app"
	@echo "Client is running on http://localhost:4200"
	@echo "Server is running on http://localhost:8000"
	./scripts/run_server.sh& ./scripts/run_client.sh

install_deps:
	@echo "Installing dependencies"
	./scripts/install_deps.sh
