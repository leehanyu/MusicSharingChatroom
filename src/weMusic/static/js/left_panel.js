function playlist_clicked(event) {
    playlist_id = $(event.target).parent().prev().attr('data');
    token = event.data.token;

    $.ajax({
        url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?limit=100',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (response) {
            var song_list = $('#song_list');
            song_list.empty();
            for (var i = 0; i < response.items.length; i++) {
                var song = $(document.createElement('li')).addClass('list-group-item d-flex justify-content-between align-items-center py-2');
                song.text(response.items[i].track.name);
                song.attr({
                    refer_string: response.items[i].track.id,
                    artist: response.items[i].track.artists[0].name,
                    album_img: response.items[i].track.album.images[0].url
                });
                var add_song = $(document.createElement('div')).addClass('float-right');
                var add = $(document.createElement('span')).addClass('btn btn-primary btn-sm oi oi-plus');
                add.attr('id', 'add_song');
                add_song.append(add);

                song.append(add_song);
                song_list.append(song);
            }
        }
    });
}


function add_song(event) {
    var name = $(event.target).parent().parent().text();
    artist = $(event.target).parent().parent().attr('artist');
    refer_string = $(event.target).parent().parent().attr('refer_string');
    album_img = $(event.target).parent().parent().attr('album_img');
    room_key = event.data.room_key;
    playlist_id = event.data.playlist_id;
    host_access_token = event.data.host_access_token;

    var update = true;
    loadRoomList(room_key);

    $.post("/add_song/" + room_key + '/' + name + '/' + artist + '/' + refer_string + '/' + album_img.slice(24, album_img.length));

    $.ajax({
        url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?uris=spotify:track:" + refer_string,
        type: "POST",
        headers: {'Authorization': 'Bearer ' + host_access_token, 'Content-Type': 'application/json'},
    })
}

function get_all_members(event) {
    var room_key = event.data.room_key;
    console.log('in get all members');
    $.get("/get_all_members/" + room_key).done(function (data) {
        var all_members = $('#all_members');
        all_members.empty();
        var all_members_str = "<ul class=\"list-group\">";
        for (var i = 0; i < data.users.length; i++) {
            user = data.users[i];
            var each_user = "<li class=\"list-group-item d-flex justify-content-between align-items-center py-2\">" + user['first_name']
                + "<div class=\"float-right\">" + "<a class=\"btn btn-primary btn-sm oi oi-circle-x\" href='http://localhost:8000/kick_user/" + room_key + "/" + user['username'] + "'></a></div></li>";
            all_members_str += each_user;
        }
        all_members_str += "</ul>";
        all_members.append($(all_members_str));
    });
}



