from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from users import router as user_router # импортируем роуты из users.py

app = FastAPI()

# Разрешенные источники (для CORS)
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем статику
app.mount("/static", StaticFiles(directory="static"), name="static")

# Роут для отображения HTML-страницы
@app.get("/", response_class=HTMLResponse)
async def get_client():
    with open("static/index.html", "r", encoding="utf-8") as file:
        return file.read()




# Подключаем роуты пользователей
app.include_router(user_router)


