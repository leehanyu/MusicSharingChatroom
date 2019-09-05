function pause_or_play(event) {
    token = event.data.token;
    room_key = event.data.room_key;
    console.log("pause-----------");

    if (this.innerText == '||') {
        $.post("/pause_song/" + room_key);
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/pause",
            type: "PUT",
            headers: {'Authorization': 'Bearer ' + token}
        })
    }
    if (this.innerText == '▶') {
        $.post("/unpause_song/" + room_key);
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/play",
            type: "PUT",
            headers: {'Authorization': 'Bearer ' + token}
        })
    }
}

function skip(event) {
    token = event.data.token;
    console.log(event.data);
    room_key = event.data.room_key;
    var refer_string = '';
    $.get("/get_next_song/" + room_key).done(function (data) {
        refer_string = data;
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/play",
            type: "PUT",
            headers: {'Authorization': 'Bearer ' + token},
            data: '{"uris": ["spotify:track:' + refer_string + '"]}',
        })
    })
}

function send_comment(text, id) {
    console.log(text);
    var left = Math.random() * 350;
    console.log("left"+left);
    var singleComment = '<div id="singleComment-' + id.toString() + '" style="padding-top: 500px; padding-left: ' + left.toString() + 'px; font-size: 25px; color:transparent; -webkit-text-stroke: 1px black">' + text.toString() + '</div>';
    $("#comment-screen").append(singleComment);
    $("#singleComment-" + id.toString()).animate({paddingTop:'-2px'}, 5000, function () {
        $("#singleComment-" + id.toString()).remove();
    });
}