from fastapi import FastAPI
from api.routes import main_router


app = FastAPI()

main_router.MainRouter(app).attach_routes()

