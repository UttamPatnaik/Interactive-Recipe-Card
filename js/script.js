class RecipeCard {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 0;
        this.timerInterval = null;
        this.timerSeconds = 45 * 60; // 45 minutes in seconds
        this.timerRunning = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSteps();
    }

    bindEvents() {
        // Toggle buttons
        document.getElementById('ingredientsToggle').addEventListener('click', () => {
            this.toggleSection('ingredientsContent', 'ingredientsToggle');
        });

        document.getElementById('stepsToggle').addEventListener('click', () => {
            this.toggleSection('stepsContent', 'stepsToggle');
        });

        // Cooking controls
        document.getElementById('startCookingBtn').addEventListener('click', () => {
            this.startCooking();
        });

        document.getElementById('nextStepBtn').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetCooking();
        });

        // Timer controls
        document.getElementById('startTimerBtn').addEventListener('click', () => {
            this.toggleTimer();
        });

        document.getElementById('pauseTimerBtn').addEventListener('click', () => {
            this.toggleTimer();
        });

        // Print button
        document.getElementById('printBtn').addEventListener('click', () => {
            this.printRecipe();
        });

        // Ingredient hover effects
        this.addIngredientHoverEffects();
    }

    toggleSection(contentId, toggleId) {
        const content = document.getElementById(contentId);
        const toggle = document.getElementById(toggleId);
        const arrow = toggle.querySelector('.arrow');
        
        content.classList.toggle('active');
        toggle.classList.toggle('active');
        
        if (content.classList.contains('active')) {
            // Animate ingredients/steps appearing
            const items = content.querySelectorAll('.ingredient-item, .step-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    item.style.animation = `slideInLeft 0.5s ease forwards ${index * 0.1}s`;
                }, 0);
            });
        }
    }

    setupSteps() {
        const steps = document.querySelectorAll('.step-item');
        this.totalSteps = steps.length;
    }

    startCooking() {
        const startBtn = document.getElementById('startCookingBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const resetBtn = document.getElementById('resetBtn');
        const timerSection = document.getElementById('timerSection');
        
        startBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
        resetBtn.style.display = 'inline-block';
        timerSection.style.display = 'block';
        
        this.currentStep = 0;
        this.highlightStep(0);
        this.updateProgress();
        
        // Auto-open steps section if not already open
        const stepsContent = document.getElementById('stepsContent');
        if (!stepsContent.classList.contains('active')) {
            this.toggleSection('stepsContent', 'stepsToggle');
        }
        
        this.showNotification('🚀 Cooking started! Follow the highlighted steps.');
    }

    nextStep() {
        const steps = document.querySelectorAll('.step-item');
        
        if (this.currentStep < this.totalSteps) {
            // Mark current step as completed
            steps[this.currentStep].classList.remove('active');
            steps[this.currentStep].classList.add('completed');
            
            this.currentStep++;
            
            if (this.currentStep < this.totalSteps) {
                this.highlightStep(this.currentStep);
                this.updateProgress();
                this.showNotification(`✅ Step ${this.currentStep} completed!`);
            } else {
                this.completeCooking();
            }
        }
    }

    highlightStep(stepIndex) {
        const steps = document.querySelectorAll('.step-item');
        
        // Remove active class from all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Add active class to current step
        if (steps[stepIndex]) {
            steps[stepIndex].classList.add('active');
            steps[stepIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const percentage = Math.round(((this.currentStep + 1) / this.totalSteps) * 100);
        
        progressBar.style.setProperty('--progress-width', `${percentage}%`);
        progressBar.classList.add('active');
        
        progressText.textContent = `Step ${this.currentStep + 1} of ${this.totalSteps} (${percentage}% complete)`;
    }

    completeCooking() {
        const nextBtn = document.getElementById('nextStepBtn');
        const progressText = document.getElementById('progressText');
        
        nextBtn.style.display = 'none';
        progressText.textContent = '🎉 Congratulations! Your chocolate cake is ready!';
        
        // Add celebration animation
        this.celebrateCompletion();
        this.showNotification('🎉 Recipe completed! Enjoy your delicious chocolate cake!');
    }

    resetCooking() {
        const startBtn = document.getElementById('startCookingBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const resetBtn = document.getElementById('resetBtn');
        const timerSection = document.getElementById('timerSection');
        const steps = document.querySelectorAll('.step-item');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        startBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        timerSection.style.display = 'none';
        
        // Reset all steps
        steps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        // Reset progress
        progressBar.style.setProperty('--progress-width', '0%');
        progressBar.classList.remove('active');
        progressText.textContent = 'Ready to start cooking!';
        
        this.currentStep = 0;
        this.resetTimer();
        
        this.showNotification('🔄 Recipe reset! Ready to start cooking again.');
    }

    // Timer functionality
    toggleTimer() {
        const startBtn = document.getElementById('startTimerBtn');
        const pauseBtn = document.getElementById('pauseTimerBtn');
        
        if (this.timerRunning) {
            this.pauseTimer();
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            startBtn.textContent = 'Resume Timer';
        } else {
            this.startTimer();
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        }
    }

    startTimer() {
        this.timerRunning = true;
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();
            
            if (this.timerSeconds <= 0) {
                this.timerComplete();
            }
        }, 1000);
    }

    pauseTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
    }

    resetTimer() {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
        this.timerSeconds = 45 * 60;
        this.updateTimerDisplay();
        
        const startBtn = document.getElementById('startTimerBtn');
        const pauseBtn = document.getElementById('pauseTimerBtn');
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        startBtn.textContent = 'Start Timer';
    }

    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timer');
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (this.timerSeconds <= 300) { // 5 minutes
            timerDisplay.style.color = '#dc3545';
            timerDisplay.style.animation = 'pulse 1s infinite';
        }
    }

    timerComplete() {
        this.pauseTimer();
        this.showNotification('⏰ Time\'s up! Check your cake!');
        
        // Play notification sound (optional)
        this.playNotificationSound();
    }

    // Notification system
    showNotification(message) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideInRight 0.5s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    celebrateCompletion() {
        // Add confetti effect
        const colors = ['#ff6b6b', '#ffa500', '#28a745', '#007bff', '#6f42c1'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 100);
        }
    }

    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            z-index: 1000;
            pointer-events: none;
            animation: confettiFall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }

    addIngredientHoverEffects() {
        const ingredients = document.querySelectorAll('.ingredient-item');
        ingredients.forEach((ingredient, index) => {
            ingredient.addEventListener('mouseenter', () => {
                ingredient.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    printRecipe() {
        window.print();
    }

    playNotificationSound() {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Additional CSS animations
const additionalStyles = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: 'Poppins', sans-serif;
    }
`;

// Add additional styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the recipe card when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecipeCard();
});
