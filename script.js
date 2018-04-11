//CIRCLE BAR
const allCanvasElements = (document.querySelectorAll('.canvas')); // canvasy mają pozycjonowanie absolutne dlatego offsetTop mają 0 ???
const allCanvasElementConatainers = document.querySelectorAll('.canvas-container');

window.onload = ()=>{
   allCanvasElements.forEach((el)=>{
       drawCircle(el);
   });

   window.addEventListener('scroll', ()=>{
      allCanvasElementConatainers.forEach((el)=>{
         if (window.scrollY + innerHeight >= el.offsetTop + (el.offsetHeight/2) && el.classList.contains('circle-bar-progress')){
            el.classList.remove('circle-bar-progress');
            fillBorder(el.children[0]);
         }
      })
   })
}

function drawCircle(canvas){ // funkcja rysuje obramowanie canvasa
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = '#e5e3e3';
    ctx.strokeStyle = '#e5e3e3';
    ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, 108, 0, 10*Math.PI);
    ctx.stroke();

}

function fillBorder(canvas){

    const color = canvas.getAttribute('data-color'); //zmieniający się kolor obramowania
    const numberToCount = canvas.getAttribute('data-number'); //numer do którego będziemy odliczać
    const numberToChange = canvas.parentElement.querySelector('span'); //numer zmienia od 0 do numberToCout podczas każdego wywołania funkcji

    let counter = 0;
    const start = 20; //jesli było by zero to obramowanie zacznie sie wypełniać od od godziny 3 na zegarze analogowym
    const ctx = canvas.getContext('2d');
    const interval = 2000/numberToCount;// odliczy całość w 2 sekundy

    const sim = setInterval(proggresSim, interval)

    function proggresSim(canvas){

        const diff = ((counter / 100) * Math.PI*2*10).toFixed(2);

        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, 106, start, diff/10+start);
        ctx.stroke();

        if(counter >= numberToCount){
            clearTimeout(sim);
        }
        numberToChange.textContent = counter;
        counter++;
    }
}


// TOGGLE MENU
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const links = document.querySelectorAll('nav ul li');

hamburger.addEventListener('click', menuToggle);

function menuToggle(){

    menu.classList.toggle('open');
    if(menu.classList.contains('open')){
        menu.style.transition = 'all 0.5s opacity 0.6s';
        hamburger.style.backgroundImage = 'url(images/close.png)';
        links.forEach((el)=> {
            el.style.transform = 'translateX(0)'; // elementy listy wjeżdżają po bokach
            el.style.transition = 'all 0.5s';
            el.style.transitionDelay = '0.4s'
        });
    } else {
        innerWidth >767.99 ? hamburger.style.backgroundImage = 'url(images/hamburger-white.png)' : hamburger.style.backgroundImage = 'url(images/hamburger.png)' ;
        links.forEach((el, i)=>{
            el.style.transition = 'all 0s';
            el.style.transitionDelay = 0;
            (i % 2 == 0) ? el.style.transform = 'translateX(120vw)' : el.style.transform = 'translateX(-120vw)';
        });
    }
}

// SMOOTH SCROLLING
links.forEach((el) => el.addEventListener("click", scrollTo));

function scrollTo(e) {

  e.preventDefault()

  const jumpTo = this.children[0].getAttribute('href');
  const distance = 20;
  const speed = 10;
  const targetY = document.querySelector(jumpTo).offsetTop;
  let currentY = window.pageYOffset;

  const animator = setInterval(function() {

    if (currentY <=targetY) {
      window.scroll(0, currentY += distance);
      if(currentY >= targetY) {
        window.scroll(0, targetY);
        clearInterval(animator);
        menu.classList.toggle('open');
        hamburger.style.backgroundImage = 'url(images/hamburger.png)';
      }
    } else if (currentY >= targetY) {
      window.scroll(0, currentY -= distance);
      if(currentY <= (targetY)) {
        window.scroll(0, targetY);
        clearInterval(animator);
      }
    }
  }, speed);
}


// LIGHTBOX
const projects = document.querySelectorAll('.project');
projects.forEach((el)=>{
   el.addEventListener('click', lightbox);
})

function lightbox(e){
   e.preventDefault();

   const projectsArr = [];
   projects.forEach((el) => projectsArr.push(el.children[0].getAttribute('src')));

   let currentIndex;
   projects.forEach((el, i) => el == this ? currentIndex = i : "");

   const lightbox = document.createElement('div');
   lightbox.classList.add('lightbox');
   
   const currentImage = document.createElement('img');
   currentImage.src =  projectsArr[currentIndex];
   currentImage.classList.add('current-image');
   currentImage.onclick = ()=> {
      document.body.removeChild(lightbox);
      window.removeEventListener('keydown', actionKey);
   };
   lightbox.appendChild(currentImage);

   const closeBtn = document.createElement('div');
   closeBtn.textContent = '+';
   closeBtn.classList.add('close-btn');
   closeBtn.onclick = ()=> {
      document.body.removeChild(lightbox);
      window.removeEventListener('keydown', actionKey);
   };
   lightbox.appendChild(closeBtn);

   const leftArrow = document.createElement('div');
   leftArrow.textContent = '<';

   leftArrow.addEventListener('click', moveLeft);

   leftArrow.classList = 'arrow left-arrow';
   lightbox.appendChild(leftArrow);

   const rightArrow = document.createElement('div');
   rightArrow.textContent = '>';
   rightArrow.addEventListener('click', moveRight);
   rightArrow.classList = 'arrow right-arrow';
   lightbox.appendChild(rightArrow);

   window.addEventListener('keydown', actionKey);
   document.body.appendChild(lightbox); 

   function moveRight(){
      if(currentIndex < projectsArr.length-1){
         currentIndex++;
         currentImage.src = projectsArr[currentIndex];
      } else{
         currentIndex = 0;
         currentImage.src = projectsArr[currentIndex];
      }
   }

   function moveLeft(){
      if(currentIndex > 0){
         currentIndex--;
         currentImage.src = projectsArr[currentIndex];
      } else{
         currentIndex = projectsArr.length-1;
         currentImage.src = projectsArr[currentIndex];
      }  
   }

   function actionKey (event) {
      if (event.keyCode == 39) {
         moveRight();
      } else if (event.keyCode == 37){
         moveLeft();
      }
   }
}
