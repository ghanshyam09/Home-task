var API_KEY = "AIzaSyCoRlBSCT5x2ytIouhOJuLuZhTXTfYY2Ew";
var prevSearch = "",
  pageToken = " ",
  prevToken,
  nextToken,
  content;

var head = document.getElementById("head");
head.innerHTML = `<ul class="topnav">
<li><a href='#' class="active">All</a></li>
<li><a href='#' >News</a></li>
<li><a href='#' >Music</a></li>
<li><a href='#' >Sports</a></li>
<li><a href='#' >Movies</a></li>
</ul>`;
document.getElementById("btn").addEventListener("click", () => {
  let search = document.getElementById("field").value;
  for (let i = 0; i < anchors.length; i++) {
    anchors[i].className = "";
  }
  getData(search, getStats);
});
var anchors = document.querySelectorAll("a");
console.log(anchors);
anchors.forEach((tag) =>
  tag.addEventListener("click", () => activeAnchors(tag))
);

function activeAnchors(anchor) {
  document.getElementById("field").value = "";
  for (let i = 0; i < anchors.length; i++) {
    anchors[i].className = "";
  }
  anchor.className = "active";
  getData(anchor.text, getStats);
}
async function stats(vid) {
  let res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=
    ${API_KEY}&id=${vid}&part=statistics`
  );
  let stat = await res.json();

  return stat.items[0].statistics.viewCount;
}

var data;
getData("", getStats);
async function getData(search, callback) {
  var main = document.getElementById("content");
  main.innerHTML = "";
  var page = document.getElementById("page");
  content = page.innerHTML;
  page.innerHTML = "";
  document.getElementById("spinner").className = "spinner";
  let response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=
      ${API_KEY}
      &type=video&part=snippet&pageToken=${pageToken}&maxResults=15&q=
      ${search}`
  );
  let snippet = await response.json();
  data = snippet.items;
  console.log("pppp");
  nextToken = snippet.nextPageToken;
  prevToken = snippet.prevPageToken;
  callback(snippet.items, getChannelinfo);
}
async function getStats(items, cb) {
  for (let i in items) {
    let time = getDiff(new Date(items[i].snippet.publishedAt), Date.now());
    let res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=
      ${API_KEY}&id=${items[i].id.videoId}&part=statistics`
    );

    let stat = await res.json();
    data[i].sinceUploaded = time;
    data[i].statistics = stat.items[0].statistics;
  }
  cb(items, createElements);
}
async function getChannelinfo(items, cb) {
  for (let i in items) {
    let res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${items[i].snippet.channelId}&key=${API_KEY}`
    );

    let chinfo = await res.json();
    data[i].channelthumbnail = chinfo.items[0].snippet.thumbnails.default.url;
    // console.log(data[i]);
  }
  cb(data);
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
  let articles = [];
  tablecontent.forEach((item) => {
    let articleData = {
      vidThumbnail: item.snippet.thumbnails.high.url,
      vidTitle: item.snippet.title,
      vidId: item.id.videoId,
      viewCount: viewsFormat(parseInt(item.statistics.viewCount)) + " views",
      sinceUploaded: item.sinceUploaded,
      ChannelThumbnail: item.channelthumbnail,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
    };
    articles.push(articleData);
  });
  // console.log(articles[0]);

  document.getElementById("spinner").className = "";
  articles.forEach((item) => {
    let anchor = document.createElement("a");
    let article = document.createElement("article");
    article.className = "item";
    anchor.target = "_blank";
    anchor.href = `https://www.youtube.com/watch?v=${item.vidId}`;

    let image = document.createElement("img");
    image.src = item.vidThumbnail;
    image.className = "thumb";

    let detailsdiv = document.createElement("div");
    detailsdiv.className = "details";

    let vidtitle = document.createElement("h3");
    vidtitle.append(item.vidTitle);
    detailsdiv.append(vidtitle);
    let videoinfo = document.createElement("span");

    videoinfo.innerHTML = item.viewCount + " " + item.sinceUploaded;

    let chinfo = document.createElement("div");
    chinfo.className = "channel-info";
    let img = document.createElement("img");
    img.className = "channel-thumb";
    img.src = item.ChannelThumbnail;
    chinfo.append(img);
    let chtitle = document.createElement("span");
    chtitle.append(item.channelTitle);

    if (window.innerWidth > 600) {
      let viddesc = document.createElement("p");
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
  if (search === prevSearch)
    document.getElementById("page").innerHTML = content;
  pagination(search);
}

function pagination(search) {
  let page = document.getElementById("page");
  if (search !== prevSearch) {
    page.innerHTML = `<ul class="pagination-btn">
 <li class="active pno">1</li>
 <li class="pno ">2</li>
 <li class="pno ">3</li>
 <li class="pno ">4</li>
 <li class="pno ">5</li>
 </ul>`;
  }
  prevSearch = search;
  document
    .querySelectorAll(".pno")
    .forEach((tag) => tag.addEventListener("click", () => changePage(tag)));
}
window.addEventListener('resize',()=>location.reload());

function changePage(tag) {
  let curr = document.querySelector(".pagination-btn li.active");

  if (curr.textContent < tag.textContent) {
    if (nextToken) pageToken = nextToken;
  } else if (curr.textContent > tag.textContent) {
    if (prevToken) pageToken = prevToken;
  }
  var c = tag.className;
  tag.className = curr.className;
  curr.className = c;
  getData(search, getStats);
}
