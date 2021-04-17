const drops = document.getElementById('drops');
const borders = document.getElementById('borders')
drops.innerHTML = '';
borders.innerHTML = '';
for(let i = 0; i < 251; i++) {
  const drop = document.createElement('div');
  drop.classList.add('raindrop');
  const posY = Math.ceil(Math.random() * window.innerHeight);
  const posX = Math.ceil(Math.random() * window.innerWidth);
  // drop.style.top = posY + 'px';
  // drop.style.left = posX + 'px';
  drops.appendChild(drop);
  const border = document.createElement('div');
  // border.style.top = posY + 'px';
  // border.style.left = posX + 'px';
  border.classList.add('border');
  borders.appendChild(border);
}
