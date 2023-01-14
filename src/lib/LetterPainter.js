export default class WordPainter {

  constructor(canvasEl) {
    this.canvasContext = canvasEl.getContext('2d');
    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.clientHeight;

    this.canvasContext.textAlign = 'center';
    this.canvasContext.textBaseline = 'middle'
    this.canvasContext.lineWidth = 2;
    this.canvasContext.strokeStyle = '#9E9EA1';
  }

  rollCall() {
    const abcs = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const nLetters = abcs.length;
    let index = 0;
    const call = () => {
      let echoStepCount = 0;
      const fontSizes = [200, 900, 2000] 
      const echoStep = () => {
        this.canvasContext.font = `${fontSizes[echoStepCount]}px sans-serif`;
        this.clearCanvas();
        this.canvasContext.strokeText(abcs[index], ...this.canvasCentre());
        if (echoStepCount < 2) {
          echoStepCount += 1;
          setTimeout(() => {
            requestAnimationFrame(echoStep);
          }, 500);
        } else {
          setTimeout(() => { this.clearCanvas() }, 500);
          if (index < nLetters - 1) {
            index += 1;
            setTimeout(() => {
              requestAnimationFrame(call);
            }, 1000);
          }
        } 
      }
      echoStep();
    }
    call();
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  canvasCentre() {
    return [this.canvasWidth / 2, this.canvasHeight / 2];
  }
}