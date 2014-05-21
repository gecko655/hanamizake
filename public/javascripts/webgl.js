// VertexShader
var VSHADER_SOURCE =
  'attribute vec4 a_Position;'+	
  'attribute vec2 a_TexCoord;'+	
  'varying vec2 v_TexCoord;'+
  'void main() {'+
  '  gl_Position = a_Position;'+
  '  gl_PointSize = 10.0;'+
  '  v_TexCoord = a_TexCoord;'+
  '}';

// FragmentShader
var FSHADER_SOURCE = 
  'precision mediump float;'+
  'uniform sampler2D uSampler;'+	
  'varying vec2 v_TexCoord;'+		
  'uniform int pressed;'+
  'uniform int type;'+
  'void main() {'+
  '  if(pressed == 1){'+
  '    if(type == 0){'+
  '      gl_FragColor = texture2D(uSampler , v_TexCoord)*vec4(0.8, 0.5, 0.5, 1.0);'+
  '    }else{'+
  '      gl_FragColor = texture2D(uSampler , v_TexCoord)*vec4(0.5, 0.5, 0.5, 1.0);'+
  '    }'+
  '  }'+
  '  else gl_FragColor = texture2D(uSampler, v_TexCoord);'+
  '}\n';



var gl;	// Context
var program;	// Sharder

// キーボードの画像を書く位置、頂点座標とテクスチャ座標はどちらとも左下(0,0), 右上(2.2, 1)とする
// 1024/464 = 2.2068
var vertexCoords = new Float32Array([
		// 頂点座標, テクスチャ座標
		 0.0,  1.0,   0.0,  1.0,	// 左上
		 0.0,  0.0,   0.0,  0.0,	// 左下
 		 2.2,  1.0,   2.2,  1.0,	// 右上
		 2.2,  0.0,   2.2,  0.0,	// 右下
		 
		 // 1,Z
		 0.365, 0.308,   0.365,  0.308,
		 0.365, 0.186,   0.365,  0.186,
 		 0.490, 0.308,   0.490,  0.308,
		 0.490, 0.186,   0.490,  0.186,
		 
		 // 2,X
		 0.515, 0.308,   0.515,  0.308,
		 0.515, 0.186,   0.515,  0.186,
 		 0.640, 0.308,   0.640,  0.308,
		 0.640, 0.186,   0.640,  0.186,
		  
		 // 3,C
		 0.660, 0.308,   0.660,  0.308,
		 0.660, 0.186,   0.660,  0.186,
 		 0.790, 0.308,   0.790,  0.308,
		 0.790, 0.186,   0.790,  0.186,
		  
		 // 4,V
		 0.810, 0.308,   0.810,  0.308,
		 0.810, 0.186,   0.810,  0.186,
 		 0.940, 0.308,   0.940,  0.308,
		 0.940, 0.186,   0.940,  0.186,
		 
		 // 5,B
		 0.958, 0.308,   0.958,  0.308,
		 0.958, 0.186,   0.958,  0.186,
 		 1.083, 0.308,   1.083,  0.308,
		 1.083, 0.186,   1.081,  0.186,		 
		 
		 // 6,N
		 1.108, 0.308,   1.108,  0.308,
		 1.108, 0.186,   1.108,  0.186,
 		 1.233, 0.308,   1.233,  0.308,
		 1.233, 0.186,   1.233,  0.186,
		 
		 // 7,M
		 1.258, 0.308,   1.258,  0.308,
		 1.258, 0.186,   1.258,  0.186,
 		 1.383, 0.308,   1.383,  0.308,
		 1.383, 0.186,   1.383,  0.186,
		 
		 // 8,A
		 0.290, 0.450,   0.290,  0.450,
		 0.290, 0.328,   0.290,  0.328,
 		 0.420, 0.450,   0.420,  0.450,
		 0.420, 0.328,   0.420,  0.328,
		 
		 // 9,S
     0.440, 0.450,   0.440,  0.450,
		 0.440, 0.328,   0.440,  0.328,
 		 0.567, 0.450,   0.567,  0.450,
		 0.567, 0.328,   0.567,  0.328,
		 
		 // 10,D
		 0.587, 0.450,   0.587,  0.450,
		 0.587, 0.328,   0.587,  0.328,
 		 0.715, 0.450,   0.715,  0.450,
		 0.715, 0.328,   0.715,  0.328,
		 
		 // 11,F
		 0.737, 0.450,   0.737,  0.450,
		 0.737, 0.328,   0.737,  0.328,
 		 0.862, 0.450,   0.862,  0.450,
		 0.862, 0.328,   0.862,  0.328,
		 
		 // 12,G
		 0.887, 0.450,   0.887,  0.450,
		 0.887, 0.328,   0.887,  0.328,
 		 1.012, 0.450,   1.012,  0.450,
		 1.012, 0.328,   1.012,  0.328,
		 
		 // 13,H
		 1.035, 0.450,   1.035,  0.450,
		 1.035, 0.328,   1.035,  0.328,
 		 1.160, 0.450,   1.160,  0.450,
		 1.160, 0.328,   1.160,  0.328,
		 
		 // 14,J
		 1.185, 0.450,   1.185,  0.450,
		 1.185, 0.328,   1.185,  0.328,
 		 1.310, 0.450,   1.310,  0.450,
		 1.310, 0.328,   1.310,  0.328,
		 
		 // 15,K
		 1.335, 0.450,   1.335,  0.450,
		 1.335, 0.328,   1.335,  0.328,
 		 1.460, 0.450,   1.460,  0.450,
		 1.460, 0.328,   1.460,  0.328,
		 
		 // 16,L
		 1.480, 0.450,   1.480,  0.450,
		 1.480, 0.328,   1.480,  0.328,
 		 1.607, 0.450,   1.607,  0.450,
		 1.607, 0.328,   1.607,  0.328,
		 
		 // 17,Q
		 0.252, 0.592,   0.252,  0.592,
		 0.252, 0.465,   0.252,  0.465,
 		 0.380, 0.592,   0.380,  0.592,
		 0.380, 0.465,   0.380,  0.465,
		 
		 // 18,W
		 0.400, 0.592,   0.400,  0.592,
		 0.400, 0.465,   0.400,  0.465,
 		 0.530, 0.592,   0.530,  0.592,
		 0.530, 0.465,   0.530,  0.465,
		 		 
		 // 19,E
		 0.550, 0.592,   0.550,  0.592,
		 0.550, 0.465,   0.550,  0.465,
 		 0.677, 0.592,   0.677,  0.592,
		 0.677, 0.465,   0.677,  0.465,
		 
		 // 20,R
		 0.700, 0.592,   0.700,  0.592,
		 0.700, 0.465,   0.700,  0.465,
 		 0.825, 0.592,   0.825,  0.592,
		 0.825, 0.465,   0.825,  0.465,
		 
		 // 21,T
		 0.848, 0.592,   0.848,  0.592,
		 0.848, 0.465,   0.848,  0.465,
 		 0.975, 0.592,   0.975,  0.592,
		 0.975, 0.465,   0.975,  0.465,
		 
		 // 22,Y
		 0.998, 0.592,   0.998,  0.592,
		 0.998, 0.465,   0.998,  0.465,
 		 1.125, 0.592,   1.125,  0.592,
		 1.125, 0.465,   1.125,  0.465,
		 
		 // 23,U
		 1.145, 0.592,   1.145,  0.592,
		 1.145, 0.465,   1.145,  0.465,
 		 1.275, 0.592,   1.275,  0.592,
		 1.275, 0.465,   1.275,  0.465,
		 
		 // 24,I
		 1.295, 0.592,   1.295,  0.592,
		 1.295, 0.465,   1.295,  0.465,
 		 1.420, 0.592,   1.420,  0.592,
		 1.420, 0.465,   1.420,  0.465,
		 
		 // 25,O
		 1.445, 0.592,   1.445,  0.592,
		 1.445, 0.465,   1.445,  0.465,
 		 1.570, 0.592,   1.570,  0.592,
		 1.570, 0.465,   1.570,  0.465,
		 
		 // 26,P
		 1.592, 0.592,   1.592,  0.592,
		 1.592, 0.465,   1.592,  0.465,
 		 1.720, 0.592,   1.720,  0.592,
		 1.720, 0.465,   1.720,  0.465,
	]);
	

function main(){
	var canvas = document.getElementById('view');
	gl = canvas.getContext('experimental-webgl');

	if(!gl){
		// webglが無効な場合の処理
		document.getElementById('nowebgl').firstChild.style.display = 'block';
		return;
	}

	// width/height = 2.2となるように設定すること
	const aspect = canvas.width/canvas.height;	
	c(aspect);
	// 頂点座標とテクスチャ座標の形を適切に整える
	for(var i=0; i<vertexCoords.length; i+=4){
			vertexCoords[i] = (vertexCoords[i]/aspect)*2 - 1.0;
			vertexCoords[i+1] = vertexCoords[i+1]*2 - 1.0;
			vertexCoords[i+2] = vertexCoords[i+2]/aspect;
			vertexCoords[i+3] = vertexCoords[i+3]*(464.0/512.0);
	}
	
	
	
  // シェーダを初期化する
	setupGL();

	
	
	// 頂点を設定する
	var vertexBuffer = gl.createBuffer();		
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexCoords, gl.STATIC_DRAW);
	
	var FSIZE = vertexCoords.BYTES_PER_ELEMENT;		
	
	var a_Position = gl.getAttribLocation(program, 'a_Position');
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);	
    gl.enableVertexAttribArray(a_Position);
	
    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');    
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
  
  
    // カラーを設定する
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	
	
	 // テクスチャを設定する
	var texture = gl.createTexture();	// OpenGLESではglGenTextures()に対応する	
	var uSampler = gl.getUniformLocation(program, 'uSampler');		
	var image = new Image();
	image.src = '/public/images/keyboardTex.png';
	image.onload = function(){
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);	
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
	
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.uniform1i(uSampler, 0);
		draw(-1);
	}
}


function draw(pressedIndex, valid){
    gl.useProgram(program);
	  
    var pressed = gl.getUniformLocation(program, 'pressed');		
    var type = gl.getUniformLocation(program, 'type');		
    
	// 押されたキーの場所はpresses=1にする
	  
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1i(pressed, 0);	
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);	
    
    if(pressedIndex == -1 || typeof pressedIndex === "undefined") return;
    
    gl.uniform1i(pressed, 1);	 
    gl.uniform1i(type, (valid)? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, pressedIndex*4, 4);                
}


function setupGL(){
	program = gl.createProgram();
	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, VSHADER_SOURCE);
  gl.compileShader(vertexShader);
 
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, FSHADER_SOURCE);
  gl.compileShader(fragShader);
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  
  gl.linkProgram(program);
}


var c = function (Obj) {console.log(Obj)};
var t = function (Obj) {console.log(Object.prototype.toString.call(Obj));};











