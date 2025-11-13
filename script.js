function validateForm() {
    let isValid = true;
    
    // Проверка поля "Вид работы"
    const workType = document.getElementById('workType');
    const workTypeError = document.getElementById('workTypeError');
    if (!workType.value || workType.value === "") {
        workTypeError.textContent = 'Пожалуйста, выберите вид работы';
        workTypeError.style.display = 'block';
        workType.classList.add('error-field');
        isValid = false;
    } else {
        workTypeError.style.display = 'none';
        workType.classList.remove('error-field');
    }
    
    // Проверка поля "Тема"
    const topic = document.getElementById('topic');
    const topicError = document.getElementById('topicError');
    if (!topic.value.trim()) {
        topicError.textContent = 'Пожалуйста, укажите тему работы';
        topicError.style.display = 'block';
        topic.classList.add('error-field');
        isValid = false;
    } else {
        topicError.style.display = 'none';
        topic.classList.remove('error-field');
    }
    
    return isValid;
}

/**
 * Сохраняет задачу и переходит на страницу задач
 */
function saveTask() {
    const btn = document.getElementById('saveBtn');
    
    // Проверяем валидность формы
    if (!validateForm()) {
        return;
    }
    
    // Блокируем кнопку на время сохранения
    btn.disabled = true;
    btn.classList.add('saving');
    
    // Получаем значения из полей
    const workType = document.getElementById('workType').value;
    const topic = document.getElementById('topic').value.trim();
    const additionalInfo = document.getElementById('additionalInfo').value.trim();
    
    // Создаем объект задачи
    const task = {
        workType,
        topic,
        additionalInfo,
        id: Date.now()
    };
    
    // Получаем и обновляем список задач
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Визуальный эффект успешного сохранения
    btn.classList.remove('saving');
    btn.classList.add('saved');
    
    // Переход после небольшой задержки для UX
    setTimeout(() => {
        window.location.href = 'tasks.html';
    }, 500);
}

/**
 * Отображает все задачи на странице
 */
function displayTasks() {
    const tasksContainer = document.getElementById('tasksContainer');
    if (!tasksContainer) return;
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="no-tasks">У вас пока нет сохраненных задач.</p>';
        return;
    }
    
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task" data-id="${task.id}">
            <h3>${getWorkTypeName(task.workType)}</h3>
            <p><strong>Тема:</strong> ${task.topic}</p>
            ${task.additionalInfo ? `<p><strong>Доп. информация:</strong> ${task.additionalInfo}</p>` : ''}
            <button class="delete-btn" onclick="deleteTask(${task.id})">Удалить</button>
        </div>
    `).join('');
}

/**
 * Удаляет задачу по ID
 */
function deleteTask(taskId) {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

/**
 * Инициализация приложения
 */
function init() {
    // На странице добавления задачи
    if (document.getElementById('saveBtn')) {
        document.getElementById('saveBtn').addEventListener('click', saveTask);
        
        // Валидация при изменении полей
        document.getElementById('workType').addEventListener('change', function() {
            if (!this.value) {
                document.getElementById('workTypeError').style.display = 'block';
                this.classList.add('error-field');
            } else {
                document.getElementById('workTypeError').style.display = 'none';
                this.classList.remove('error-field');
            }
        });
        
        document.getElementById('topic').addEventListener('input', function() {
            if (this.value.trim()) {
                document.getElementById('topicError').style.display = 'none';
                this.classList.remove('error-field');
            }
        });
    }
    
    displayTasks();
}

function getWorkTypeName(value) {
    const types = {
        "1": "Курсовые работы",
        "2": "Дипломные работы",
        "3": "Эссе",
        "4": "Контрольные работы",
        "5": "Лабораторные работы",
        "6": "Рефераты"
    };
    return types[value] || value;
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);