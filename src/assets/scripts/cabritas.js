
class cabritasEffect {

  cantidadCabras = 10;

  cabritas = [];
  cabritaB;

  createEffect() {
    for(let i = 0; i<this.cantidadCabras; i++) {
      const elem = document.createElement('img');
      elem.src = 'assets/eess/cabrita.png';
      elem.classList.add('cabritaEff');
      elem.style.top = '0px';
      elem.style.width = '100px';
      this.cabritas.push(elem);
      document.body.appendChild(elem);
    }
    const elem = document.createElement('img');
    elem.src = 'assets/eess/cabritab.png';
    elem.classList.add('cabritaEff');
    elem.style.top = '0px';
    elem.style.width = '100px';
    this.cabritaB = elem;
    document.body.appendChild(elem);
    this.initialPositionGoats();
    this.startMovement();
  }

  initialPositionGoats() {
    const maxY = window.innerHeight - 150;

    const right = Math.random() > 0.5;
    let rotation = '0deg';
    if(!right) {
      rotation = '180deg';
      this.cabritaB.style.left = '-100px';
      this.cabritaB.setAttribute('right', true);
    } else {
      this.cabritaB.style.right = '-100px';
      this.cabritaB.setAttribute('right', false);
    }
    this.cabritaB.setAttribute('posX', 0);
    this.cabritaB.style.top = (window.innerHeight / 2) + 'px';
    this.cabritaB.setAttribute('posY', this.cabritaB.style.top);
    this.cabritaB.style.transform = 'rotateY('+rotation+')';

    this.cabritas.forEach(cabrita => {
      const y = this.getRandomInt(maxY);
      const right = Math.random() > 0.5;
      let rotation = '0deg';
      if(!right) {
        rotation = '180deg';
        cabrita.style.left = '-100px';
        cabrita.setAttribute('right', true);
      } else {
        cabrita.style.right = '-100px';
        cabrita.setAttribute('right', false);
      }
      cabrita.setAttribute('posX', 0);
      cabrita.setAttribute('posY', y);
      const direction = this.getRandomInt(40, -20);
      cabrita.setAttribute('direction', right ? direction + 90 : direction + 90);
      cabrita.style.transform = 'rotateY('+rotation+') rotateZ(' + (direction*-1) + 'deg)';
      cabrita.style.top = y + 'px';
    });
  }

  getRandomInt(max, min) {
    min = min ? min : 0;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  startMovement() {
    let iterations = 0;
    let intervalRef = setInterval(() => {
      iterations++;
      let opacity = 1;
      if(iterations > 340) {
        opacity = (380-iterations) / 40;
        if(opacity < 0) {
          opacity = 0;
        }
      }
      this.cabritas.forEach(cabrita => {
        const point = this.calcNewPoint(parseFloat(cabrita.getAttribute('posX')), parseFloat(cabrita.getAttribute('posY')), parseInt(cabrita.getAttribute('direction')), 5);
        cabrita.setAttribute('posX', point.x);
        cabrita.setAttribute('posY', point.y);
        cabrita.style.top = point.y + 'px';
        cabrita.style.opacity = opacity;
        if(cabrita.getAttribute('right') == 'true') {
          cabrita.style.left = point.x + 'px';
        } else {
          cabrita.style.right = point.x + 'px';
        }
      });
      // black goat
      const newX = parseFloat(this.cabritaB.getAttribute('posX'))+4;
      this.cabritaB.setAttribute('posX', newX);
      if(this.cabritaB.getAttribute('right') == 'true') {
        this.cabritaB.style.left = newX + 'px';
      } else {
        this.cabritaB.style.right = newX + 'px';
      }
      this.cabritaB.style.opacity = opacity;
      if(iterations > 380) {
        clearInterval(intervalRef);
        this.clearCabritas();
      }
    }, 20)
  }

  calcNewPoint(xOrigin, yOrigin, angle, length) {
    const out = {};
    angle = angle - 90;
    if(angle == 0 || length == 0) {
        out.x = xOrigin + length;
        out.y = yOrigin;
    } else {
        angle = angle * Math.PI / 180;
        out.x = length * Math.cos(angle) + xOrigin;
        out.y = length * Math.sin(angle) + yOrigin;
    }
    return out;
  }

  clearCabritas() {
    this.cabritas.forEach(cabrita => {
      cabrita.remove();
    });
    this.cabritaB.remove();
  }

}

function startEventEffectCabritas() {
  const ceff = new cabritasEffect();
  ceff.createEffect();
}
