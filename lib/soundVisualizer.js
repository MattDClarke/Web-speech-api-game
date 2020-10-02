import { hslToRgb } from './util';

const WIDTH = 1000;
const HEIGHT = 1000;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
let analyser;
let bufferLength;

export async function getAudio(stream) {
  // in the browser - where all of the processing of the audio will occur
  const audioCtx = new AudioContext();
  // create an analyser
  analyser = audioCtx.createAnalyser();
  // create a source -> pass in stream from the user
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);
  // How much data should we collect? Can adjust
  analyser.fftSize = 2 ** 10;
  // pull the data off the audio
  // data u get back frm the time data is 8 bit ( 1 byte) - each item can only be 8 bits in size. Also Typed... cant accidently input wrong type.. used in graphics, data analysis...

  // how many pieces of data are there?
  bufferLength = analyser.frequencyBinCount;
  const frequencyData = new Uint8Array(bufferLength);
  drawFrequency(frequencyData);
}

function drawFrequency(frequencyData) {
  // get the frequency data into our frequencyData array
  analyser.getByteFrequencyData(frequencyData);
  // now that we have the data -> turn it into a visual
  // 1. clear the canvas TODO
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // 2. set up some canvas drawing
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#61ff8b';
  ctx.beginPath();
  // figure out the bar width
  // remove higher frequencies (make bars wider)... higher frequencies not really picked up
  const barWidth = (WIDTH / bufferLength) * 2.5;
  let x = 0;
  frequencyData.forEach(frequency => {
    // 0 to 255
    const percent = frequency / 255;
    const [h, s, l] = [360 / (percent * 360) - 0.5, 1, 0.5];
    const barHeight = (HEIGHT * percent) / 10;
    // convert the color to HSL - cant use hsl with canvas
    const [r, g, b] = hslToRgb(h, s, l);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    // ctx.fillRect(x, 0, barWidth, barHeight);
    x += barWidth + 8;
  });

  requestAnimationFrame(() => drawFrequency(frequencyData));
}

// getAudio();
