function submit(m, n) {
  var parent = document.getElementById("table");
  document.getElementById("choice1").style.display = "none";

  parent.innerHTML = "";
  if (m > 0 && n > 0) {
    console.log("inn");
    for (let i = 0; i < m; i++) {
      var element = document.createElement("div");
      element.style.display = "flex";
      element.style.justifyContent = "space-evenly";
      element.id = i.toString();
      for (let j = 0; j < n; j++) {
        var child = document.createElement("div");
        child.style.height = "50px";
        child.style.margin = "1em";
        child.style.width = "50px";
        child.id = i.toString() + j.toString();
        child.style.backgroundColor = "#79ff4d";
        element.appendChild(child);
      }
      parent.appendChild(element);
    }
  }
}
function colorcode(m, n, color) {
  // console.log(m, n);
  m--;
  n--;
  color = color.toString().toLowerCase();
  document.getElementById(m.toString() + n.toString()).style.backgroundColor =
    color;
}
function insert() {
  var divs = document.getElementsByClassName("insert");
  colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
    "#C0C0C0",
  ];
  // n++;
  // alert(n);
  document.getElementById("choice1").style.display = "flex";
  document.getElementById("table").style.display = "none";

  var element = document.createElement("div");
  element.id = "insert2";
  element.style.height = "230px";
  element.style.width = "200px";
  element.style.background = colors[Math.floor(Math.random() * 8)];
  var elep = document.createElement("p");
  elep.textContent = "div 2";
  element.appendChild(elep);
  var divs = document.getElementById("insert1");
  // var nxtdiv = document.getElementById("insert1");
  divs.insertAdjacentHTML("afterend", element.outerHTML);
}
