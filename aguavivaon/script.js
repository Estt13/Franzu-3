// --- CONFIGURAÇÃO DO MAR VIVO (CANVAS) ---
const canvas = document.getElementById('ocean');
const ctx = canvas.getContext('2d');
const cameraPreview = document.getElementById('camera-preview');
let cameraStream = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Inicializar câmera frontal
async function initCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'user',
                width: { ideal: window.innerWidth },
                height: { ideal: window.innerHeight }
            },
            audio: false
        });
        cameraPreview.srcObject = cameraStream;
        // Deixa a câmera rodando em background mas não mostra
    } catch (error) {
        console.warn('Câmera não disponível:', error);
        // Continua sem câmera se não conseguir acessar
    }
}

// Iniciar câmera quando página carregar
window.addEventListener('load', initCamera);

// Partículas de água (plâncton/bolhas)
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 4 + 1,
        density: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.3
    });
}

function drawOcean() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha plâncton brilhante
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 180, 216, ${p.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00b4d8';
        ctx.fill();
        
        // Movimento suave para cima
        p.y -= p.density * 0.5;
        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }
    });
    ctx.shadowBlur = 0; // Reseta shadow
    requestAnimationFrame(drawOcean);
}
drawOcean();

// --- CONTROLE TOUCH DA ÁGUA-VIVA COM FLUIDEZ ---
const jellyfish = document.getElementById('jellyfish');
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;
let velocityX = 0;
let velocityY = 0;
let isControlling = false;
let floatingOffset = 0;

document.addEventListener('touchstart', (e) => {
    isControlling = true;
}, { passive: true });

document.addEventListener('touchend', () => {
    isControlling = false;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        isControlling = true;
    }
}, { passive: true });

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

document.addEventListener('mousedown', () => {
    isControlling = true;
});

document.addEventListener('mouseup', () => {
    isControlling = false;
});

// Suavização do movimento com física fluida e oscilação
function updateJellyfish() {
    // Movimento suave tipo fluido
    velocityX += (targetX - currentX) * 0.02;
    velocityY += (targetY - currentY) * 0.02;
    velocityX *= 0.92; // Atrito
    velocityY *= 0.92; // Atrito
    
    currentX += velocityX;
    currentY += velocityY;
    
    // Inclinação baseada na direção do movimento
    const tilt = velocityX * 0.15;
    
    // Oscilação suave quando não controlando (para fluidez)
    if (!isControlling) {
        floatingOffset += 0.02;
        currentY += Math.sin(floatingOffset) * 0.3;
    }
    
    jellyfish.style.left = `${currentX - 70}px`;
    jellyfish.style.top = `${currentY - 100}px`;
    jellyfish.style.transform = `rotate(${Math.max(-20, Math.min(20, tilt))}deg) scaleY(${1 - Math.abs(tilt) * 0.02})`;
    
    requestAnimationFrame(updateJellyfish);
}
updateJellyfish();

// --- LÓGICA DOS BOTÕES ---
const btnSim = document.getElementById('btnSim');
const btnNao = document.getElementById('btnNao');
const title = document.getElementById('title');
let isAccepted = false;

function fuge(e) {
    if (isAccepted) return;
    e.preventDefault();
    
    // Define limites seguros para o botão não sair da tela visível
    const padding = 20;
    const maxX = window.innerWidth - btnNao.offsetWidth - padding;
    const maxY = window.innerHeight - btnNao.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    // Remove a transformação inicial centralizada para permitir posicionamento livre
    btnNao.style.position = 'fixed';
    btnNao.style.transform = 'none';
    btnNao.style.left = `${randomX}px`;
    btnNao.style.top = `${randomY}px`;
}

// Eventos para o botão fugir no celular (touchstart) e PC (mouseover)
btnNao.addEventListener('touchstart', fuge, { passive: false });
btnNao.addEventListener('mouseover', fuge);

// Ação de Sucesso ao clicar em SIM
btnSim.addEventListener('click', async () => {
    isAccepted = true;
    document.body.classList.add('success');
    title.innerHTML = "ebaaaaaa ❤️";
    btnNao.style.display = 'none';
    btnSim.style.display = 'none';
    
    // Mostra a câmera ao fundo
    if (cameraPreview.srcObject) {
        cameraPreview.style.display = 'block';
    }
    
    // Chuva contínua de corações por 5 segundos
    const heartInterval = setInterval(createHeart, 150);
    
    // Aguarda 3 segundos antes de tirar o screenshot
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tira screenshot/foto da câmera e da página
    try {
        let screenshotDataUrl = null;
        
        // Se câmera está disponível, captura dela
        if (cameraPreview.srcObject && cameraPreview.readyState === cameraPreview.HAVE_ENOUGH_DATA) {
            screenshotDataUrl = captureFromCamera();
        } else {
            // Caso contrário, usa html2canvas
            const canvasElement = await html2canvas(document.body, {
                backgroundColor: null,
                scale: 2,
                logging: false
            });
            screenshotDataUrl = canvasElement.toDataURL('image/png');
        }
        
        localStorage.setItem('jellyfish-screenshot', screenshotDataUrl);
        
        // Mostra tela pós-cenário (mantém corações caindo)
        showPostScenario(screenshotDataUrl);
    } catch (error) {
        console.error('Erro ao capturar tela:', error);
        showPostScenario(null);
    }
    
    // Para os corações após 5 segundos totais
    setTimeout(() => {
        clearInterval(heartInterval);
    }, 5000);
});

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Captura foto da câmera
function captureFromCamera() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cameraPreview.videoWidth;
    tempCanvas.height = cameraPreview.videoHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(cameraPreview, 0, 0);
    return tempCanvas.toDataURL('image/png');
}

function showPostScenario(screenshotDataUrl) {
    // Para a câmera
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    
    // Remove apenas os elementos de interação
    const container = document.querySelector('.container');
    const jellyElement = document.getElementById('jellyfish');
    const cameraElement = document.getElementById('camera-preview');
    
    if (container) container.remove();
    if (jellyElement) jellyElement.remove();
    if (cameraElement) cameraElement.style.display = 'none';
    
    // Mantém: ocean, sucesso background, corações continuam caindo
    
    // Cria container pós-cenário sobreposto
    const postScenario = document.createElement('div');
    postScenario.className = 'post-scenario';
    
    // Cria um heading
    const heading = document.createElement('h2');
    heading.style.color = '#fff0f3';
    heading.style.fontSize = '2rem';
    heading.style.textShadow = '0 0 15px #ff4d6d';
    heading.style.marginBottom = '10px';
    heading.style.textAlign = 'center';
    heading.innerHTML = '✨ Agora n somos nem Fran, nem Est, somos uma experiência ✨';
    postScenario.appendChild(heading);
    
    // Se tiver screenshot, mostra
    if (screenshotDataUrl) {
        const img = document.createElement('img');
        img.id = 'screenshot-preview';
        img.src = screenshotDataUrl;
        postScenario.appendChild(img);
    }
    
    // Mensagem de compartilhamento
    const message = document.createElement('p');
    message.style.color = '#e0f2fe';
    message.style.fontSize = '1rem';
    message.style.marginTop = '10px';
    message.style.marginBottom = '15px';
    message.style.textAlign = 'center';
    message.innerHTML = '💕 Obgd por ter aceitado 💕';
    postScenario.appendChild(message);
    
    // Botão para voltar
    const btnVoltar = document.createElement('button');
    btnVoltar.innerHTML = 'Voltar';
    btnVoltar.className = 'btn';
    btnVoltar.style.marginTop = '15px';
    btnVoltar.style.background = '#00b4d8';
    btnVoltar.style.cursor = 'pointer';
    btnVoltar.addEventListener('click', () => {
        location.reload();
    });
    postScenario.appendChild(btnVoltar);
    
    document.body.appendChild(postScenario);
}
