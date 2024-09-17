from flask import Flask
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    from .routes import register_routes

    register_routes(app)

    return app
