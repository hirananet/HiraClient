class gatosPerrosEffect {

  cantidadCadaLado = 10;

  cabritasDCHA = [];
  cabritasIZQDA = [];

  createEffect(izqIMG, dchaIMG) {
    for(let i = 0; i<this.cantidadCadaLado; i++) {
      const elem = document.createElement('img');
      elem.src = izqIMG;
      elem.classList.add('cabritaEff');
      elem.style.top = '0px';
      elem.style.width = '100px';
      this.cabritasDCHA.push(elem);
      document.body.appendChild(elem);
    }
    for(let i = 0; i<this.cantidadCadaLado; i++) {
      const elem = document.createElement('img');
      elem.src = dchaIMG;
      elem.classList.add('cabritaEff');
      elem.style.top = '0px';
      elem.style.width = '100px';
      this.cabritasIZQDA.push(elem);
      document.body.appendChild(elem);
    }
    this.initialPositionGoats();
    this.startMovement();
  }

  initialPositionGoats() {
    this.cabritasDCHA.forEach(cabrita => this.posCabrita(cabrita, true));
    this.cabritasIZQDA.forEach(cabrita => this.posCabrita(cabrita, false))
  }

  posCabrita(cabrita, right) {
    const maxY = window.innerHeight - 150;
    const y = this.getRandomInt(maxY);
    let rotation = '0deg';
    const pos = Math.ceil(Math.random() * 300 + 100);
    if(!right) {
      rotation = '180deg';
      cabrita.style.left = '-'+pos+'px';
      cabrita.setAttribute('right', true);
    } else {
      cabrita.style.right = '-'+pos+'px';
      cabrita.setAttribute('right', false);
    }
    cabrita.setAttribute('posX', pos);
    cabrita.setAttribute('posY', y);
    const direction = this.getRandomInt(20, -20);
    cabrita.setAttribute('direction', right ? direction + 90 : direction + 90);
    cabrita.style.transform = 'rotateZ(' + (direction*-1) + 'deg)';
    cabrita.style.top = y + 'px';
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
      this.cabritasDCHA.forEach(cabrita => {
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
      this.cabritasIZQDA.forEach(cabrita => {
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
    this.cabritasDCHA.forEach(cabrita => {
      cabrita.remove();
    });
    this.cabritasIZQDA.forEach(cabrita => {
      cabrita.remove();
    });
  }

}

function startEventEffectGatosPerros() {
  const ceff = new gatosPerrosEffect();
  ceff.createEffect('assets/eess/cat.png', 'assets/eess/dog.png');
}
