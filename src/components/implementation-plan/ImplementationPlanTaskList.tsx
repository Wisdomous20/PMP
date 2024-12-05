'use client';

import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Task = {
  id: string;
  implementationPlanId: string; // This will be set when creating a task
  name: string;
  deadline: Date;
  checked: boolean;
};

interface TaskListProps {
  setTasks: Dispatch<SetStateAction<Task[]>>; // Accepts an array of Task
}

const TaskList: React.FC<TaskListProps> = ({ setTasks }) => {
  const [localTasks, setLocalTasks] = useState<Task[]>([]); // Local state for tasks

  const addTask = () => {
    const newTask: Task = {
      id: (localTasks.length + 1).toString(), 
      implementationPlanId: '', 
      name: '',
      deadline: new Date(), // Default to now, or you can set it to a specific date
      checked: false,
    };
    setLocalTasks([...localTasks, newTask]);
    setTasks([...localTasks, newTask]); // Update parent state
  };

  const updateTask = (id: string, name: string, deadline: Date, checked: boolean) => {
    const updatedTasks = localTasks.map(task => 
      task.id === id ? { ...task, name, deadline, checked } : task
    );
    setLocalTasks(updatedTasks);
    setTasks(updatedTasks); // Update parent state
  };

  return (
    <div>
      {localTasks.map(task => (
        <div key={task.id} className="flex items-center space-x-2">
          <Input
            value={task.name}
            onChange={(e) => updateTask(task.id, e.target.value, task.deadline, task.checked)}
            placeholder="Enter task name"
          />
          <Input
            type="date"
            value={task.deadline.toISOString().split('T')[0]} // Format date for input
            onChange={(e) => updateTask(task.id, task.name, new Date(e.target.value), task.checked)}
          />
          <Input
            type="checkbox"
            checked={task.checked}
            onChange={(e) => updateTask(task.id, task.name, task.deadline, e.target.checked)}
          />
        </div>
      ))}
      <Button onClick={addTask}>Add Task</Button>
    </div>
  );
};

export default TaskList;