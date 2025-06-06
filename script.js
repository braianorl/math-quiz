// Estado global do quiz
let currentScreen = 1;
let selectedAnswers = {};
let audioPlaying = false;

// Respostas corretas para cada tela
const correctAnswers = {
    'screen-1': 3,
    'screen-2': '2',
    'screen-3': '7',
    'screen-4': '3',
    'screen-5': 5,
    'screen-6': 7,
    'screen-7': '2',
    'screen-8': '8',
    'screen-9': 2,
    'screen-10': 3,
    'screen-11': 2
};

// Áudios para cada tela (placeholder)
const audioInstructions = {
    'screen-1': 'Conte as bolinhas e escreva quantas são:',
    'screen-2': 'Clique no número 2',
    'screen-3': 'Sem contar, clique na opção que tem mais itens!',
    'screen-4': 'Observe os carros de corrida. Clique no carro que vai chegar em terceiro lugar',
    'screen-5': 'Essa régua começa no 0 e vai até o 10. Marque o lugar do número 5.',
    'screen-6': 'Coloque o número que está faltando na régua',
    'screen-7': 'Maria mora no 3 andar do prédio. João mora no andar de baixo. Qual é o andar de João?',
    'screen-8': 'Clique no número maior',
    'screen-9': 'Eu tinha 5 moedas, mas perdi 3. Quantas tenho agora?',
    'screen-10': 'Coloque o resultado',
    'screen-11': 'O cachorro escondeu 3 ossos no quintal. Maria encontrou 1. Quantos ainda estão enterrados?'
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos do botão fechar
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja sair do quiz?')) {
                restartQuiz();
            }
        });
    });

    // Prevenir zoom em dispositivos móveis
    preventZoom();
    
    // Auto-play do primeiro áudio
    setTimeout(() => {
        playAudio('screen-1');
    }, 1000);
});

// Função para prevenir zoom em dispositivos móveis
function preventZoom() {
    let lastTouchEnd = 0;
    
    // Prevenir zoom com duplo toque
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevenir zoom com pinch
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });
    
    // Prevenir zoom com wheel
    document.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });
}

// Função para tocar áudio - APENAS 1 BOTÃO
function playAudio(screenId) {
    const instruction = audioInstructions[screenId];
    
    // Simular reprodução de áudio
    console.log(`🔊 Reproduzindo: ${instruction}`);
    
    // Animar waveform - APENAS quando tocando
    const waveform = document.querySelector(`#${screenId} .waveform`);
    if (waveform) {
        waveform.classList.remove('playing');
        
        setTimeout(() => {
            waveform.classList.add('playing');
        }, 50);
        
        // Parar animação após 3 segundos
        setTimeout(() => {
            waveform.classList.remove('playing');
        }, 3000);
    }
    
    // Em uma implementação real, você usaria:
    // const audio = new Audio(`/audio/${screenId}.mp3`);
    // audio.play();
}

// Função para selecionar número no teclado
function selectNumber(number, screenId) {
    // Remover seleção anterior
    document.querySelectorAll(`#${screenId} .key`).forEach(key => {
        key.classList.remove('selected');
    });
    
    // Selecionar novo número
    event.target.classList.add('selected');
    
    // Salvar resposta
    selectedAnswers[screenId] = number;
    
    // Atualizar display se necessário
    updateNumberDisplay(screenId, number);
    
    // Habilitar botão continuar
    enableContinue(screenId);
    
    console.log(`Número selecionado: ${number} na ${screenId}`);
}

// Função para deletar número
function deleteNumber(screenId) {
    // Remover seleção
    document.querySelectorAll(`#${screenId} .key`).forEach(key => {
        key.classList.remove('selected');
    });
    
    // Remover resposta
    delete selectedAnswers[screenId];
    
    // Atualizar display
    updateNumberDisplay(screenId, '?');
    
    // Desabilitar botão continuar
    disableContinue(screenId);
}

// Função para atualizar display de números
function updateNumberDisplay(screenId, number) {
    if (screenId === 'screen-6') {
        const missingNumber = document.getElementById('missing-number');
        if (missingNumber) {
            missingNumber.textContent = number;
        }
    } else if (screenId === 'screen-10') {
        const resultDisplay = document.getElementById('result-display');
        if (resultDisplay) {
            resultDisplay.textContent = number;
        }
    }
}

// Função para selecionar posição na régua
function selectRulerPosition(position, screenId) {
    // Remover seleção anterior
    document.querySelectorAll(`#${screenId} .ruler-mark`).forEach(mark => {
        mark.classList.remove('selected');
    });
    
    // Selecionar nova posição
    event.target.classList.add('selected');
    
    // Salvar resposta
    selectedAnswers[screenId] = position;
    
    // Habilitar botão continuar
    enableContinue(screenId);
    
    console.log(`Posição selecionada: ${position} na ${screenId}`);
}

// Função para habilitar botão continuar
function enableContinue(screenId) {
    const screenNumber = screenId.split('-')[1];
    const continueBtn = document.getElementById(`continue-${screenNumber}`);
    if (continueBtn) {
        continueBtn.classList.remove('disabled');
    }
}

// Função para desabilitar botão continuar
function disableContinue(screenId) {
    const screenNumber = screenId.split('-')[1];
    const continueBtn = document.getElementById(`continue-${screenNumber}`);
    if (continueBtn) {
        continueBtn.classList.add('disabled');
    }
}

// Função para ir para próxima tela
function nextScreen(screenNumber) {
    const currentScreenId = `screen-${currentScreen}`;
    const nextScreenId = `screen-${screenNumber}`;
    
    // Verificar se há resposta selecionada
    if (!selectedAnswers[currentScreenId]) {
        console.log('Nenhuma resposta selecionada');
        return;
    }
    
    // Verificar resposta (opcional - para feedback)
    const userAnswer = selectedAnswers[currentScreenId];
    const correctAnswer = correctAnswers[currentScreenId];
    
    console.log(`Resposta do usuário: ${userAnswer}`);
    console.log(`Resposta correta: ${correctAnswer}`);
    
    if (userAnswer == correctAnswer) {
        console.log('✅ Resposta correta!');
    } else {
        console.log('❌ Resposta incorreta');
    }
    
    // Esconder tela atual
    document.getElementById(currentScreenId).classList.remove('active');
    
    // Mostrar próxima tela
    const nextScreen = document.getElementById(nextScreenId);
    if (nextScreen) {
        nextScreen.classList.add('active');
        currentScreen = screenNumber;
        
        // Auto-play do áudio da nova tela
        setTimeout(() => {
            playAudio(nextScreenId);
        }, 500);
    } else {
        // Quiz finalizado
        showResults();
    }
}

// Função para finalizar quiz
function finishQuiz() {
    const currentScreenId = `screen-${currentScreen}`;
    
    // Verificar se há resposta selecionada
    if (!selectedAnswers[currentScreenId]) {
        console.log('Nenhuma resposta selecionada');
        return;
    }
    
    // Mostrar resultados
    showResults();
}

// Função para mostrar resultados
function showResults() {
    let correctCount = 0;
    let totalQuestions = Object.keys(correctAnswers).length;
    
    // Contar respostas corretas
    Object.keys(selectedAnswers).forEach(screenId => {
        if (selectedAnswers[screenId] == correctAnswers[screenId]) {
            correctCount++;
        }
    });
    
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Esconder tela atual
    document.getElementById(`screen-${currentScreen}`).classList.remove('active');
    
    // Mostrar tela de resultado
    const resultScreen = document.getElementById('screen-result');
    if (resultScreen) {
        resultScreen.classList.add('active');
        
        // Atualizar pontuação
        const scoreText = document.getElementById('score-text');
        if (scoreText) {
            scoreText.textContent = `${correctCount}/${totalQuestions}`;
        }
    }
    
    console.log('📊 Resultados do Quiz:');
    console.log(`Respostas corretas: ${correctCount}/${totalQuestions}`);
    console.log(`Porcentagem: ${percentage}%`);
    console.log('Respostas detalhadas:', selectedAnswers);
    
    // Salvar resultados (opcional)
    saveResults(correctCount, totalQuestions, selectedAnswers);
}

// Função para salvar resultados
function saveResults(correctCount, totalQuestions, answers) {
    const results = {
        score: correctCount,
        total: totalQuestions,
        percentage: Math.round((correctCount / totalQuestions) * 100),
        answers: answers,
        timestamp: new Date().toISOString()
    };
    
    // Salvar no localStorage
    localStorage.setItem('quiz123go_results', JSON.stringify(results));
    
    // Em uma implementação real, você enviaria para um servidor
    console.log('Resultados salvos:', results);
}

// Função para reiniciar quiz
function restartQuiz() {
    // Limpar dados
    selectedAnswers = {};
    currentScreen = 1;
    
    // Limpar todas as seleções visuais
    document.querySelectorAll('.key.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        input.checked = false;
    });
    
    document.querySelectorAll('.ruler-mark.selected').forEach(mark => {
        mark.classList.remove('selected');
    });
    
    // Resetar displays
    const missingNumber = document.getElementById('missing-number');
    if (missingNumber) missingNumber.textContent = '?';
    
    const resultDisplay = document.getElementById('result-display');
    if (resultDisplay) resultDisplay.textContent = '?';
    
    // Desabilitar todos os botões continuar
    for (let i = 1; i <= 11; i++) {
        disableContinue(`screen-${i}`);
    }
    
    // Esconder todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar primeira tela
    document.getElementById('screen-1').classList.add('active');
    
    // Auto-play do primeiro áudio
    setTimeout(() => {
        playAudio('screen-1');
    }, 500);
}

// Event listeners para radio buttons
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        const screenId = e.target.closest('.screen').id;
        selectedAnswers[screenId] = e.target.value;
        enableContinue(screenId);
        
        console.log(`Opção selecionada: ${e.target.value} na ${screenId}`);
    }
});

// Event listeners para navegação por teclado (opcional)
document.addEventListener('keydown', function(event) {
    // Teclas numéricas para telas com teclado
    if (event.key >= '0' && event.key <= '9') {
        const screenId = `screen-${currentScreen}`;
        const hasKeyboard = document.querySelector(`#${screenId} .numeric-keyboard`);
        
        if (hasKeyboard) {
            const number = parseInt(event.key);
            selectNumber(number, screenId);
        }
    }
    
    // Enter para continuar
    if (event.key === 'Enter') {
        const continueBtn = document.getElementById(`continue-${currentScreen}`);
        if (continueBtn && !continueBtn.classList.contains('disabled')) {
            if (currentScreen < 11) {
                nextScreen(currentScreen + 1);
            } else {
                finishQuiz();
            }
        }
    }
    
    // Backspace para deletar
    if (event.key === 'Backspace') {
        const screenId = `screen-${currentScreen}`;
        const hasKeyboard = document.querySelector(`#${screenId} .numeric-keyboard`);
        
        if (hasKeyboard) {
            deleteNumber(screenId);
        }
    }
    
    // Setas para navegação (debug)
    if (event.key === 'ArrowRight' && event.ctrlKey) {
        if (currentScreen < 11) {
            // Simular resposta correta para debug
            const screenId = `screen-${currentScreen}`;
            selectedAnswers[screenId] = correctAnswers[screenId];
            nextScreen(currentScreen + 1);
        }
    }
});

// Adicionar CSS para animação da waveform quando tocando
const style = document.createElement('style');
style.textContent = `
    .waveform.playing .wave-bar {
        animation-duration: 0.8s;
        animation-timing-function: ease-in-out;
    }
    
    .waveform.playing .wave-bar:nth-child(1) { animation-delay: 0s; }
    .waveform.playing .wave-bar:nth-child(2) { animation-delay: 0.1s; }
    .waveform.playing .wave-bar:nth-child(3) { animation-delay: 0.2s; }
    .waveform.playing .wave-bar:nth-child(4) { animation-delay: 0.3s; }
    .waveform.playing .wave-bar:nth-child(5) { animation-delay: 0.4s; }
    .waveform.playing .wave-bar:nth-child(6) { animation-delay: 0.5s; }
    .waveform.playing .wave-bar:nth-child(7) { animation-delay: 0.6s; }
    .waveform.playing .wave-bar:nth-child(8) { animation-delay: 0.7s; }
`;
document.head.appendChild(style);

// Função para debug - pular para tela específica
function debugGoToScreen(screenNumber) {
    if (screenNumber >= 1 && screenNumber <= 11) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.getElementById(`screen-${screenNumber}`).classList.add('active');
        currentScreen = screenNumber;
        
        setTimeout(() => {
            playAudio(`screen-${screenNumber}`);
        }, 500);
    }
}

// Função para debug - mostrar todas as respostas
function debugShowAnswers() {
    console.log('🔍 Respostas corretas:');
    Object.keys(correctAnswers).forEach(screenId => {
        const screenNumber = screenId.split('-')[1];
        console.log(`Tela ${screenNumber}: ${correctAnswers[screenId]}`);
    });
}

// Expor funções de debug no console (apenas para desenvolvimento)
if (typeof window !== 'undefined') {
    window.debugGoToScreen = debugGoToScreen;
    window.debugShowAnswers = debugShowAnswers;
    window.debugRestartQuiz = restartQuiz;
}