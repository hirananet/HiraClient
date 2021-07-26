class barkitoEffect {

  // olas:
  olas = [];
  barkitos = [];
  moveInterval = 0;
  movingRight = true;
  effectON = false;
  creatorLine = true;

  barkitos = 0;
  objectPool = [];

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
    }, 4000)
  }

  createOla(posX, posY, zetta) {
    const elem = document.createElement('img');
    elem.src = 'assets/eess/ola.png';
    elem.classList.add('cabritaEff');
    elem.classList.add('olitasEff');
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
    this.barkitos
    this.objectPool.forEach(elem => {
      elem.remove();
    });
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

  createBarkito(posX, posY, spawner) {
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
    const label = document.createElement('div');
    label.classList.add('barkitoLabel');
    label.style.left = elem.style.left;
    label.style.top = elem.style.top;
    label.innerHTML = 'Barkito de '+spawner;
    document.body.appendChild(label);
    this.objectPool.push(elem);
    this.objectPool.push(label);
    return [elem, label];
  }

  async getRandomVel(spawner) {
    // traer desde el backend de thira
    const response = await fetch(`https://thira.tandilserver.com/nick-data/velocity?nick=${spawner}`);
    const data = await response.text();
    return parseFloat(data);
  }

  addBarkito(spawner) {
    if(!this.effectON) return;
    this.barkitos++;
    let initialY = 400;
    if(this.creatorLine) {
      initialY = 350;
    }
    this.creatorLine = !this.creatorLine;
    const parts = this.createBarkito(10, initialY, spawner);
    const barkito = parts[0];
    const label = parts[1];
    let iterations = 0;
    const barkitoEffDown = setInterval(() => {
      barkito.style.top = (parseInt(barkito.getAttribute('posy')) + 5*iterations) + 'px';
      label.style.top = (parseInt(barkito.getAttribute('posy')) + 5*iterations - 20) + 'px';
      if(iterations == 0) {
        barkito.classList.add('barkito')
      }
      iterations++;
      if(iterations > 20) {
        clearInterval(barkitoEffDown);
        barkito.classList.add('oleaje');
        iterations = 0;
        this.getRandomVel(spawner).then(vel => {
          const movement = setInterval(() => {
            iterations++;
            barkito.style.left = (parseInt(barkito.getAttribute('posx')) + vel*iterations) + 'px';
            label.style.left = barkito.style.left;
            if(iterations*vel > window.innerWidth) {
              clearInterval(movement);
              barkito.remove();
              label.remove();
              this.barkitos--;
              if(this.barkitos == 0) {
                this.clear();
              }
            }
          }, 50)
        });
      }
    }, 50);
  }

}

const beff = new barkitoEffect();

function startEventEffectBarkito() {
  beff.createEffect();
}

function addBarkitoEffect(playerName) {
  beff.addBarkito(playerName);
}

function stopBarkitoEff() {
  beff.clear();
}
