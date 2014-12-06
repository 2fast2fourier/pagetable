int tileSize = 16;

PImage text;
JSONObject levelData;
JSONArray levelList;
int[] level;
int selectedLevel = 0, levelCount, levelColumns;
int s = 0, boundX, boundY;
int selectX = 10, selectY, selectColCount, selectWidth, selectHeight, selectCount;
boolean unsaved = false;

PImage[] textMap;

int s2x(int s, int max){
  return s % max;
}

int s2y(int s, int max){
  return floor(s / max);
}

void setup(){
  loadLevels();
  loadTextMap("../font16.png");
  
  size(boundX*tileSize+10, selectY+selectHeight+10);
}

void loadTextMap(String file){
  text = loadImage(file);
  selectWidth = text.width;
  selectHeight = text.height;
  selectY = boundY*tileSize+20;
  selectColCount = floor(selectWidth/tileSize);
  selectCount = selectColCount*floor(selectHeight/tileSize);
  
  textMap = new PImage[selectCount];
  for(int ix=0;ix<selectCount;ix++){
    textMap[ix] = text.get(s2x(ix, selectColCount)*tileSize, s2y(ix, selectColCount)*tileSize, tileSize, tileSize);
  }
  
}

void draw(){
  background(240);
  if(mousePressed == true){
    if(mouseX >= selectX
        && mouseX < selectX+selectWidth
        && mouseY >= selectY
        && mouseY < selectY+selectHeight){
      int sx = floor((mouseX - selectX)/tileSize);
      int sy = floor((mouseY - selectY)/tileSize);
      s = sy*selectColCount+sx;
    }
  }
  if(mouseX < boundX*tileSize && mouseY < boundY*tileSize){
    int sx = floor(mouseX/tileSize);
    int sy = floor(mouseY/tileSize);
    int tar = sy*boundX+sx;
    if(mousePressed == true){
        fill(255, 64, 32, 64);
        rect(sx*tileSize, sy*tileSize, tileSize, tileSize);
        fill(255, 255, 255, 255);
      if(level[tar] != s){
        level[tar] = s;
        unsaved = true;
      }
    }else{
      fill(32, 255, 32, 32);
      rect(sx*tileSize, sy*tileSize, tileSize, tileSize);
      fill(255, 255, 255, 255);
    }
  }
  
  image(text, selectX, selectY);
  fill(255, 64, 64, 64);
  rect(s2x(s, selectColCount)*tileSize+selectX, s2y(s, selectColCount)*tileSize+selectY, tileSize, tileSize);
  fill(255, 255, 255, 255);
  
  //draw map
  int val;
  for(int ix=0;ix<level.length;ix++){
    val = level[ix];
    image(textMap[val], s2x(ix, boundX)*tileSize, s2y(ix, boundX)*tileSize);
  }
  
  if(unsaved){
    fill(0,0,0);
    text("Unsaved Changes (Press S to Save)", selectX, selectY-10);
  }
  
  fill(0,0,0,255);
  text("Levels: "+levelCount, boundX*tileSize-200, selectY);
  fill(255, 255, 255, 255);
  for(int ix=0;ix<levelCount;ix++){
    if(ix==selectedLevel){
      fill(64, 64, 255, 255);
    }else{
      fill(255, 255, 255, 255);
    }
    rect(boundX*tileSize-200+s2x(ix, levelColumns)*30, selectY+10+s2y(ix, levelColumns)*30, 20, 20);
  }
}

void saveLevels(){
  println("saving file");
  JSONArray leveljs = levelList.getJSONArray(selectedLevel);
  for(int ix=0;ix<level.length;ix++){
    leveljs.setInt(ix, level[ix]);
  }
  saveJSONObject(levelData, "../leveldata.json");
  unsaved = false;
}

void loadLevels(){
  levelData = loadJSONObject("../leveldata.json");
  levelList = levelData.getJSONArray("data");
  levelCount = levelList.size();
  levelColumns = ceil(sqrt(levelCount));
  level = levelList.getJSONArray(selectedLevel).getIntArray();
  boundX = levelData.getInt("boundX");
  boundY = floor(level.length/boundX);
  unsaved = false;
  println("loaded "+levelCount+" levels @ "+boundX+"x"+boundY);
  
}

void keyPressed(KeyEvent event){
  char pressed = event.getKey();
  if(pressed == 's' || pressed == 'S'){
    saveLevels();
  }
  if(pressed == 'r' || pressed == 'R'){
    loadLevels();
  }
  if(pressed == '+'){
    println("switchup");
  }
  if(pressed == '-'){
    println("switchdown");
  }
}
