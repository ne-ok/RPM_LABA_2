from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING
import os
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()

from dotenv import load_dotenv
import os

load_dotenv()

print("DEBUG: MONGO_URI =", os.getenv("MONGO_URI"))
print("DEBUG: DATABASE_NAME =", os.getenv("DATABASE_NAME"))

# Получаем URL подключения к MongoDB из переменной окружения
MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Создаём асинхронного клиента MongoDB
client = AsyncIOMotorClient(MONGO_URL)

# Выбираем базу данных
db = client["user_database"]

# Инициализация коллекции и индексов
async def init_db() -> None:
    """
    Создание уникальных индексов для коллекции users.
    Вызывается при старте приложения.
    """
    await db.users.create_index([("username", ASCENDING)], unique=True)
    await db.users.create_index([("email", ASCENDING)], unique=True)
    print("Индексы MongoDB инициализированы")
