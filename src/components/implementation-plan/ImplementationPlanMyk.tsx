/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import fetchGetImplementationPlanById from '@/domains/implementation-plan/services/fetchGetImplementationPlanById';
import fetchUpdateImplementationPlan from '@/domains/implementation-plan/services/fetchUpdateImplementationPlan';
import formatTimestamp from '@/utils/formatTimestamp';

interface Task {
  id: string;
  name: string;
  deadline: Date;
  confirmed: boolean;
  isEditing: boolean;
}

interface EditImplementationPlanProps {
  serviceRequest: ServiceRequest;
}

export default function EditImplementationPlan({ serviceRequest }: EditImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        const implementationPlan = await fetchGetImplementationPlanById(serviceRequest.id);
        const loadedTasks = implementationPlan.tasks.map((task: any) => ({
          id: task.id,
          name: task.name,
          deadline: new Date(task.deadline),
          confirmed: task.checked,
          isEditing: false,
        }));
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Failed to load implementation plan:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [serviceRequest.id]);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: 'New Task',
      deadline: new Date(),
      confirmed: false,
      isEditing: false,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, value: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, name: value } : task)));
  };

  const toggleConfirm = async (id: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, confirmed: !task.confirmed } : task)));
  };

  const toggleEditing = (id: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, isEditing: !task.isEditing } : task)));
  };

  async function handleUpdateImplementationPlan() {
    try {
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        name: task.name,
        deadline: task.deadline,
        checked: task.confirmed,
      }));

      await fetchUpdateImplementationPlan(serviceRequest.id, formattedTasks);
      console.log('Implementation Plan updated successfully');
    } catch (error) {
      console.error('Failed to update implementation plan:', error);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
          Edit Implementation Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Implementation Plan</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>loading</div>
        ) : (
          <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6 md:col-span-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name of requester</p>
                    <p className="font-medium">{serviceRequest.requesterName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Concern</p>
                    <p className="font-medium">{serviceRequest.concern}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Details of the Request</p>
                    <p className="font-medium">{serviceRequest.details}</p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <p className="font-semibold">Tasks</p>

                    {tasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-2"
                      >
                        <div
                          className="flex-grow p-2 rounded hover:bg-gray-100 cursor-pointer"
                          onClick={() => toggleEditing(task.id)}
                        >
                          {task.isEditing ? (
                            <Input
                              value={task.name}
                              onChange={(e) => updateTask(task.id, e.target.value)}
                              onBlur={() => toggleEditing(task.id)}
                              autoFocus
                            />
                          ) : (
                            <span className={task.confirmed ? 'line-through text-gray-500' : ''}>
                              {task.name}
                            </span>
                          )}
                        </div>

                        <Checkbox
                          checked={task.confirmed}
                          onCheckedChange={() => toggleConfirm(task.id)}
                          aria-label="Confirm task"
                        />
                      </motion.div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addTask}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  {serviceRequest.createdOn && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Request Date</p>
                      <p className="font-medium">{formatTimestamp(serviceRequest.createdOn)}</p>
                    </div>
                  )}
                  <Button
                    onClick={handleUpdateImplementationPlan}
                    className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Update Implementation Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
