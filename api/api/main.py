from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import main_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

main_router.MainRouter(app).attach_routes()

