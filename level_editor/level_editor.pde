int SELECT_X = 10;
int SELECT_Y = 610;
int SELECT_COL_COUNT = 32;

PImage text;
int s = 5;

int s2x(int s){
  return s % SELECT_COL_COUNT;
}

int s2y(int s){
  return floor(s / SELECT_COL_COUNT);
}

void setup(){
  size(1024, 900);
  text = loadImage("../font16.png");
}

void draw(){
  background(192);
  if(mousePressed == true
      && mouseX >= SELECT_X
      && mouseX < SELECT_X+512
      && mouseY >= SELECT_Y
      && mouseY < SELECT_Y+256){
    int sx = floor((mouseX - SELECT_X)/16);
    int sy = floor((mouseY - SELECT_Y)/16);
    s = sy*SELECT_COL_COUNT+sx;
  }
  
  image(text, SELECT_X, SELECT_Y);
  fill(255, 64, 64, 64);
  rect(s2x(s)*16+SELECT_X, s2y(s)*16+SELECT_Y, 16, 16);
  fill(255, 255, 255, 255);
}
