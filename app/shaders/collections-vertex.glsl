attribute vec2 uv;

 attribute vec3 position;

 uniform mat4 modelViewMatrix;
 uniform mat4 projectionMatrix;

 varying vec4 newPosition;
 varying vec2 vUv;

 void main() {
  vUv = uv;

  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  vPosition = newPosition

  gl_Position = projectionMatrix * newPosition;
 }