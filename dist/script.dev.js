"use strict";

var API_KEY = "AIzaSyAzkKmaRDCqz-8c3EvV-vdM3AnOHRdOt2k";
var prevSearch = "",
    pageToken = " ",
    prevToken,
    nextToken,
    content;
var head = document.getElementById("head");
head.innerHTML = "<ul class=\"topnav\">\n<li><a href='#' class=\"active\">All</a></li>\n<li><a href='#' >News</a></li>\n<li><a href='#' >Music</a></li>\n<li><a href='#' >Sports</a></li>\n<li><a href='#' >Movies</a></li>\n</ul>";
document.getElementById("btn").addEventListener("click", function () {
  var search = document.getElementById("field").value;

  for (var i = 0; i < anchors.length; i++) {
    anchors[i].className = "";
  }

  getData(search, getStats);
});
var anchors = document.querySelectorAll("a");
console.log(anchors);
anchors.forEach(function (tag) {
  return tag.addEventListener("click", function () {
    return activeAnchors(tag);
  });
});

function activeAnchors(anchor) {
  document.getElementById("field").value = "";

  for (var i = 0; i < anchors.length; i++) {
    anchors[i].className = "";
  }

  anchor.className = "active";
  getData(anchor.text, getStats);
}

function stats(vid) {
  var res, stat;
  return regeneratorRuntime.async(function stats$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("https://www.googleapis.com/youtube/v3/videos?key=\n    ".concat(API_KEY, "&id=").concat(vid, "&part=statistics")));

        case 2:
          res = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(res.json());

        case 5:
          stat = _context.sent;
          return _context.abrupt("return", stat.items[0].statistics.viewCount);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

var data;
getData("", getStats);

function getData(search, callback) {
  var main, page, response, snippet;
  return regeneratorRuntime.async(function getData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          main = document.getElementById("content");
          main.innerHTML = "";
          page = document.getElementById("page");
          content = page.innerHTML;
          page.innerHTML = "";
          _context2.next = 7;
          return regeneratorRuntime.awrap(fetch("https://www.googleapis.com/youtube/v3/search?key=\n      ".concat(API_KEY, "\n      &type=video&part=snippet&pageToken=").concat(pageToken, "&maxResults=15&q=\n      ").concat(search)));

        case 7:
          response = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          snippet = _context2.sent;
          data = snippet.items;
          console.log("pppp");
          nextToken = snippet.nextPageToken;
          prevToken = snippet.prevPageToken;
          callback(snippet.items, getChannelinfo);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getStats(items, cb) {
  var i, time, res, stat;
  return regeneratorRuntime.async(function getStats$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.t0 = regeneratorRuntime.keys(items);

        case 1:
          if ((_context3.t1 = _context3.t0()).done) {
            _context3.next = 14;
            break;
          }

          i = _context3.t1.value;
          time = getDiff(new Date(items[i].snippet.publishedAt), Date.now());
          _context3.next = 6;
          return regeneratorRuntime.awrap(fetch("https://www.googleapis.com/youtube/v3/videos?key=\n      ".concat(API_KEY, "&id=").concat(items[i].id.videoId, "&part=statistics")));

        case 6:
          res = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(res.json());

        case 9:
          stat = _context3.sent;
          data[i].sinceUploaded = time;
          data[i].statistics = stat.items[0].statistics;
          _context3.next = 1;
          break;

        case 14:
          cb(items, createElements);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getChannelinfo(items, cb) {
  var i, res, chinfo;
  return regeneratorRuntime.async(function getChannelinfo$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.t0 = regeneratorRuntime.keys(items);

        case 1:
          if ((_context4.t1 = _context4.t0()).done) {
            _context4.next = 12;
            break;
          }

          i = _context4.t1.value;
          _context4.next = 5;
          return regeneratorRuntime.awrap(fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&id=".concat(items[i].snippet.channelId, "&key=").concat(API_KEY)));

        case 5:
          res = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(res.json());

        case 8:
          chinfo = _context4.sent;
          data[i].channelthumbnail = chinfo.items[0].snippet.thumbnails["default"].url; // console.log(data[i]);

          _context4.next = 1;
          break;

        case 12:
          cb(data);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function getDiff(date1, date2) {
  var sinceUploaded = (date2 - date1) / (1000 * 60 * 60 * 24 * 31 * 12);
  sinceUploaded = parseInt(sinceUploaded);

  if (sinceUploaded <= 0) {
    sinceUploaded = (date2 - date1) / (1000 * 60 * 60 * 24 * 31);
    sinceUploaded = parseInt(sinceUploaded);

    if (sinceUploaded <= 0) {
      sinceUploaded = (date2 - date1) / (1000 * 60 * 60 * 24);
      sinceUploaded = parseInt(sinceUploaded);

      if (sinceUploaded <= 0) {
        sinceUploaded = (date2 - date1) / (1000 * 60 * 60);
        sinceUploaded = parseInt(sinceUploaded);
        sinceUploaded += " hours ago";
      } else sinceUploaded += " days ago";
    } else {
      sinceUploaded += " months ago";
    }
  } else {
    sinceUploaded += " years ago";
  }

  return sinceUploaded;
}

function viewsFormat(num) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K";
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num < 900) {
    return num;
  }
}

function createElements(tablecontent) {
  var main = document.getElementById("content");
  var articles = [];
  tablecontent.forEach(function (item) {
    var articleData = {
      vidThumbnail: item.snippet.thumbnails.high.url,
      vidTitle: item.snippet.title,
      vidId: item.id.videoId,
      viewCount: viewsFormat(parseInt(item.statistics.viewCount)) + " views",
      sinceUploaded: item.sinceUploaded,
      ChannelThumbnail: item.channelthumbnail,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description
    };
    articles.push(articleData);
  }); // console.log(articles[0]);

  articles.forEach(function (item) {
    var anchor = document.createElement("a");
    var article = document.createElement("article");
    article.className = "item";
    anchor.target = "_blank";
    anchor.href = "https://www.youtube.com/watch?v=".concat(item.vidId);
    var image = document.createElement("img");
    image.src = item.vidThumbnail;
    image.className = "thumb";
    var detailsdiv = document.createElement("div");
    detailsdiv.className = "details";
    var vidtitle = document.createElement("h3");
    vidtitle.append(item.vidTitle);
    detailsdiv.append(vidtitle);
    var videoinfo = document.createElement("span");
    videoinfo.innerHTML = item.viewCount + " " + item.sinceUploaded;
    var chinfo = document.createElement("div");
    chinfo.className = "channel-info";
    var img = document.createElement("img");
    img.className = "channel-thumb";
    img.src = item.ChannelThumbnail;
    chinfo.append(img);
    var chtitle = document.createElement("span");
    chtitle.append(item.channelTitle);

    if (window.innerWidth > 600) {
      var viddesc = document.createElement("p");
      viddesc.id = "info";
      chinfo.append(chtitle);
      viddesc.append(item.description);
      detailsdiv.append(videoinfo);
      detailsdiv.append(chinfo);
      detailsdiv.append(viddesc);
    } else {
      videoinfo.innerHTML = item.channelTitle + " - " + videoinfo.innerHTML;
      chinfo.append(videoinfo);
      detailsdiv.append(chinfo);
    }

    article.append(image);
    article.append(detailsdiv);
    anchor.append(article);
    main.append(anchor);
  });
  if (search === prevSearch) document.getElementById("page").innerHTML = content;
  pagination(search);
}

function pagination(search) {
  var page = document.getElementById("page");

  if (search !== prevSearch) {
    page.innerHTML = "<ul class=\"pagination-btn\">\n <li class=\"active pno\">1</li>\n <li class=\"pno \">2</li>\n <li class=\"pno \">3</li>\n <li class=\"pno \">4</li>\n <li class=\"pno \">5</li>\n </ul>";
  }

  prevSearch = search;
  document.querySelectorAll(".pno").forEach(function (tag) {
    return tag.addEventListener("click", function () {
      return changePage(tag);
    });
  });
}

window.onresize = function () {
  location.reload();
};

function changePage(tag) {
  var curr = document.querySelector(".pagination-btn li.active");

  if (curr.textContent < tag.textContent) {
    pageToken = nextToken;
  } else if (curr.textContent > tag.textContent) {
    pageToken = prevToken;
  }

  var c = tag.className;
  tag.className = curr.className;
  curr.className = c;
  getData(search, getStats);
}