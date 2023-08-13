import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('main') main!: ElementRef
  data: any = {
    w: [
      {
        name: 'part-1',
        space: ['space-1', 'space-2'],
        text: [

        ]
      },
      {
        name: 'part-2',
        space: ['space-1', 'space-2'],
        text: [

        ]
      },
      {
        name: 'part-3',
        space: ['space-1', 'space-2'],
        text: [

        ]
      },
      {
        name: 'part-4',
        space: ['space-1', 'space-2'],
        text: [
        ]
      },
    ],
    h: [
      {
        name: 'part-1',
        space: [],
        text: [

        ]
      },
      {
        name: 'part-2',
        space: [],
        text: [

        ]
      },
      {
        name: 'part-3',
        space: [],
        text: [

        ]
      },
    ],
    y: [
      {
        name: 'part-1',
        space: ['space-1', 'space-2'],
        text: [

        ]
      },
      {
        name: 'part-2',
        space: ['space-1', 'space-2'],
        text: [

        ]
      }
    ],
    space: [],
    n: [
      {
        name: 'part-1',
        space: [],
        text: [

        ]
      },
      {
        name: 'part-2',
        space: ['space-1', 'space-2'],
        text: [

        ]
      },
      {
        name: 'part-3',
        space: [],
        text: [

        ]
      }
    ],
    o: [
      {
        name: 'part-1',
        space: ['space-1', 'space-2'],
        text: [

        ]
      }
    ],
    t: [
      {
        name: 'part-1',
        space: ['space-1', 'space-2'],
        text: [

        ]
      }
    ],
    qm: []
  }
  arrComment: Array<string> = [];

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    Object.keys(this.data).forEach((ele: string) => {
      this.generateHTML(ele, this.data[ele]);
    });

    let length = 0;
    timer(100, 100).subscribe(() => {
      this.arrComment.push(this.generateRandomText() + " ");

    })
    const a = timer(1000, 1000).subscribe(() => {
      length += this.arrComment.length;
      this.pushTextToChar();
      if (length > 700) {
        a.unsubscribe();
      }
      console.log(length);

    })



  }

  convertFontSize(arr: Array<HTMLElement>, ignore: any) {
    arr.forEach((ele: any) => {
      (ele.element as HTMLElement).childNodes.forEach((node: any) => {
        if (node !== ignore) {
          const fontSize = +node.style.fontSize.split('px')[0] - 1;
          if (fontSize) {
            node.style.fontSize = fontSize + 'px';
          }
        }
      })
    })
  }

  pushTextToChar() {
    const arr = ['w', 'h', 'y', 'n', 'o', 't'];
    this.arrComment.forEach((comment: string) => {
      const charSelect = this.data[arr[Math.floor(Math.random() * Object.keys(arr).length)]]
      const text = this.renderer.createText(comment);
      const p = this.renderer.createElement('p');
      this.renderer.appendChild(p, text);
      const random = Math.floor(Math.random() * charSelect.length);
      this.renderer.appendChild(charSelect[random].element, p);
      if (charSelect[random].element.scrollHeight > (this.main.nativeElement as HTMLDivElement).offsetHeight * 1.5) {
        const fontSize = +charSelect[random].element.style.fontSize.split('px')[0];
        if (fontSize) {
          charSelect[random].element.style.fontSize = fontSize - 1 + 'px';
        }
      }
    });
    this.arrComment = [];
  }

  generateRandomText() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '; // Bao gồm cả ký tự và dấu cách
    const textLength = Math.floor(Math.random() * (50 + 1)); // Độ dài ngẫu nhiên

    let randomText = '';
    for (let i = 0; i < textLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomText += characters[randomIndex];
    }

    return randomText;
  }

  randomPositionText() {
    return Math.floor(Math.random() * 4) + 1
  }

  generateHTML(char: string, data: any) {
    const div = this.renderer.createElement('div');
    this.renderer.addClass(div, char);
    data.forEach((part: any) => {
      const divPart = this.renderer.createElement('div');
      this.renderer.addClass(divPart, part.name);
      this.renderer.appendChild(div, divPart);
      part.space.forEach((space: string) => {
        const spaceView = this.renderer.createElement('div');
        this.renderer.addClass(spaceView, space);
        this.renderer.appendChild(divPart, spaceView);
      });
      const divText = this.renderer.createElement('div');
      divText.style.lineHeight = '100%';
      divText.style.fontSize = '20px';

      part.text.forEach((text: string) => {
        const p = this.renderer.createElement('p');
        const comment = this.renderer.createText(text + ' ');
        this.renderer.appendChild(p, comment);
        this.renderer.appendChild(divText, p);
      });
      this.renderer.appendChild(divPart, divText);
      part.element = divText;
    });
    this.renderer.appendChild(this.main.nativeElement, div);
  }

  generateViewChar(char: string, data: any) {
    switch (char) {
      case 'w':

        break;
      case 'h':

        break;

      case 'y':

        break;

      case 'n':

        break;

      case 'o':

        break;

      case 't':

        break;

      default:
        break;
    }
  }

  generateViewSpace(arr: Array<string>) {

  }

}
