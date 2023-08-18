import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import WordCloud from 'wordcloud';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { retry } from 'rxjs/internal/operators/retry';
import { pipe, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('main') main!: ElementRef
  arrComment: Array<string> = [];
  layout: any;
  arr: any = [
    {
      id: 'w',
      data: [],
      img: null
    }, {
      id: 'h',
      data: [],
      img: null
    }, {
      id: 'y',
      data: [],
      img: null
    }, {
      id: 'n',
      data: [],
      img: null
    }, {
      id: 'o',
      data: [],
      img: null
    }, {
      id: 't',
      data: [],
      img: null
    }
  ]
  isFirst = true;
  cacheComment: any = [];
  init: any = [];
  count = 0;


  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.connect().pipe(retry(1000)).subscribe((msg: any) => {
      if (msg.patten === '/init') {
        if (this.isFirst) {
          console.log(this.splitArrayIntoEqualChunks(msg.data, 6));

          this.splitArrayIntoEqualChunks(msg.data, 6).forEach((item: any, index: any) => {
            this.arr[index].data = item.map((ele: any) => {
              return [ele, 30]
            });
          });
          this.arr.forEach((ele: any) => {
            var img = new Image();
            console.log({ ...ele });

            img.src = this.getUrlImg(ele.id);
            ele.img = img;
            img.onload = () => {
              this.drawChar(ele);
            }
          });

          // const cache = timer(500, 500).subscribe(() => {
          //   const a = this.random()
          //   this.cacheComment = [
          //     ...this.cacheComment,
          //     ...a
          //   ];
          //   this.count += a.length;
          // })

          timer(1000, 1000).subscribe(() => {
            if (this.cacheComment.length) {
              let random = this.findArrayWithFewestElements(this.arr);

              const len = this.arr[random].length;
              const data = this.arr[random].data.map((ele: any) => {
                return [ele[0], ele[1]]
              });
              this.arr[random].data = [
                ...data,
                ...this.cacheComment
              ];
              this.cacheComment = [];
              this.drawChar(this.arr[random]);
            }
          });
          this.isFirst = false;
        }
      } else {
        this.cacheComment.push([msg.data.answers[0], 30])
      }
    });
  }

  connect() {
    return webSocket({
      url: 'wss://api.thoikhacgiaothoi.com/socket/join?token=0818813399',
      deserializer: (msgEvent: any) => {
        const msg: string = msgEvent.data;
        const splitIndex = msg.indexOf(' ');
        const patten = msg.slice(0, splitIndex);
        const data = msg.slice(splitIndex, msg.length);
        return {
          patten, data: JSON.parse(data)
        }
      },
    });
  }

  generateRandomText() {
    const characters = 'abcd ef ghi jk lmnop qrst uvwxy zABCDEF GHIJK LMN OPQ RSTUV WXYZ '; // Bao gồm cả ký tự và dấu cách
    const textLength = Math.floor(Math.random() * (10 - 4 + 1)) + 4; // Độ dài ngẫu nhiên

    let randomText = '';
    for (let i = 0; i < textLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomText += characters[randomIndex];
    }

    return randomText;
  }

  getUrlImg(text: string) {
    return `./assets/${text}.svg`;
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  drawChar(char: any) {
    const canvas = document.getElementById(char.id)! as HTMLCanvasElement;
    canvas.getContext('2d', { willReadFrequently: true })!.clearRect(0, 0, canvas.width, canvas.height);
    var img = char.img;
    var maskCanvas: any = null
    maskCanvas = document.createElement('canvas');
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;

    var ctx = maskCanvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, img.width, img.height);

    var imageData = ctx.getImageData(
      0, 0, maskCanvas.width, maskCanvas.height);
    var newImageData = ctx.createImageData(imageData);

    for (var i = 0; i < imageData.data.length; i += 4) {
      var tone = imageData.data[i] +
        imageData.data[i + 1] +
        imageData.data[i + 2];
      var alpha = imageData.data[i + 3];

      if (alpha < 128 || tone > 128 * 3) {
        // Area not to draw
        newImageData.data[i] =
          newImageData.data[i + 1] =
          newImageData.data[i + 2] = 255;
        newImageData.data[i + 3] = 0;
      } else {
        // Area to draw
        newImageData.data[i] =
          newImageData.data[i + 1] =
          newImageData.data[i + 2] = 0;
        newImageData.data[i + 3] = 255;
      }
    }

    ctx.putImageData(newImageData, 0, 0);
    this.drawCanvas(maskCanvas, canvas, (char.data as Array<any>).reverse())
  }

  drawCanvas(maskCanvas: any, canvas: any, data: any) {
    var bctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
    bctx.fillStyle = '#FBFCF4';
    bctx.fillRect(0, 0, 1, 1);
    var bgPixel = bctx.getImageData(0, 0, 1, 1).data;

    var maskCanvasScaled: any =
      document.createElement('canvas');
    maskCanvasScaled.width = canvas.width;
    maskCanvasScaled.height = canvas.height;
    var ctx: any = maskCanvasScaled.getContext('2d', { willReadFrequently: true })!;

    ctx.drawImage(maskCanvas,
      0, 0, maskCanvas.width, maskCanvas.height,
      0, 0, maskCanvasScaled.width, maskCanvasScaled.height);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var newImageData = ctx.createImageData(imageData);
    for (var i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] > 128) {
        newImageData.data[i] = bgPixel[0];
        newImageData.data[i + 1] = bgPixel[1];
        newImageData.data[i + 2] = bgPixel[2];
        newImageData.data[i + 3] = bgPixel[3];
      } else {
        // This color must not be the same w/ the bgPixel.
        newImageData.data[i] = bgPixel[0];
        newImageData.data[i + 1] = bgPixel[1];
        newImageData.data[i + 2] = bgPixel[2];
        newImageData.data[i + 3] = bgPixel[3] ? (bgPixel[3] - 1) : 0;
      }
    }

    ctx.putImageData(newImageData, 0, 0);
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(maskCanvasScaled, 0, 0);

    maskCanvasScaled = ctx = imageData = newImageData = undefined;
    const wordFrequency: any = data;

    // Initialize the word cloud options
    const wordCloudOptions = {
      list: wordFrequency,
      fontFamily: "'Inter', sans-serif",
      color: 'black',
      clearCanvas: false,
      gridSize: Math.round(16 * canvas.width / 1920),
      rotateRatio: 0,
      shrinkToFit: true,
      fontWeight: 900,
      minSize: 1,
      backgroundColor: '#FBFCF4',
    };
    WordCloud(canvas, wordCloudOptions);
  }

  splitArrayIntoEqualChunks(arr: any, numChunks: any) {
    const chunkSize = Math.ceil(arr.length / numChunks);
    const chunks = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }

    return chunks;
  }

  findArrayWithFewestElements(arrays: any) {
    var minIndex = 0;
    var minCount = arrays[0].data.length;

    for (var i = 1; i < arrays.length; i++) {
      if (arrays[i].data.length < minCount) {
        minIndex = i;
        minCount = arrays[i].data.length;
      }
    }

    return minIndex;
  }

  random() {
    return new Array(this.getRandomInt(10, 20)).fill(1).map(() => {
      return [this.generateRandomText(), 12]
    })

  }

}
