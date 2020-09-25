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
  // tracks.forEach(function(track) {
  //   track.stop();
  // });
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
  const timeData = new Uint8Array(bufferLength);
  //   console.log(timeData);
  const frequencyData = new Uint8Array(bufferLength);
  // console.log(frequencyData);
  // drawTimeData(timeData);
  drawFrequency(frequencyData);
}

// // x-axis is time - just measures intensity of sound over time... not much info
// function drawTimeData(timeData) {
//   // inject the timedata into our timeData array
//   analyser.getByteTimeDomainData(timeData);
//   //   console.log(timeData);
//   // now that we have the data -> turn it into a visual
//   // 1. clear the canvas TODO
//   ctx.clearRect(0, 0, WIDTH, HEIGHT);
//   // 2. set up some canvas drawing
//   ctx.lineWidth = 10;
//   ctx.strokeStyle = '#61ff8b';
//   ctx.beginPath();
//   // each thing we draw is a slice
//   const sliceWidth = WIDTH / bufferLength;
//   // console.log(sliceWidth);
//   let x = 0;
//   // give each time data point a position on the canvas
//   timeData.forEach((data, i) => {
//     // when nothing said -> data = 128
//     const v = data / 128;
//     // const y = (v * HEIGHT) / 2;
//     const y = (v * HEIGHT) / 3;

//     // draw our lines
//     // if first line
//     if (i == 0) {
//       ctx.moveTo(x, y);
//     } else {
//       ctx.lineTo(x, y);
//     }
//     // louder -> change color
//     if (v > 1.2) {
//       ctx.strokeStyle = '#ffcb1f';
//     }

//     if (v > 1.3) {
//       ctx.strokeStyle = '#ff351f';
//     }

//     ctx.stroke();
//     // move x-axis (moves from low freq data to high freq data)
//     x += sliceWidth;
//   });

//   // call itself as soon as possible.. when browser repaints page
//   requestAnimationFrame(() => drawTimeData(timeData));
// }

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
  // console.log(barWidth);
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

  // console.log(frequencyData);
  requestAnimationFrame(() => drawFrequency(frequencyData));
}

// getAudio();
