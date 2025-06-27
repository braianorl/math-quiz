// Estado global do quiz
let currentScreen = 1;
let selectedAnswers = {};
let audioPlaying = false;

// Referência global para o áudio atual
let currentAudio = null;

// Referência global para a animação Rive
let riveAnimation = null;
let riveCanvas = null;

// Respostas corretas para cada tela
const correctAnswers = {
    'screen-1': 3,
    'screen-2': '2',
    'screen-3': '7',
    'screen-4': '3',
    'screen-5': 3,
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
    // Verificar se a biblioteca Rive está carregada
    console.log('🔍 Verificando biblioteca Rive...');
    console.log('rive:', rive);
    console.log('typeof rive:', typeof rive);
    
    // Esconder todas as telas do quiz ao iniciar
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'start-screen') {
            screen.classList.remove('active');
        }
    });
    // Evento do botão Iniciar
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            document.getElementById('start-screen').style.display = 'none';
            const firstScreen = document.getElementById('screen-1');
            if (firstScreen) {
                firstScreen.classList.add('active');
                setTimeout(() => {
                    playAudio('screen-1');
                }, 500);
            }
        });
    }

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

// Função para pausar áudio atual
function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
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
    
    // Parar áudio anterior, se houver
    stopCurrentAudio();
    
    // Criar e tocar novo áudio
    currentAudio = new Audio(`audio/${screenId}.mp3`);
    currentAudio.play();
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

// AQUI VAI O NOVO SLIDER DE PASSOS
                // ...existing code...
        
        class StepSlider {
            constructor(containerId) {
                this.container = document.getElementById(containerId);
                this.slider = document.getElementById('slider');
                this.arrow = document.getElementById('arrow');
                this.labelsContainer = document.getElementById('labels');
                this.pointsContainer = document.getElementById('points');
                
                this.steps = [0, 1, 2, 3, 4, 5, 6]; // Steps de 0 a 6
                this.currentStep = 0;
                
                this.init();
            }
            
            init() {
                this.createLabels();
                this.createPoints();
                this.updateSlider();
                
                this.slider.addEventListener('input', (e) => {
                    this.currentStep = parseInt(e.target.value);
                    this.updateSlider();
        
                    // INTEGRAÇÃO: Salva resposta e habilita botão continuar
                    selectedAnswers['screen-5'] = this.currentStep;
                    if (this.currentStep !== 0) {
                        enableContinue('screen-5');
                    } else {
                        disableContinue('screen-5');
                        delete selectedAnswers['screen-5'];
                    }
                });
            }
            
            createLabels() {
                this.labelsContainer.innerHTML = '';
                this.steps.forEach((value, index) => {
                    const label = document.createElement('div');
                    label.className = 'step-label';
                    label.textContent = value;
                    label.style.left = `${(index / (this.steps.length - 1)) * 100}%`;
                    this.labelsContainer.appendChild(label);
                });
            }
            
            createPoints() {
                this.pointsContainer.innerHTML = '';
                this.steps.forEach((value, index) => {
                    const point = document.createElement('div');
                    point.className = 'step-point';
                    point.style.left = `${(index / (this.steps.length - 1)) * 100}%`;
                    this.pointsContainer.appendChild(point);
                });
            }
            
            updateSlider() {
                const percentage = (this.currentStep / (this.steps.length - 1)) * 100;
                
                // Atualizar posição da seta
                this.arrow.style.left = `${percentage}%`;
                
                // Atualizar labels - apenas o ativo fica destacado
                const labels = this.labelsContainer.querySelectorAll('.step-label');
                labels.forEach((label, index) => {
                    label.classList.remove('active');
                    if (index === this.currentStep) {
                        label.classList.add('active');
                    }
                });
                
                // Atualizar pontos - apenas o ativo fica destacado
                const points = this.pointsContainer.querySelectorAll('.step-point');
                points.forEach((point, index) => {
                    point.classList.remove('active');
                    if (index === this.currentStep) {
                        point.classList.add('active');
                    }
                });
            }
            
            setValue(stepIndex) {
                if (stepIndex >= 0 && stepIndex < this.steps.length) {
                    this.currentStep = stepIndex;
                    this.slider.value = stepIndex;
                    this.updateSlider();
                }
            }
            
            getValue() {
                return this.steps[this.currentStep];
            }
        }
        
        // Inicializar o slider
        const stepSlider = new StepSlider('container');
        
        // ...existing code...
        
        // Exemplo de uso programático (opcional)
        // stepSlider.setValue(2); // Define para o step 6
        // console.log(stepSlider.getValue()); // Retorna o valor atual
    

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
    
    // Pausar áudio atual antes da transição
    stopCurrentAudio();
    
    // Esconder tela atual
    document.getElementById(currentScreenId).classList.remove('active');
    
    // Mostrar próxima tela
    const nextScreen = document.getElementById(nextScreenId);
    if (nextScreen) {
        nextScreen.classList.add('active');
        currentScreen = screenNumber;
        
        // Carregar animação Rive se for a tela 2
        if (screenNumber === 2) {
            setTimeout(() => {
                loadRiveAnimation();
            }, 100);
        }
        
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
    
    // Pausar áudio atual antes de mostrar resultados
    stopCurrentAudio();
    
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
    // Pausar áudio atual antes de voltar para tela inicial
    stopCurrentAudio();
    
    // Limpar animação Rive
    if (riveAnimation) {
        riveAnimation.pause();
        riveAnimation = null;
    }
    if (riveCanvas) {
        riveCanvas = null;
    }
    
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
        if (screen.id === 'start-screen') {
            screen.style.display = 'flex';
        } else {
            screen.style.display = '';
        }
    });
    
    // Mostrar tela inicial
    document.getElementById('start-screen').classList.add('active');
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

// Função para diagnosticar problemas com o arquivo .riv
async function diagnoseRiveFile() {
    console.log('🔍 Diagnosticando arquivo .riv...');
    
    try {
        const response = await fetch('animations/count_itens_screen_2.riv');
        console.log('📊 Status da resposta:', response.status);
        console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const blob = await response.blob();
            console.log('📊 Tamanho do arquivo:', blob.size, 'bytes');
            console.log('📊 Tipo MIME:', blob.type);
            
            if (blob.size === 0) {
                console.error('❌ Arquivo está vazio!');
            } else if (blob.size < 1000) {
                console.warn('⚠️ Arquivo muito pequeno, pode estar corrompido');
            } else {
                console.log('✅ Arquivo parece estar OK');
            }
        } else {
            console.error('❌ Erro ao carregar arquivo:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('❌ Erro no diagnóstico:', error);
    }
}

// Função para debug - testar animação Rive
function debugTestRiveAnimation() {
    console.log('🎬 Testando animação Rive...');
    console.log('📋 Verificando biblioteca Rive...');
    console.log('rive:', rive);
    console.log('typeof rive:', typeof rive);
    
    if (typeof rive !== 'undefined') {
        console.log('✅ Biblioteca Rive já carregada!');
        // Primeiro diagnosticar o arquivo
        diagnoseRiveFile().then(() => {
            // Depois tentar carregar a animação
            loadRiveAnimation();
        });
    } else {
        console.log('📥 Biblioteca Rive não encontrada, carregando dinamicamente...');
        loadRiveAnimation();
    }
}

// Expor funções de debug no console (apenas para desenvolvimento)
if (typeof window !== 'undefined') {
    window.debugGoToScreen = debugGoToScreen;
    window.debugShowAnswers = debugShowAnswers;
    window.debugRestartQuiz = restartQuiz;
    window.debugTestRiveAnimation = debugTestRiveAnimation;
    window.diagnoseRiveFile = diagnoseRiveFile;
}

// Função para carregar biblioteca Rive dinamicamente
async function loadRiveLibrary() {
    return new Promise((resolve, reject) => {
        // Verificar se já está carregada
        if (typeof rive !== 'undefined') {
            console.log('✅ Biblioteca Rive já carregada');
            resolve(rive);
            return;
        }

        console.log('📥 Carregando biblioteca Rive dinamicamente...');
        
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@rive-app/canvas@2.7.0/dist/rive.min.js';
        script.type = 'text/javascript';
        
        script.onload = () => {
            console.log('✅ Script Rive carregado, aguardando inicialização...');
            // Aguardar um pouco para garantir que a biblioteca foi inicializada
            setTimeout(() => {
                if (typeof rive !== 'undefined') {
                    console.log('✅ Biblioteca Rive inicializada com sucesso');
                    resolve(rive);
                } else {
                    console.error('❌ Biblioteca Rive não foi inicializada');
                    reject(new Error('Biblioteca Rive não foi inicializada'));
                }
            }, 500);
        };
        
        script.onerror = () => {
            console.error('❌ Falha ao carregar biblioteca Rive');
            reject(new Error('Falha ao carregar biblioteca Rive'));
        };
        
        document.head.appendChild(script);
    });
}

// Função para carregar animação Rive
async function loadRiveAnimation() {
    try {
        const canvas = document.getElementById('rive-canvas-screen-2');
        if (!canvas) {
            console.log('Canvas não encontrado');
            return;
        }

        // Limpar animação anterior se existir
        if (riveAnimation) {
            riveAnimation.pause();
            riveAnimation = null;
        }

        console.log('🎬 Iniciando carregamento da animação Rive...');

        // Verificar se a biblioteca Rive está disponível
        if (typeof rive === 'undefined') {
            console.log('📥 Biblioteca Rive não encontrada, carregando...');
            await loadRiveLibrary();
        }

        console.log('📋 Rive disponível:', rive);

        // Verificar se o arquivo .riv existe
        try {
            const response = await fetch('animations/count_itens_screen_2.riv');
            if (!response.ok) {
                throw new Error(`Arquivo não encontrado: ${response.status} ${response.statusText}`);
            }
            console.log('✅ Arquivo .riv encontrado e acessível');
        } catch (fetchError) {
            console.error('❌ Erro ao verificar arquivo .riv:', fetchError);
            return;
        }

        // Carregar a animação Rive com a sintaxe correta para CDN
        const riveInstance = new rive.Rive({
            src: 'animations/count_itens_screen_2.riv',
            canvas: canvas,
            autoplay: true,
            onLoad: () => {
                console.log('🎬 Animação Rive carregada com sucesso!');
                riveAnimation = riveInstance;
                riveCanvas = canvas;
                
                // Tentar obter informações da animação
                try {
                    const stateMachineNames = riveInstance.stateMachineNames;
                    console.log('📋 State Machines disponíveis:', stateMachineNames);
                    
                    if (stateMachineNames && stateMachineNames.length > 0) {
                        // Usar a primeira state machine disponível
                        const firstStateMachine = stateMachineNames[0];
                        console.log('🎯 Usando state machine:', firstStateMachine);
                    }
                } catch (error) {
                    console.log('ℹ️ Não foi possível obter informações da state machine');
                }
            },
            onError: (error) => {
                console.error('❌ Erro ao carregar animação Rive:', error);
                console.error('Detalhes do erro:', error.message);
                console.error('Stack trace:', error.stack);
            }
        });
    } catch (error) {
        console.error('❌ Erro ao inicializar animação Rive:', error);
        console.error('Detalhes do erro:', error.message);
    }
}

// Função para pausar animação Rive
function pauseRiveAnimation() {
    if (riveAnimation) {
        riveAnimation.pause();
    }
}

// Função para retomar animação Rive
function resumeRiveAnimation() {
    if (riveAnimation) {
        riveAnimation.play();
    }
}