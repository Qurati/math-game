document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const tasksContainer = document.getElementById('tasks-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    const restartBtn = document.getElementById('restart-btn');
    const progressBar = document.getElementById('progress');
    const resultsSection = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const resultMessage = document.getElementById('result-message');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Переменные состояния
    let currentTaskIndex = 0;
    let correctAnswers = 0;
    let totalTasks = 0;
    let tasks = [];
    let userAnswers = [];
    let checkedAnswers = [];
    let currentDifficulty = 'easy';
    
    // База вопросов (20 вопросов для каждого уровня)
    const questionsDatabase = {
        easy: [
            { question: "Каков угловой коэффициент (k) в функции y = 2x + 3?", answer: "2" },
            { question: "Каково значение b (свободный член) в функции y = -4x + 5?", answer: "5" },
            { question: "Какой будет график функции y = 0x + 3?", answer: "горизонтальная прямая" },
            { question: "Если k > 0, как направлен график функции?", answer: "вверх" },
            { question: "Если k < 0, как направлен график функции?", answer: "вниз" },
            { question: "Какая функция имеет график, параллельный y = 3x + 1?", answer: "y = 3x + 5" },
            { question: "Где пересекает ось Y функция y = 2x - 4?", answer: "-4" },
            { question: "Как называется график линейной функции?", answer: "прямая" },
            { question: "Чему равно k в функции y = -x + 7?", answer: "-1" },
            { question: "Если b = 0, где пересекает ось Y график функции?", answer: "0" },
            { question: "Как изменится график, если увеличить b на 3?", answer: "сдвинется вверх на 3" },
            { question: "Какой коэффициент отвечает за наклон прямой?", answer: "k" },
            { question: "Если k = 0, как направлен график функции?", answer: "горизонтально" },
            { question: "Какая функция соответствует вертикальной прямой?", answer: "x = a" },
            { question: "Чему равно b в функции y = 5x?", answer: "0" },
            { question: "Как называется точка пересечения с осью X?", answer: "ноль функции" },
            { question: "Если график проходит через начало координат, чему равно b?", answer: "0" },
            { question: "Как найти k по двум точкам (x₁,y₁) и (x₂,y₂)?", answer: "(y₂-y₁)/(x₂-x₁)" },
            { question: "Если график параллелен оси X, чему равно k?", answer: "0" },
            { question: "Какой знак у k, если график идет вниз слева направо?", answer: "-" }
        ],
        medium: [
            { question: "Найдите точку пересечения с осью Y для функции y = 3x - 6", answer: "6" },
            { question: "Найдите уравнение прямой с k=2, проходящей через точку (0,3)", answer: "y = 2x + 3" },
            { question: "Найдите k, если график проходит через точки (0,3) и (1,5)", answer: "2" },
            { question: "Как изменится график, если увеличить b на 2?", answer: "сдвинется вверх на 2" },
            { question: "Найдите пересечение графиков y = 2x + 1 и y = -x + 7", answer: "(2,5)" },
            { question: "Какой угол (в градусах) с осью X у прямой y = x?", answer: "45" },
            { question: "Найдите b, если график проходит через точки (1,4) и (2,7)", answer: "1" },
            { question: "Каково уравнение прямой, проходящей через (0,2) и (1,4)?", answer: "y = 2x + 2" },
            { question: "Если график параллелен y = 0.5x - 3, чему равно k?", answer: "0.5" },
            { question: "Найдите точку пересечения y = 3x - 2 с осью X", answer: "(2/3,0)" },
            { question: "Какой коэффициент у x в функции 2y = 4x + 6?", answer: "2" },
            { question: "Преобразуйте 3x - 2y = 6 к виду y = kx + b", answer: "y = 1.5x - 3" },
            { question: "Найдите угол наклона прямой y = √3x + 4", answer: "60" },
            { question: "Если график проходит через (1,1) и (3,5), найдите уравнение", answer: "y = 2x - 1" },
            { question: "Как изменится график y = kx + b, если k умножить на -1?", answer: "отразится" },
            { question: "Найдите расстояние от (0,0) до прямой y = 3x + 4", answer: "4/√10" },
            { question: "Каково уравнение прямой, параллельной y = 2x и проходящей через (0,5)?", answer: "y = 2x + 5" },
            { question: "Найдите площадь треугольника, образованного y=2x, x=0 и y=4", answer: "4" },
            { question: "Если график проходит через (2,3) и k=0, найдите уравнение", answer: "y = 3" },
            { question: "Какой угол между прямыми y = x и y = √3x?", answer: "15" }
        ],
        hard: [
            { question: "Найдите уравнение прямой, проходящей через точки (1,3) и (2,5)", answer: "y = 2x + 1" },
            { question: "При каком k график функции y = kx - 3 проходит через точку (2,5)?", answer: "4" },
            { question: "Найдите угол наклона (в градусах) прямой y = 1.732x + 2", answer: "60" },
            { question: "Найдите расстояние между параллельными прямыми y = 2x + 1 и y = 2x - 3", answer: "4/√5" },
            { question: "Найдите уравнение биссектрисы угла между y = x и y = 0", answer: "y = (√2-1)x" },
            { question: "При каком b прямая y = -x + b касается окружности x² + y² = 8?", answer: "4" },
            { question: "Найдите площадь треугольника, образованного y=2x, y=-0.5x+5 и осью Y", answer: "10" },
            { question: "Найдите уравнение прямой, симметричной y = 2x + 1 относительно y = x", answer: "x = 2y + 1" },
            { question: "Каково уравнение медианы в треугольнике с вершинами (0,0), (4,0), (2,6)?", answer: "y = -3x + 6" },
            { question: "Найдите угол между прямыми y = √3x и y = -√3x + 6", answer: "120" },
            { question: "При каком k прямые y = kx + 3 и y = (k+2)x - 1 параллельны?", answer: "не существует" },
            { question: "Найдите уравнение высоты в треугольнике (0,0), (4,0), (2,6)", answer: "y = 1/3x" },
            { question: "Каково уравнение касательной к y = x² в точке (1,1)?", answer: "y = 2x - 1" },
            { question: "Найдите точку пересечения медиан треугольника (0,0), (4,0), (0,4)", answer: "(4/3,4/3)" },
            { question: "При каком k площадь треугольника, ограниченного y=kx, x=0 и y=4, равна 8?", answer: "1" },
            { question: "Найдите уравнение прямой, проходящей через (1,2) и образующей с осями треугольник площадью 4", answer: "y = -2x + 4" },
            { question: "Каково уравнение прямой, проходящей через точку (2,3) и равноудаленной от (0,0) и (4,0)?", answer: "x = 2" },
            { question: "Найдите все k, при которых расстояние от (0,0) до y = kx + 4 равно 2", answer: "±√3" },
            { question: "Каково уравнение общей хорды окружностей x²+y²=25 и (x-8)²+y²=9?", answer: "x = 55/8" },
            { question: "Найдите уравнение прямой, делящей пополам угол между y = x и y = 3x", answer: "y = (2±√10)x" }
        ]
    };

    // Инициализация теста
    function initTest(difficulty) {
        currentDifficulty = difficulty;
        tasks = [...questionsDatabase[difficulty]];
        totalTasks = tasks.length;
        userAnswers = new Array(totalTasks).fill(null);
        checkedAnswers = new Array(totalTasks).fill(false);
        currentTaskIndex = 0;
        correctAnswers = 0;
        
        shuffleArray(tasks);
        renderTask();
        updateProgress();
        updateNavigation();
        resultsSection.style.display = 'none';
        document.querySelector('.game-area').style.display = 'block';
    }

    // Отображение текущего задания
    function renderTask() {
        tasksContainer.innerHTML = '';
        
        if (currentTaskIndex >= totalTasks) {
            showResults();
            return;
        }
        
        const task = tasks[currentTaskIndex];
        const taskElement = document.createElement('div');
        taskElement.className = 'task active';
        taskElement.innerHTML = `
            <div class="task-counter">Вопрос ${currentTaskIndex + 1} из ${totalTasks}</div>
            <div class="task-question">${task.question}</div>
            <div class="answer-form">
                <input type="text" class="answer-input" placeholder="Введите ваш ответ" 
                       value="${userAnswers[currentTaskIndex] || ''}">
                <button class="submit-btn">Проверить</button>
            </div>
            <div class="feedback ${checkedAnswers[currentTaskIndex] ? (userAnswers[currentTaskIndex]?.toLowerCase() === task.answer.toLowerCase() ? 'correct' : 'wrong') : ''}">
                ${checkedAnswers[currentTaskIndex] ? (userAnswers[currentTaskIndex]?.toLowerCase() === task.answer.toLowerCase() ? 'Правильно!' : `Неверно. Правильный ответ: ${task.answer}`) : ''}
            </div>
        `;
        
        tasksContainer.appendChild(taskElement);
        
        // Обработчики событий
        const submitBtn = taskElement.querySelector('.submit-btn');
        const answerInput = taskElement.querySelector('.answer-input');
        const feedback = taskElement.querySelector('.feedback');
        
        submitBtn.addEventListener('click', function() {
            const userAnswer = answerInput.value.trim();
            userAnswers[currentTaskIndex] = userAnswer;
            checkedAnswers[currentTaskIndex] = true;
            
            if (userAnswer.toLowerCase() === task.answer.toLowerCase()) {
                feedback.textContent = 'Правильно!';
                feedback.className = 'feedback correct';
            } else {
                feedback.textContent = `Неверно. Правильный ответ: ${task.answer}`;
                feedback.className = 'feedback wrong';
            }
            
            updateProgress();
            updateNavigation();
        });
        
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }

    // Обновление прогресс-бара
    function updateProgress() {
        const answeredCount = checkedAnswers.filter(Boolean).length;
        const progress = (answeredCount / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
        
        finishBtn.style.display = answeredCount === totalTasks ? 'block' : 'none';
    }

    // Обновление навигации
    function updateNavigation() {
        prevBtn.disabled = currentTaskIndex === 0;
        nextBtn.disabled = currentTaskIndex === totalTasks - 1 || !checkedAnswers[currentTaskIndex];
    }

    // Показать результаты
    function showResults() {
        correctAnswers = tasks.reduce((count, task, index) => {
            return count + (checkedAnswers[index] && 
                   userAnswers[index]?.toLowerCase() === task.answer.toLowerCase() ? 1 : 0);
        }, 0);
        
        scoreElement.textContent = `${correctAnswers}/${totalTasks}`;
        
        const percentage = (correctAnswers / totalTasks) * 100;
        if (percentage >= 85) {
            resultMessage.textContent = 'Отличный результат! Вы отлично разбираетесь в линейных функциях.';
        } else if (percentage >= 60) {
            resultMessage.textContent = 'Хороший результат! Есть ещё что улучшить.';
        } else {
            resultMessage.textContent = 'Попробуйте ещё раз и изучите материал внимательнее.';
        }
        
        resultsSection.style.display = 'block';
        document.querySelector('.game-area').style.display = 'none';
    }

    // Перемешивание массива
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Обработчики событий
    nextBtn.addEventListener('click', function() {
        if (currentTaskIndex < totalTasks - 1) {
            currentTaskIndex++;
            renderTask();
            updateNavigation();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentTaskIndex > 0) {
            currentTaskIndex--;
            renderTask();
            updateNavigation();
        }
    });

    finishBtn.addEventListener('click', showResults);

    restartBtn.addEventListener('click', function() {
        initTest(currentDifficulty);
    });

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            initTest(this.dataset.difficulty);
        });
    });

    // Инициализация теста по умолчанию
    initTest('easy');
});