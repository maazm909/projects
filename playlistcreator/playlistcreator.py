import json
import requests
from secrets import spotify_user_id, spotify_token

class Playlistcreator:
    """docstring for CreatePlaylist."""

    def __init__(self, arg):
        super(Playlistcreator, self).__init__()
        self.arg = arg

    def get_youtube_client(self):

    def get_liked_videos(self):

    def create_playlist(self):
        request_body = json.dumps
        ({
          "name": "Youtube Liked Vids",
          "description": "All Liked Youtube Videos",
          "public": True
        })

        query = "https://api.spotify.com/v1/users/{user_id}/playlists".format(self.user_id)

        response = requests.post(
            query,
            data=request_body,
            headers={
                "Content-Type":"application/json",
                "Authorization":"Bearer {}".format(spotify_token)
            }
        )

    def get_spotify_uri(self):

    def add_song_to_playlist(self):
