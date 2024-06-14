from flask import request, jsonify
from config import app, db
from models import User, Game, Playlist
from spotify_api import get_user_playlists, get_playlist_details # Tutaj import modułu, który ma info o playlistach, aktualnie losowa rzecz

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    name = data.get('name')
    surname = data.get('surname')
    nick = data.get('nick')
    email = data.get('email')
    password = data.get('password')

    if not name or not surname or not nick or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    new_user = User(name=name, surname=surname, nick=nick, email=email)
    new_user.set_password(password)  # Tutaj ustawiamy hasło
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "User registered"}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):  # Sprawdzmy hasło 
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

@app.route('/playlists', methods=['GET'])
def get_playlists():
    user_id = request.args.get('user_id')
    playlists = get_user_playlists(user_id)  # Jakaś funkcja do pobierania playlisty ze Spotify
    return jsonify({"playlists": playlists})

@app.route('/playlists/<playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist_details = get_playlist_details(playlist_id)  # Ta jest do szczegółów playlisty
    return jsonify({"playlist": playlist_details})

@app.route('/start_game', methods=['POST'])
def start_game():
    data = request.json
    user_id = data.get('user_id')
    playlist_id = data.get('playlist_id')
    mode = data.get('mode')

    if not user_id or not playlist_id or not mode:
        return jsonify({"message": "User ID, playlist ID, and mode are required"}), 400

    new_game = Game(user_id=user_id, playlist_id=playlist_id, mode=mode)
    try:
        db.session.add(new_game)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Game started", "game_id": new_game.id}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)