int tileSize = 16;

PImage text;
JSONObject levelData;
JSONArray levelList, level;
int selectedLevel = 0, levelCount, levelColumns;
int s = 0, boundX, boundY;
int selectX = 10, selectY, selectColCount, selectWidth, selectHeight, selectCount;
boolean unsaved = false, kbMode = false;
int kbPos = -1;
int randMode = 0;

int[] randInvuln = {219, 220, 221, 222, 223, 475, 476, 477, 478, 479, 178, 434, 433, 177};

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
  background(24);
  if(mousePressed == true && mouseX >= selectX
      && mouseX < selectX+selectWidth
      && mouseY >= selectY
      && mouseY < selectY+selectHeight){
    int sx = floor((mouseX - selectX)/tileSize);
    int sy = floor((mouseY - selectY)/tileSize);
    s = sy*selectColCount+sx;
  }
  if(mouseX < boundX*tileSize && mouseY < boundY*tileSize){
    int sx = floor(mouseX/tileSize);
    int sy = floor(mouseY/tileSize);
    int tar = sy*boundX+sx;
    if(kbMode){
      if(mousePressed == true){
        kbPos = tar;
      }
    }else{
      if(mousePressed == true){
        fill(255, 64, 32, 64);
        rect(sx*tileSize, sy*tileSize, tileSize, tileSize);
        fill(255, 255, 255, 255);
        if(mouseButton == RIGHT){
          if(level.getInt(tar) != 0){
            level.setInt(tar, 0);
            unsaved = true;
          }
        }else{
          if(randMode == 1){
            level.setInt(tar, randInvuln[int(random(randInvuln.length))]);
            unsaved = true;
          }else if(randMode == 2){
            int selection = int(random(510));
            if(selection == 383){
              selection = int(random(382));
            }
            level.setInt(tar, selection);
            unsaved = true;
          }else if(level.getInt(tar) != s){
            level.setInt(tar, s);
            unsaved = true;
          }
        }
      }else{
        fill(32, 255, 32, 32);
        rect(sx*tileSize, sy*tileSize, tileSize, tileSize);
        fill(255, 255, 255, 255);
      }
    }
  }
  
  image(text, selectX, selectY);
  fill(64, 255, 32, 64);
  rect(s2x(s, selectColCount)*tileSize+selectX, s2y(s, selectColCount)*tileSize+selectY, tileSize, tileSize);
  fill(255, 255, 255, 255);
  
  //draw map
  int val, lvlSize = level.size();
  for(int ix=0;ix<lvlSize;ix++){
    val = level.getInt(ix);
    image(textMap[val], s2x(ix, boundX)*tileSize, s2y(ix, boundX)*tileSize);
  }
  
  if(unsaved){
    fill(255,192,0);
    text("Unsaved Changes (Press S to Save)", selectX, selectY-10);
  }
  
  if(randMode == 1){
    fill(255,192,0);
    text("Random: Wall", selectX+400, selectY-10);
  }else if(randMode == 2){
    fill(255,192,0);
    text("Random: All", selectX+400, selectY-10);
  }
  
  if(kbMode){
    fill(255,192,0);
    text("Keyboard Input "+kbPos, selectX+400, selectY-10);
    fill(255, 64, 32, 64);
    rect(s2x(kbPos, boundX)*tileSize, s2y(kbPos, boundX)*tileSize, tileSize, tileSize);
    fill(255, 255, 255, 255);
  }
  
  fill(255,192,0,255);
  text("Selected: "+s, boundX*tileSize-500, selectY-10);
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
  saveJSONObject(levelData, "../leveldata.json");
  unsaved = false;
}

void loadLevels(){
  levelData = loadJSONObject("../leveldata.json");
  levelList = levelData.getJSONArray("data");
  levelCount = levelList.size();
  levelColumns = ceil(sqrt(levelCount));
  level = levelList.getJSONArray(selectedLevel);
  boundX = levelData.getInt("boundX");
  boundY = floor(level.size()/boundX);
  unsaved = false;
  println("loaded "+levelCount+" levels @ "+boundX+"x"+boundY);
  
}

void switchLevel(int lvl){
  selectedLevel = lvl % levelCount;
  if(selectedLevel < 0){
    selectedLevel+=levelCount;
  }
  level = levelList.getJSONArray(selectedLevel);
  println("switched to level "+selectedLevel);
}

boolean isInKeyRange(int code){
  return code >= 32 && code < 128;
}

int getLetter(int code, boolean shift){
  if(code >= 65 && code <= 90){
    return shift ? code : code+32;
  }else if(code > 32 && code < 65){
    return shift ? code-16 : code;
  }else{
    return code;
  }
}

void keyPressed(KeyEvent event){
  char pressed = event.getKey();
  int code = event.getKeyCode();
  boolean ctrl = event.isControlDown();
  boolean shift = event.isShiftDown();
  if(code == TAB){
    kbMode = !kbMode;
  }
  if(kbMode){
    println("t: "+code+" - "+pressed+(ctrl?" ctrl":""));
    if(kbPos >= 0 && kbPos < level.size() && code < selectCount && isInKeyRange(code) && !ctrl){
      level.setInt(kbPos, getLetter(code, shift));
      kbPos++;
    }
    return;
  }
  if(pressed == 's' || pressed == 'S'){
    saveLevels();
  }
  if(pressed == 'r' || pressed == 'R'){
    loadLevels();
  }
  if(pressed == '+'){
    switchLevel(selectedLevel+1);
  }
  if(pressed == '-'){
    switchLevel(selectedLevel-1);
  }
  if(pressed == '='){
    randMode = 0;
  }
  if(pressed == '/'){
    randMode = 1;
  }
  if(pressed == '*'){
    randMode = 2;
  }
  if(code == DOWN){
    switchLevel(selectedLevel+levelColumns);
  }
  if(code == UP){
    switchLevel(selectedLevel-levelColumns);
  }
  if(code == RIGHT){
    switchLevel(selectedLevel+1);
  }
  if(code == LEFT){
    switchLevel(selectedLevel-1);
  }
}
