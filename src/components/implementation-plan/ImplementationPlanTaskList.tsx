import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskListProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const ImplementationPlanTaskList: React.FC<TaskListProps> = ({ setTasks }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDeadline, setTaskDeadline] = useState<Date | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    if (taskName && taskDeadline) {
      const newTask: Task = {
        id: '',
        name: taskName,
        deadline: taskDeadline,
        checked: false,
      };
      setLocalTasks(prevTasks => [...prevTasks, newTask]);
      setTasks(prevTasks => [...prevTasks, newTask]); 
      setTaskName('');
      setTaskDeadline(null);
    }
  };

  const updateTask = (id: string, name: string, deadline: Date, checked: boolean) => {
    const updatedTasks = localTasks.map(task => 
      task.id === id ? { ...task, name, deadline, checked } : task
    );
    setLocalTasks(updatedTasks);
    setTasks(updatedTasks); 
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tasks</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
          className="flex-1"
        />
        <Input
          type="date"
          value={taskDeadline ? taskDeadline.toISOString().split('T')[0] : ''}
          onChange={(e) => setTaskDeadline(new Date(e.target.value))}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddTask}
          className="bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {localTasks.map(task => (
        <div key={task.id} className="flex items-center space-x-2">
          <Input
            value={task.name}
            onChange={(e) => updateTask(task.id, e.target.value, task.deadline, task.checked)}
            placeholder="Enter task name"
            className="flex-1"
          />
          <Input
            type="date"
            value={task.deadline.toISOString().split('T')[0]} // Format date for input
            onChange={(e) => updateTask(task.id, task.name, new Date(e.target.value), task.checked)}
            className="flex-1"
          />
          <Input
            type="checkbox"
            checked={task.checked}
            onChange={(e) => updateTask(task.id, task.name, task.deadline, e.target.checked)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImplementationPlanTaskList;