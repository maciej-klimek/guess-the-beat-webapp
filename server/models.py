from config import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    nick = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'nick': self.nick,
            'email': self.email,
            'created_at': self.created_at
        }
    
class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    spotify_id = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('playlists', lazy=True))

    def to_json(self):
        return {
            'id': self.id,
            'spotify_id': self.spotify_id,
            'name': self.name,
            'user_id': self.user_id,
            'created_at': self.created_at
        }
    
class Game(db.model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlist.id'), nullable=False)
    mode = db.Column(db.String(50), nullable=False)  # 'audio' or 'cover'
    score = db.Column(db.Integer, default=0)
    finished_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', backref=db.backref('games', lazy=True))
    playlist = db.relationship('Playlist', backref=db.backref('games', lazy=True))

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'playlist_id': self.playlist_id,
            'mode': self.mode,
            'score': self.score,
            'created_at': self.created_at,
            'finished_at': self.finished_at
        }