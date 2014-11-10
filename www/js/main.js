
$(function () {
  $('.file-input').fileupload({
      url: "http://www.roxlr.com:9293/image_upload",
      dataType: 'json',
      beforeSend: function () {
	 $("#ajaxSpinnerContainer").show();
      },
      done: function (e, data) {
        $("#ajaxSpinnerContainer").hide();
  	$("#yourimage").attr("src","http://www.roxlr.com/uploads/"+data.result.imageURL+".l.jpg");
        renderHome();
      }
  });
});

//Generate main page
var renderHome = function() {
        Handlebars.registerHelper('noop', function(options) {
          return timeSince(this.created_at * 1000);
        });
        $.getJSON("http://www.roxlr.com:9293/imgs", function(data) {
                var template = "<ul class='row' style='float: left;' >{{#.}}<li ><span class='timeSince glyphicon glyphicon-time' style='float:right;'>{{#noop}}{{created_at}}{{/noop}}</span><div class='view'><img class='img-responsive' src='http://www.roxlr.com:9293/uploads/{{account_id}}/{{photo_id}}.t.jpg'>" +
                               "</div><span class='glyphicon glyphicon-search'></span>{{/.}}</ul>";
                var template = Handlebars.compile(template);
                var html = template(data);
                $('#content').html(html);
        });
}

window.onload=function(){
//document.addEventListener('deviceready',function() {
var lock = null;
lock = new Auth0Lock('J8CvsRkzaQyS6x89ZYQ0P0AUwyH2enSR', 'roxe.auth0.com');
var userProfile;

$('.btn-login').click(function(e) {
  e.preventDefault();
  lock.show(function(err, profile, token) {
    if (err) {
      // Error callback
      alert('There was an error');
    } else {
      // Success calback
      // Save the JWT token.
      localStorage.setItem('userToken', token);
      // Save the profile
      userProfile = profile;
    }
  });
   $.ajaxSetup({
  'beforeSend': function(xhr) {
    if (localStorage.getItem('userToken')) {
      xhr.setRequestHeader('Authorization',
            'Bearer ' + localStorage.getItem('userToken'));
    }
  }
  });
});

    $("#ajaxSpinnerContainer").hide();
    renderHome();
}

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + "m";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + "m";
    }
    return Math.floor(seconds) + "s";
}

document.addEventListener('deviceready',function() {
    var widget = new Auth0Widget({
        // All this properties are set on auth0-variables.js
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        callbackURL: AUTH0_CALLBACK_URL,
        callbackOnLocationHash: true
    });

    var userProfile;

    $('.btn-login').click(function(e) {
      e.preventDefault();
      widget.signin({ popup: true} , null, function(err, profile, token) {
        if (err) {
          // Error callback
          console.log("There was an error");
          alert("There was an error logging in");
        } else {
          // Success calback

          // Save the JWT token.
          localStorage.setItem('userToken', token);

          // Save the profile
          userProfile = profile;

          $('.login-box').hide();
          $('.logged-in-box').show();
          $('.nickname').text(profile.nickname);
          $('.nickname').text(profile.name);
          $('.avatar').attr('src', profile.picture);
        }
      });
    });

    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });

    $('.btn-api').click(function(e) {
      // Just call your API here. The header will be sent
      $.ajax({
        url: 'http://auth0-nodejsapi-sample.herokuapp.com/secured/ping',
        method: 'GET'
      }).then(function(data, textStatus, jqXHR) {
        alert("The request to the secured enpoint was successfull");
      }, function() {
        alert("You need to download the server seed and start it to call this API");
      });
    });


}, false);

