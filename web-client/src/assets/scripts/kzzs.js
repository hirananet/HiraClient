class KzzsEffect {
  cantidadKzzs = 50;
  kzzs = [];

  createEffect() {
    for(let i = 0; i<this.cantidadKzzs; i++) {
      const elem = document.createElement('img');
      elem.src = 'assets/faces/kiss.png';
      elem.style.top = '-150px';
      elem.style.width = '100px';
      elem.style.position = 'fixed';
      this.kzzs.push(elem);
      document.body.appendChild(elem);
    }
    this.initialPositionKzzs();
  }

  initialPositionKzzs() {
    const maxY = window.innerHeight - 200;
    const maxX = window.innerWidth;
    let time = 150;
    this.kzzs.forEach(kzz => {
      setTimeout(() => {
        const posY = this.getRandomInt(maxY);
        const posX = this.getRandomInt(maxX);
        kzz.style.top = posY + 'px';
        kzz.style.left = posX + 'px';
        kzz.classList.add('kzzsEff');
        setTimeout(() => {
          kzz.remove();
        }, 1500);
      }, time);
      time += 75;
    });
  }

  getRandomInt(max, min) {
    min = min ? min : 0;
    return Math.floor(Math.random() * (max - min)) + min;
  }

}

function startEventEffectKz2s() {
  const ceff = new KzzsEffect();
  ceff.createEffect();
}
