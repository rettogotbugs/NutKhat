// NutKhat App JavaScript - Enhanced Version
(function() {
    'use strict';
    
    // App data
    const APP_DATA = {
        motivationalMessages: [
            "Respect++ 💯",
            "Brahmachari Mode Activated 🧘",
            "Strong mind, strong body! 💪",
            "You're on fire! 🔥", 
            "Legend in the making! ⭐",
            "Stay strong, warrior! ⚔️",
            "Mind over matter! 🧠",
            "You got this! 💯",
            "Discipline = Freedom! 🗽",
            "Level up activated! 🚀",
            "Monk mode engaged! 🏴",
            "Self-control mastered! 🎯"
        ],
        relapseMessage: "Oops... Nut busted 💥 Back to Day 0",
        avatarLevels: [
            { minDay: 0, maxDay: 6, name: "Clown", emoji: "🤡", title: "Just Starting", description: "Everyone starts somewhere!" },
            { minDay: 7, maxDay: 29, name: "Rookie Monk", emoji: "🧘", title: "One Week Strong", description: "You've made it through the first week!" },
            { minDay: 30, maxDay: 59, name: "Brahmachari Level", emoji: "🥋", title: "One Month Warrior", description: "30 days of discipline - impressive!" },
            { minDay: 60, maxDay: 999, name: "NutKhat Legend", emoji: "👑", title: "Ultimate Champion", description: "You are a legend among legends!" }
        ],
        milestones: [7, 30, 60, 90, 120, 180, 365]
    };

    // Global app state
    let currentStreak = 0;
    let lastCheckinDate = null;
    let elements = {};

    // Utility functions
    function log(message, data = '') {
        console.log(`[NutKhat] ${message}`, data);
    }

    function getDateOnly(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function canCheckinToday() {
        if (!lastCheckinDate) return true;
        
        const lastCheckin = getDateOnly(new Date(lastCheckinDate));
        const today = getDateOnly(new Date());
        
        return lastCheckin < today;
    }

    function getCurrentLevel() {
        return APP_DATA.avatarLevels.find(level => 
            currentStreak >= level.minDay && currentStreak <= level.maxDay
        ) || APP_DATA.avatarLevels[0];
    }

    function getNextMilestone() {
        return APP_DATA.milestones.find(milestone => milestone > currentStreak) || APP_DATA.milestones[APP_DATA.milestones.length - 1];
    }

    function calculateProgress() {
        const nextMilestone = getNextMilestone();
        const previousMilestone = APP_DATA.milestones.filter(m => m <= currentStreak).pop() || 0;
        
        if (currentStreak >= APP_DATA.milestones[APP_DATA.milestones.length - 1]) {
            return { percentage: 100, current: currentStreak, next: nextMilestone };
        }
        
        const progress = currentStreak - previousMilestone;
        const total = nextMilestone - previousMilestone;
        const percentage = Math.min((progress / total) * 100, 100);
        
        return { percentage, current: currentStreak, next: nextMilestone };
    }

    function getRandomMessage() {
        return APP_DATA.motivationalMessages[Math.floor(Math.random() * APP_DATA.motivationalMessages.length)];
    }

    // Storage functions
    function loadFromStorage() {
        try {
            const savedData = localStorage.getItem('nutKhatData');
            if (savedData) {
                const data = JSON.parse(savedData);
                currentStreak = data.streak || 0;
                lastCheckinDate = data.lastCheckinDate || null;
                log('Data loaded from storage:', { streak: currentStreak, lastCheckinDate });
            } else {
                log('No saved data found, starting fresh');
                currentStreak = 0;
                lastCheckinDate = null;
            }
        } catch (error) {
            log('Error loading from storage:', error);
            currentStreak = 0;
            lastCheckinDate = null;
        }
    }

    function saveToStorage() {
        try {
            const data = {
                streak: currentStreak,
                lastCheckinDate: lastCheckinDate,
                version: '1.0.0'
            };
            localStorage.setItem('nutKhatData', JSON.stringify(data));
            log('Data saved to storage:', data);
        } catch (error) {
            log('Error saving to storage:', error);
        }
    }

    // UI Update functions
    function updateStreak() {
        if (elements.streakNumber) {
            elements.streakNumber.textContent = currentStreak;
            log('Streak updated to:', currentStreak);
        }
    }

    function updateAvatar() {
        const level = getCurrentLevel();
        if (elements.avatarEmoji) elements.avatarEmoji.textContent = level.emoji;
        if (elements.avatarTitle) elements.avatarTitle.textContent = level.title;
        if (elements.avatarName) elements.avatarName.textContent = level.name;
        if (elements.avatarDescription) elements.avatarDescription.textContent = level.description;
        log('Avatar updated to level:', level);
    }

    function updateProgress() {
        const progress = calculateProgress();
        if (elements.progressFill) {
            elements.progressFill.style.width = `${progress.percentage}%`;
        }
        if (elements.progressText) {
            elements.progressText.textContent = `${progress.current}/${progress.next} days`;
        }
        log('Progress updated:', progress);
    }

    function updateButtons() {
        if (!elements.checkinBtn) return;
        
        const canCheckin = canCheckinToday();
        elements.checkinBtn.disabled = !canCheckin;
        
        const btnText = elements.checkinBtn.querySelector('.btn-text');
        if (btnText) {
            if (!canCheckin) {
                btnText.textContent = "Already checked in today! ✅";
                elements.checkinBtn.style.opacity = '0.6';
            } else {
                btnText.textContent = "No Nut Today ✅";
                elements.checkinBtn.style.opacity = '1';
            }
        }
        log('Buttons updated, can checkin:', canCheckin);
    }

    function updateUI() {
        updateStreak();
        updateAvatar();
        updateProgress();
        updateButtons();
    }

    function showMessage(message, duration = 3000) {
        if (!elements.motivationMessage || !elements.messageContainer) {
            log('Message elements not found');
            return;
        }
        
        elements.motivationMessage.textContent = message;
        elements.messageContainer.classList.add('show');
        log('Showing message:', message);
        
        setTimeout(() => {
            if (elements.messageContainer) {
                elements.messageContainer.classList.remove('show');
            }
        }, duration);
    }

    function showCelebration(title, message) {
        if (!elements.celebrationModal) return;
        
        if (elements.celebrationTitle) elements.celebrationTitle.textContent = title;
        if (elements.celebrationMessage) elements.celebrationMessage.textContent = message;
        elements.celebrationModal.classList.remove('hidden');
        log('Showing celebration:', title);
    }

    function hideCelebration() {
        if (elements.celebrationModal) {
            elements.celebrationModal.classList.add('hidden');
        }
    }

    function checkForMilestone(previousStreak) {
        const currentMilestone = APP_DATA.milestones.find(m => currentStreak >= m && previousStreak < m);
        
        if (currentMilestone) {
            const level = getCurrentLevel();
            setTimeout(() => {
                showCelebration(
                    `🎉 ${currentMilestone} Days Milestone! 🎉`,
                    `You've unlocked: ${level.name} ${level.emoji}! ${level.description}`
                );
            }, 1000);
        }
    }

    // Event handlers
    function handleCheckin() {
        log('Checkin button clicked');
        
        if (!canCheckinToday()) {
            showMessage("You've already checked in today! Come back tomorrow! 😊");
            return;
        }

        const previousStreak = currentStreak;
        currentStreak++;
        lastCheckinDate = new Date().toISOString();
        
        log(`Streak incremented from ${previousStreak} to ${currentStreak}`);
        
        // Add button animation
        if (elements.checkinBtn) {
            elements.checkinBtn.classList.add('pulse');
            setTimeout(() => {
                if (elements.checkinBtn) {
                    elements.checkinBtn.classList.remove('pulse');
                }
            }, 600);
        }
        
        // Save and update UI
        saveToStorage();
        updateUI();
        
        // Show motivational message
        const message = getRandomMessage();
        showMessage(message);
        
        // Check for milestone celebration
        checkForMilestone(previousStreak);
    }

    function handleRelapse() {
        log('Relapse button clicked');
        
        // Confirm relapse
        const confirmed = confirm("Are you sure you want to reset your streak? This cannot be undone! 😔");
        if (!confirmed) {
            log('Relapse cancelled by user');
            return;
        }

        // Reset streak
        currentStreak = 0;
        lastCheckinDate = null;
        
        log('Streak reset to 0');
        
        // Save and update UI
        saveToStorage();
        updateUI();
        
        // Show relapse message
        showMessage(APP_DATA.relapseMessage, 4000);
        
        // Add shake animation to streak counter
        if (elements.streakNumber) {
            elements.streakNumber.style.animation = 'shake 0.5s';
            setTimeout(() => {
                if (elements.streakNumber) {
                    elements.streakNumber.style.animation = '';
                }
            }, 500);
        }
    }

    // Initialize the app
    function initApp() {
        log('Initializing NutKhat app...');
        
        // Get all DOM elements
        elements = {
            streakNumber: document.getElementById('streakNumber'),
            avatarEmoji: document.getElementById('avatarEmoji'),
            avatarTitle: document.getElementById('avatarTitle'),
            avatarName: document.getElementById('avatarName'),
            avatarDescription: document.getElementById('avatarDescription'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            checkinBtn: document.getElementById('checkinBtn'),
            relapseBtn: document.getElementById('relapseBtn'),
            messageContainer: document.getElementById('messageContainer'),
            motivationMessage: document.getElementById('motivationMessage'),
            celebrationModal: document.getElementById('celebrationModal'),
            celebrationTitle: document.getElementById('celebrationTitle'),
            celebrationMessage: document.getElementById('celebrationMessage'),
            closeCelebration: document.getElementById('closeCelebration')
        };

        // Check if all required elements exist
        const missingElements = [];
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                missingElements.push(key);
            }
        }

        if (missingElements.length > 0) {
            log('Missing DOM elements:', missingElements);
            alert('App initialization failed: Missing DOM elements');
            return false;
        }

        log('All DOM elements found successfully');

        // Load data and set up UI
        loadFromStorage();
        updateUI();

        // Bind event handlers
        if (elements.checkinBtn) {
            elements.checkinBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleCheckin();
            });
            log('Checkin button event bound');
        }

        if (elements.relapseBtn) {
            elements.relapseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleRelapse();
            });
            log('Relapse button event bound');
        }

        if (elements.closeCelebration) {
            elements.closeCelebration.addEventListener('click', hideCelebration);
        }

        // Close modal on background click
        if (elements.celebrationModal) {
            elements.celebrationModal.addEventListener('click', function(e) {
                if (e.target === elements.celebrationModal) {
                    hideCelebration();
                }
            });
        }

        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.celebrationModal && !elements.celebrationModal.classList.contains('hidden')) {
                hideCelebration();
            }
        });

        log('NutKhat app initialized successfully!');
        
        // Welcome message for first-time users
        if (!localStorage.getItem('nutKhatData')) {
            setTimeout(() => {
                showMessage("Welcome to NutKhat! Start your journey today! 🚀", 4000);
            }, 1500);
        }

        return true;
    }

    // Add CSS for shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            log('DOM loaded, starting initialization...');
            initApp();
        });
    } else {
        // DOM is already loaded
        log('DOM already loaded, starting initialization...');
        initApp();
    }

    // Add touch feedback for mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('btn')) {
            e.target.style.transform = 'scale(0.95)';
        }
    });

    document.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('btn')) {
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }
    });

    // Expose for debugging
    window.nutKhatDebug = {
        getCurrentStreak: () => currentStreak,
        getLastCheckinDate: () => lastCheckinDate,
        getElements: () => elements,
        forceCheckin: handleCheckin,
        forceRelapse: handleRelapse
    };

    log('🥜 NutKhat v1.0.0 - Stay strong! 💪');
    log('Master your mind, master your life! 🧘');

})();