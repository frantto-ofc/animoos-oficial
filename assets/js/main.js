/* ==========================================================================
   ANIMOOS — comportamento da página
   ========================================================================== */

/* ---- ÚNICO PONTO DE CONFIGURAÇÃO ---------------------------------------
   Troque o número e a mensagem abaixo pelos dados reais de atendimento.
   Formato do número: 55 + DDD + telefone, só dígitos.
------------------------------------------------------------------------- */
const CONTATO = {
  whatsapp: '5512996841013',
  mensagem: 'Olá! Vim pelo site e quero fazer um pedido Animoos.'
};

const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- sabores ------------------------------------------------------------ */
const SABORES = [
  { id:'melancia', nome:'Melancia',   cor:'#e4202b',
    texto:'Leve, refrescante e cheia de personalidade. Um sabor vibrante para combinações descontraídas e momentos que pedem frescor.' },
  { id:'maca',     nome:'Maçã Verde', cor:'#86b81e',
    texto:'Marcante, moderna e levemente ácida. Para bebidas que precisam de mais presença desde o primeiro gole.' },
  { id:'morango',  nome:'Morango',    cor:'#e32b3d',
    texto:'Doce, envolvente e visualmente irresistível. Um clássico que deixa qualquer combinação mais especial.' },
  { id:'uva',      nome:'Uva',        cor:'#7d1fa3',
    texto:'Intensa, divertida e impossível de passar despercebida. Ideal para bebidas com cor, energia e atitude.' },
  // o coco é o único cujo gelo não tem a cor da tarja: o produto é branco
  { id:'coco',     nome:'Coco',       cor:'#8e3a1c', liquido:'#f4f7f4',
    texto:'Suave, tropical e surpreendente. O sabor certo para criar uma experiência mais leve e refrescante.' },
  { id:'maracuja', nome:'Maracujá',   cor:'#ee9612',
    texto:'Aromático, equilibrado e cheio de brasilidade. Perfeito para quem gosta de frescor com personalidade.' }
];

/* ========================================================================
   links de WhatsApp
   ======================================================================== */
function ligarWhatsApp(){
  const url = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(CONTATO.mensagem)}`;
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/* ========================================================================
   quebra de texto para animação
   ======================================================================== */
function quebrarLinhas(el){
  const texto = el.textContent.trim();
  const palavras = texto.split(/\s+/);
  el.textContent = '';

  // mede onde cada linha quebra de fato, depois reagrupa
  const marcadores = palavras.map(p => {
    const s = document.createElement('span');
    s.textContent = p + ' ';
    s.style.display = 'inline-block';
    el.appendChild(s);
    return s;
  });

  const linhas = [];
  let topoAtual = null;
  marcadores.forEach(s => {
    const topo = Math.round(s.offsetTop);
    if (topo !== topoAtual){ linhas.push([]); topoAtual = topo; }
    linhas[linhas.length - 1].push(s.textContent);
  });

  el.textContent = '';
  return linhas.map(palavrasDaLinha => {
    const linha = document.createElement('span');
    linha.className = 'line';
    const interno = document.createElement('span');
    interno.textContent = palavrasDaLinha.join('').trim();
    linha.appendChild(interno);
    el.appendChild(linha);
    return interno;
  });
}

function animarTitulos(){
  document.querySelectorAll('[data-split]').forEach(el => {
    const internos = quebrarLinhas(el);
    if (reduzMovimento) return;

    gsap.set(internos, { yPercent: 108 });
    gsap.to(internos, {
      yPercent: 0,
      duration: 1.05,
      ease: 'power3.out',
      stagger: 0.075,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
}

/* ========================================================================
   headline do hero — digitação
   ======================================================================== */
function animarDigitacao(){
  const titulo = document.querySelector('[data-type]');
  if (!titulo) return;

  const fantasma = titulo.querySelector('.type-ghost');
  const saida    = titulo.querySelector('.type-out');
  const texto    = fantasma.textContent.trim();

  if (reduzMovimento){ saida.textContent = texto; return; }

  // nó de texto separado para o cursor continuar sempre no fim
  const escrito = document.createTextNode('');
  const cursor  = document.createElement('span');
  cursor.className = 'type-caret';
  cursor.setAttribute('aria-hidden', 'true');
  saida.append(escrito, cursor);

  let i = 0;
  const passo = () => {
    escrito.nodeValue = texto.slice(0, ++i);
    if (i < texto.length){
      // pausa maior na pontuação dá cadência de digitação humana
      const c = texto[i - 1];
      setTimeout(passo, c === ',' || c === '.' ? 190 : 26 + Math.random() * 34);
    } else {
      titulo.classList.add('is-typed');
    }
  };
  setTimeout(passo, 260);
}

/* ========================================================================
   revelações simples
   ======================================================================== */
function animarReveals(){
  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (reduzMovimento){ el.style.opacity = 1; el.style.transform = 'none'; return; }
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  // linhas da seção Experiência
  document.querySelectorAll('[data-lines] i').forEach((el, i) => {
    if (reduzMovimento) return;
    gsap.set(el, { yPercent: 110 });
    gsap.to(el, {
      yPercent: 0, duration: 1, ease: 'power3.out', delay: i * .06,
      scrollTrigger: { trigger: el.closest('[data-lines]'), start: 'top 82%' }
    });
  });
}

/* ========================================================================
   manifesto — palavra a palavra
   ======================================================================== */
function animarManifesto(){
  const bloco = document.querySelector('[data-words]');
  if (!bloco) return;

  bloco.querySelectorAll('p').forEach(p => {
    const palavras = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    palavras.forEach(palavra => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = palavra;
      p.appendChild(s);
      p.appendChild(document.createTextNode(' '));
    });
  });

  if (reduzMovimento) return;

  const todas = bloco.querySelectorAll('.w');
  gsap.set(todas, { opacity: .12 });
  gsap.to(todas, {
    opacity: 1,
    ease: 'none',
    stagger: .5,
    scrollTrigger: {
      trigger: bloco,
      start: 'top 74%',
      end: 'bottom 62%',
      scrub: .6
    }
  });
}

/* ========================================================================
   tickers
   ======================================================================== */
function animarTickers(){
  document.querySelectorAll('[data-ticker]').forEach(faixa => {
    const trilho = faixa.querySelector('.ticker-track');
    const direcao = parseInt(faixa.dataset.ticker, 10) || 1;
    const original = trilho.innerHTML;

    // duplica até cobrir três larguras de tela
    while (trilho.scrollWidth < window.innerWidth * 3){
      trilho.innerHTML += original;
    }

    if (reduzMovimento) return;

    const largura = trilho.scrollWidth / 2;
    gsap.set(trilho, { x: direcao < 0 ? 0 : -largura });
    gsap.to(trilho, {
      x: direcao < 0 ? -largura : 0,
      duration: 34,
      ease: 'none',
      repeat: -1
    });
  });
}

/* ========================================================================
   SABORES — o copo que enche  (elemento-assinatura da página)
   ======================================================================== */
function montarCopo(){
  const palco     = document.querySelector('#glassStage');
  if (!palco) return;

  const liquido   = palco.querySelector('#glassLiquid');
  const nome      = palco.querySelector('#glassName');
  const descricao = palco.querySelector('#glassDesc');
  const indice    = palco.querySelector('#glassIdx');
  const progresso = palco.querySelector('#glassProgress');
  const packs     = palco.querySelectorAll('#glassPack img');
  const bolhas    = palco.querySelector('#glassBubbles');

  // bolhas subindo — o movimento ascendente do isotipo
  for (let i = 0; i < 14; i++){
    const b = document.createElement('i');
    b.style.left            = 8 + Math.random() * 84 + '%';
    b.style.width = b.style.height = 3 + Math.random() * 5 + 'px';
    b.style.animationDuration = 3.5 + Math.random() * 4 + 's';
    b.style.animationDelay    = Math.random() * 6 + 's';
    bolhas.appendChild(b);
  }

  // marcadores laterais
  SABORES.forEach((sabor, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.name = sabor.nome;
    b.setAttribute('aria-label', `Ir para o sabor ${sabor.nome}`);
    b.addEventListener('click', () => {
      const alvo = palco.offsetTop + (palco.offsetHeight * (i / SABORES.length));
      window.lenis ? window.lenis.scrollTo(alvo) : window.scrollTo({ top: alvo });
    });
    progresso.appendChild(b);
  });
  const marcadores = progresso.querySelectorAll('button');

  let atual = -1;

  function mostrar(i){
    if (i === atual) return;
    atual = i;
    const sabor = SABORES[i];

    palco.style.setProperty('--flavor', sabor.cor);
    palco.style.setProperty('--liquid', sabor.liquido || sabor.cor);

    // nome com máscara
    const interno = nome.querySelector('.gn-line > span');
    if (reduzMovimento){
      interno.textContent = sabor.nome;
    } else {
      // uma troca por vez: um scroll rápido não pode deixar o nome parado fora da máscara
      gsap.killTweensOf(interno);
      gsap.timeline()
        .to(interno, { yPercent: -108, duration: .34, ease: 'power2.in' })
        .add(() => { interno.textContent = sabor.nome; })
        .fromTo(interno, { yPercent: 108 }, { yPercent: 0, duration: .55, ease: 'power3.out' });
    }

    descricao.textContent = sabor.texto;
    indice.textContent = String(i + 1).padStart(2, '0') + ' / 06';

    packs.forEach(p => p.classList.toggle('is-active', p.dataset.flavor === sabor.id));
    marcadores.forEach((m, k) => m.classList.toggle('is-on', k === i));
  }

  mostrar(0);

  if (reduzMovimento){
    liquido.style.height = '72%';
    return;
  }

  ScrollTrigger.create({
    trigger: palco,
    start: 'top top',
    end: () => '+=' + (window.innerHeight * SABORES.length),
    pin: true,
    scrub: true,
    anticipatePin: 1,
    onUpdate(self){
      // líquido sobe de 8% a 88% ao longo de toda a seção
      liquido.style.height = (8 + self.progress * 80).toFixed(2) + '%';

      const i = Math.min(SABORES.length - 1, Math.floor(self.progress * SABORES.length));
      mostrar(i);
    }
  });
}

/* ========================================================================
   cards empilhados — escala decrescente conforme empilha
   ======================================================================== */
function animarPilha(){
  const cards = gsap.utils.toArray('[data-stack]');
  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 82%',
      onEnter: () => card.classList.add('is-in')
    });

    if (reduzMovimento || i === cards.length - 1) return;

    gsap.to(card, {
      scale: 1 - (cards.length - i) * .012,
      filter: 'brightness(.72)',
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top 14%',
        end: () => '+=' + (card.offsetHeight * 1.4),
        scrub: true
      }
    });
  });
}

/* ========================================================================
   embalagem flutuante — respiro contínuo + deriva no scroll
   ======================================================================== */
function animarFlutuante(){
  document.querySelectorAll('[data-float]').forEach(el => {
    if (reduzMovimento) return;

    gsap.to(el, {
      y: -24, rotation: -4,
      duration: 3.4, ease: 'sine.inOut',
      yoyo: true, repeat: -1
    });

    gsap.fromTo(el,
      { yPercent: 10 },
      {
        yPercent: -10, ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top bottom', end: 'bottom top', scrub: 1
        }
      }
    );
  });
}

/* ========================================================================
   reel — o scroll controla o tempo do vídeo
   ======================================================================== */
function animarVideoScroll(){
  const video  = document.querySelector('#reelVideo');
  const secao  = document.querySelector('.reel');
  if (!video || !secao) return;

  video.pause();
  video.muted = true;
  video.volume = 0.3;   // 70% abaixo do volume cheio

  const tag = document.querySelector('#reelTag');
  let somAtivadoPeloScroll = false;

  /* Celulares não disparam `wheel`. Neles, o reel vira um vídeo silencioso
     normal: toca apenas enquanto está visível e não depende do scrub para
     revelar o primeiro quadro. O áudio continua exclusivo do mouse/desktop. */
  const experienciaTouch = window.matchMedia('(max-width: 860px), (hover: none), (pointer: coarse)').matches;

  if (experienciaTouch){
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (tag){
      const traco = tag.querySelector('span');
      tag.replaceChildren(...(traco ? [traco] : []), document.createTextNode('Veja os sabores em movimento'));
    }

    const tocarSilencioso = () => {
      video.muted = true;
      video.play().then(() => tag?.classList.add('is-off')).catch(() => {
        tag?.classList.remove('is-off');
      });
    };

    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting){
        tocarSilencioso();
      } else {
        video.pause();
        tag?.classList.remove('is-off');
      }
    }, { threshold: 0.25 });

    observador.observe(secao);
    secao.addEventListener('touchstart', tocarSilencioso, { passive: true });
    return;
  }

  // O áudio só é habilitado por uma rolagem do mouse enquanto o reel está
  // ocupando a tela. Cliques e teclas em outras partes da página não o liberam.
  const reelEstaAtivo = () => {
    const limites = secao.getBoundingClientRect();
    return limites.top <= 0 && limites.bottom >= window.innerHeight;
  };

  const ativarSomPeloScroll = () => {
    if (!reelEstaAtivo()) return;
    somAtivadoPeloScroll = true;
    video.muted = false;
    video.volume = 0.3;
    tag?.classList.add('is-off');

    // Faz a primeira tentativa no próprio gesto da roda. Assim o navegador
    // pode autorizar o áudio antes de o ScrollTrigger pausar para fazer o seek.
    video.play().catch(erro => {
      if (erro?.name === 'AbortError') return;
      somAtivadoPeloScroll = false;
      video.muted = true;
      tag?.classList.remove('is-off');
    });
  };

  const ligar = () => {
    const duracao = video.duration;
    if (!duracao || !isFinite(duracao)) return;

    if (reduzMovimento){ video.currentTime = duracao / 2; return; }

    window.addEventListener('wheel', ativarSomPeloScroll, { passive: true, capture: true });

    let alvo = 0;
    let pendente = false;
    let ocioso = null;

    // parado dentro da seção, o vídeo toca com som; ao rolar, volta a ser scrub
    // com loop no elemento o vídeo reinicia sozinho, então não há fim para travar
    const tocar = () => {
      if (!somAtivadoPeloScroll || !reelEstaAtivo()) return;
      video.play().catch(() => {
        // Mantém o reel funcional mesmo quando o navegador bloqueia áudio
        // automático; uma nova rolagem dentro da seção tentará novamente.
        video.muted = true;
        video.play().catch(() => {});
      });
    };

    // o seek roda no próprio rAF: pedir vários por quadro trava a decodificação
    const aplicar = () => {
      pendente = false;
      if (video.readyState >= 2) video.currentTime = alvo;
    };

    ScrollTrigger.create({
      trigger: secao,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate(self){
        alvo = Math.min(duracao - 0.05, Math.max(0, self.progress * duracao));
        if (!pendente){ pendente = true; requestAnimationFrame(aplicar); }

        video.pause();
        clearTimeout(ocioso);
        ocioso = setTimeout(tocar, 260);
      },
      onLeave(){
        video.pause();
        video.muted = true;
        somAtivadoPeloScroll = false;
        tag?.classList.remove('is-off');
        clearTimeout(ocioso);
      },
      onLeaveBack(){
        video.pause();
        video.muted = true;
        somAtivadoPeloScroll = false;
        tag?.classList.remove('is-off');
        clearTimeout(ocioso);
      }
    });

    ScrollTrigger.refresh();
  };

  video.readyState >= 1 ? ligar() : video.addEventListener('loadedmetadata', ligar, { once: true });
}

/* ========================================================================
   rodízio de embalagens — uma dá lugar à outra
   ======================================================================== */
function alternarEmbalagens(){
  document.querySelectorAll('[data-cluster]').forEach(caixa => {
    const imagens = [...caixa.querySelectorAll('img')];
    if (!imagens.length) return;

    if (reduzMovimento){
      gsap.set(imagens, { opacity: 1 });
      return;
    }

    // entram uma após a outra
    gsap.fromTo(imagens,
      { opacity: 0, y: 54, scale: .82 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 1, ease: 'back.out(1.4)',
        stagger: .17,
        scrollTrigger: { trigger: caixa.closest('section'), start: 'top 68%' },
        onComplete(){
          // flutuação contínua: yPercent e rotation não colidem com o y/scale da entrada
          imagens.forEach(img => {
            gsap.to(img, {
              yPercent: -6 - Math.random() * 6,
              rotation: (Math.random() > .5 ? 1 : -1) * (2 + Math.random() * 2),
              duration: 2.8 + Math.random() * 1.8,
              ease: 'sine.inOut',
              yoyo: true, repeat: -1,
              delay: Math.random() * 1.2
            });
          });
        }
      }
    );
  });
}

/* ========================================================================
   parallax nas fotos
   ======================================================================== */
function animarParallax(){
  if (reduzMovimento) return;
  gsap.utils.toArray('[data-parallax]').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -6 },
      {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  });
}

/* ========================================================================
   contador
   ======================================================================== */
function animarContador(){
  document.querySelectorAll('[data-count]').forEach(el => {
    const alvo = parseInt(el.dataset.count, 10);
    const formatar = n => Math.round(n).toLocaleString('pt-BR');

    if (reduzMovimento){ el.textContent = formatar(alvo); return; }

    const estado = { n: 0 };
    gsap.to(estado, {
      n: alvo,
      duration: 2.4,
      ease: 'power3.out',
      onUpdate(){ el.textContent = formatar(estado.n); },
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });
}

/* ========================================================================
   nav — esconde ao descer, mostra ao subir
   ======================================================================== */
function comportamentoNav(){
  const nav = document.querySelector('#nav');
  let ultimo = 0;

  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate(self){
      const y = self.scroll();
      nav.classList.toggle('is-stuck', y > 80);
      nav.classList.toggle('is-hidden', y > ultimo && y > 420);
      ultimo = y;
    }
  });
}

/* ========================================================================
   botões magnéticos
   ======================================================================== */
function botoesMagneticos(){
  if (reduzMovimento || window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    const forca = 0.28;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - (r.left + r.width / 2)) * forca,
        y: (e.clientY - (r.top + r.height / 2)) * forca,
        duration: .6, ease: 'power3.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' });
    });
  });
}

/* ========================================================================
   hero — partículas subindo (movimento ascendente do isotipo)
   ======================================================================== */
function fundoHero(){
  const canvas = document.querySelector('#frost');
  if (!canvas || reduzMovimento) return;

  const ctx = canvas.getContext('2d');
  let largura, altura, particulas, animacao;

  function dimensionar(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = canvas.clientWidth;
    altura  = canvas.clientHeight;
    canvas.width  = largura * dpr;
    canvas.height = altura * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const quantidade = Math.round((largura * altura) / 26000);
    particulas = Array.from({ length: quantidade }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      r: Math.random() * 1.7 + .4,
      v: Math.random() * .28 + .07,
      o: Math.random() * .4 + .1
    }));
  }

  function desenhar(){
    ctx.clearRect(0, 0, largura, altura);
    for (const p of particulas){
      p.y -= p.v;
      if (p.y < -6){ p.y = altura + 6; p.x = Math.random() * largura; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,107,${p.o})`;
      ctx.fill();
    }
    animacao = requestAnimationFrame(desenhar);
  }

  dimensionar();
  desenhar();
  window.addEventListener('resize', dimensionar);

  // pausa quando o hero sai da tela
  new IntersectionObserver(([entrada]) => {
    if (entrada.isIntersecting){ if (!animacao) desenhar(); }
    else { cancelAnimationFrame(animacao); animacao = null; }
  }).observe(canvas);
}

/* ========================================================================
   scroll suave
   ======================================================================== */
function scrollSuave(){
  if (reduzMovimento || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  window.lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const alvo = document.querySelector(a.getAttribute('href'));
      if (!alvo) return;
      e.preventDefault();
      lenis.scrollTo(alvo, { offset: -70 });
    });
  });
}

/* ========================================================================
   preloader
   ======================================================================== */
function preloader(){
  const loader = document.querySelector('#loader');
  const barra  = document.querySelector('#loaderBar');
  const imagens = [...document.images];
  let carregadas = 0;

  const passo = () => {
    carregadas++;
    barra.style.width = Math.min(100, (carregadas / Math.max(imagens.length, 1)) * 100) + '%';
  };

  imagens.forEach(img => {
    if (img.complete) passo();
    else { img.addEventListener('load', passo); img.addEventListener('error', passo); }
  });

  let encerrado = false;
  const encerrar = () => {
    if (encerrado) return;
    encerrado = true;
    barra.style.width = '100%';
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    ScrollTrigger.refresh();
    animarDigitacao();
  };

  // não trava a página se alguma imagem demorar
  window.addEventListener('load', () => setTimeout(encerrar, 250));
  setTimeout(encerrar, 3500);
}

/* ========================================================================
   arranque
   ======================================================================== */
function iniciar(){
  gsap.registerPlugin(ScrollTrigger);

  ligarWhatsApp();
  document.querySelector('#year').textContent = new Date().getFullYear();

  scrollSuave();
  animarTitulos();
  animarReveals();
  animarManifesto();
  animarTickers();
  montarCopo();
  animarPilha();
  animarFlutuante();
  alternarEmbalagens();
  animarVideoScroll();
  animarParallax();
  animarContador();
  comportamentoNav();
  botoesMagneticos();
  fundoHero();
  preloader();

  setTimeout(() => document.querySelector('#wa').classList.add('is-in'), 1400);

  // recalcula quando as fontes assentam (as quebras de linha mudam)
  if (document.fonts && document.fonts.ready){
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', iniciar)
  : iniciar();
