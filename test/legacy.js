function GridGenerator(width, height){
  var	floor = Math.floor,
    random = Math.random,
    result = new Array(height);
  for(var	j, i = 0; i < height; i++) {
    result[i] = new Array(width);
    for(j = 0; j < width; j++)
      result[i][j] = (j * i) % 7 ? floor(random() * 200) % 2 : 0;
  };
  return result;
};
function ClearGrid(grid){
  for(var	i = 0, j = grid.length; i < j; i++) {
    for(var	td, k = 0, l = grid[i].length; k < l; k++) {
      if(grid[i][k].onmouseover) {
        grid[i][k].className = "";
        grid[i][k].onmouseout = function(){this.className = ""};
      };
    };
  };
};
function GridTable(width, height){
  var	table = document.createElement("TABLE"),
    tbody = document.createElement("TBODY"),
    grid = GridGenerator(width, height),
    startPoint = [Math.ceil(Math.random() * (grid.length * grid[0].length)), 0],
    random = true,
    tdList = [];
  for(var	tr, i = 0, j = grid.length; i < j; i++) {
    tdList[i] = [];
    tr = document.createElement("TR");
    for(var	td, k = 0, l = grid[i].length; k < l; k++) {
      td = document.createElement("TD");
      if(grid[i][k] !== 0)
        td.className = "not-available";
      else {
        if(random && startPoint[0] <= i + (k * l)) {
          random = false;
          startPoint = [k, i];
          td.className = "start-point";
        }
        else {
          td.x = k;
          td.y = i;
          td.onmouseover = function(){
            this.className = "over";
          };
          td.onmouseout = function(){this.className = ""};
          td.onclick = function(){
            var	endPoint = [this.x, this.y],
              bench = (new Date()).getTime(),
              result = AStar(grid, startPoint, endPoint,
                document.getElementById("method").value
              ),
              endTime = (new Date()).getTime() - bench;
            document.getElementById("result").innerHTML = "".concat(
              "Time (ms): <strong>", endTime, "</strong><br />",
              result.length === 0 ?
                "<strong>No Match</strong>" : 
                "Path Length: <strong>" + result.length + "</strong>"
            );
            ClearGrid(tdList);
            for(var x, y, i = 0, j = result.length; i < j; i++) {
              x = result[i][0];
              y = result[i][1];
              tdList[y][x].className = "over2";
              tdList[y][x].onmouseout = null;
              tdList[y][x].change = function(){
                var	self = this;
                setTimeout(function(){
                  self.className = "over";
                }, 500);
              };
              tdList[y][x].change();
            };
            if(result.length === 0)
              tdList[startPoint[1]][startPoint[0]].className = "start-point";
          };
        };
      };
      tdList[i][k] = td;
      tr.appendChild(td);
    };
    tbody.appendChild(tr);
  };
  table.appendChild(tbody);
  return table;
};
function NewDimension(){
  var	widths = {
      10:340,
      20:560,
      30:780,
      40:1002
    };
    values = document.getElementById("colsrows").value.split("x");
  values[0] = parseInt(values[0]);
  values[1] = parseInt(values[1]);
  if(width !== values[0]) {
    width = values[0];
    height = values[1];
    NewTable();
    document.getElementById("astar").style.width = widths[width] + "px";
  };
};
function NewTable(){
  table.parentNode.removeChild(table);
  table = GridTable(width, height);
  onload();
};
onload = function(){
  document.getElementById("atable").appendChild(table);
};
var	width = 20,
  height = 20,
  table = GridTable(width, height);
