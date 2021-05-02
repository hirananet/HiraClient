class barkitoEffect {

  // olas:
  olas = [];
  barkitos = [];
  moveInterval = 0;
  movingRight = true;
  effectON = false;
  creatorLine = true;

  barkitos = 0;

  createEffect() {
    const quantity = Math.ceil(window.innerWidth/70) + 2;
    for(let z = 2; z>=0; z--)
      for(let i = 0; i<quantity; i++) {
        this.olas.push(this.createOla((-100 - 50*z)+70*i, 180+50*z, z));
      }
    setInterval(() => this.move(), 100);
    this.effectON = true;
    setTimeout(() => {
      if(this.barkitos == 0) {
        this.clear();
      }
    }, 3000)
  }

  createOla(posX, posY, zetta) {
    const elem = document.createElement('img');
    elem.src = 'assets/eess/ola.png';
    elem.classList.add('cabritaEff');
    elem.style.top = (window.innerHeight - posY) + 'px';
    elem.style.width = '100px';
    elem.style.left = posX+'px';
    elem.setAttribute('posx', posX);
    elem.setAttribute('zetta', zetta);
    document.body.appendChild(elem);
    return elem;
  }

  clear() {
    this.effectON = false;
    this.olas.forEach(ola => {
      ola.remove();
    });
  }

  move() {
    if(this.movingRight) {
      if(this.moveInterval > 10) {
        this.movingRight = false;
      } else {
        this.moveInterval++;
      }
    } else {
      if(this.moveInterval < -10) {
        this.movingRight = true;
      } else {
        this.moveInterval--;
      }
    }
    this.olas.forEach((elem) => {
      if(elem.getAttribute('zetta') == 1) {
        elem.style.left = (parseInt(elem.getAttribute('posx')) - this.moveInterval)+'px';
      } else {
        elem.style.left = (parseInt(elem.getAttribute('posx')) + this.moveInterval)+'px';
      }
    });
  }

  createBarkito(posX, posY) {
    const elem = document.createElement('img');
    const barcoNumero = Math.round(Math.random() * 3) + 1
    elem.src = 'assets/eess/barco'+barcoNumero+'.png';
    elem.classList.add('cabritaEff', 'hidden');
    elem.style.top = (window.innerHeight - posY) + 'px';
    elem.style.width = '150px';
    elem.style.left = posX+'px';
    elem.setAttribute('posx', posX);
    elem.setAttribute('posy', window.innerHeight - posY);
    document.body.appendChild(elem);
    return elem;
  }

  addBarkito() {
    if(!this.effectON) return;
    this.barkitos++;
    let initialY = 400;
    if(this.creatorLine) {
      initialY = 350;
    }
    this.creatorLine = !this.creatorLine;
    let barkito = this.createBarkito(10, initialY);
    let iterations = 0;
    const barkitoEffDown = setInterval(() => {
      barkito.style.top = (parseInt(barkito.getAttribute('posy')) + 5*iterations) + 'px';
      if(iterations == 0) {
        barkito.classList.add('barkito')
      }
      iterations++;
      if(iterations > 20) {
        clearInterval(barkitoEffDown);
        barkito.classList.add('oleaje');
        iterations = 0;
        const movement = setInterval(() => {
          iterations++;
          barkito.style.left = (parseInt(barkito.getAttribute('posx')) + 3*iterations) + 'px';
          if(iterations > window.innerWidth/3) {
            clearInterval(movement);
            barkito.remove();
            this.barkitos--;
            if(this.barkitos == 0) {
              this.clear();
            }
          }
        }, 50)
      }
    }, 50);
  }

}

const beff = new barkitoEffect();

function startEventEffectBarkito() {
  beff.createEffect();
}

function addBarkitoEffect() {
  beff.addBarkito();
}

