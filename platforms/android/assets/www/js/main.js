
$(function () {
  $('.file-input').fileupload({
      url: "http://www.roxlr.com/image_upload",
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
        $.getJSON("http://www.roxlr.com/imgs", function(data) {
                var template = "<ul class='row' style='width:340px;'>{{#.}}<li><span class='timeSince glyphicon glyphicon-time' style='float:right;'>{{#noop}}{{created_at}}{{/noop}}</span><div class='view'><img class='img-responsive' src='http://www.roxlr.com/uploads/{{account_id}}/{{photo_id}}.l.jpg'>" +
                               "</div><span class='glyphicon glyphicon-search'></span>{{/.}}</ul>";
                var template = Handlebars.compile(template);
                var html = template(data);
                $('#content').html(html);
        });
}

window.onload=function(){
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
