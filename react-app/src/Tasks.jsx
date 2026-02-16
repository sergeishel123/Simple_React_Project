import React, { useState, useEffect } from 'react';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('tasks');
        if (saved) setTasks(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (!input.trim()) return;
        setTasks([...tasks, {
            id: Date.now(),
            text: input,
            done: false,
            date: new Date().toLocaleDateString() // под Иркутское времм просто
        }]);
        setInput('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id == id ? {...t, done: !t.done} : t)); // Помечаем как выполненную, если поставили галочку
    };


    // Удалённые - просто не будем выводить, отфильтруем
    const clearDone = () => {
        setTasks(tasks.filter(t => !t.done));
    };

    const filtered = tasks.filter(t => 
        t.text.toLowerCase().includes(search.toLowerCase())
    );

    const total = tasks.length // всего заданий
    const done = tasks.filter(t => t.done).length; // выполненные задания


    // Если задача выполнена - просто вычёркиваем её(linethrough)
    return (
        <div style={{padding: 20}}>
            <h2>Мои задачи</h2>
            
            <div>
                <span>Всего: {total} | </span>
                <span>Выполнено: {done} | </span>
                <span>Осталось: {total - done}</span>
            </div>

            <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                placeholder= "Поиск"
            />

            <div>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Новая задача"
                />
                <button onClick={addTask}>Добавить</button>
            </div>

            {filtered.map(task => (
                <div key={task.id}>
                    <input 
                        type="checkbox" 
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                    />
                <span style={{textDecoration: task.done ? 'line-through' : 'none'}}> 
                        {task.text}
                    </span>
                    <small> {task.date}</small>
                </div>
            ))}

            {done > 0 && (
                <button onClick={clearDone}>
                    Удалить выполненные
                </button>
            )}
        </div>
    );
}
