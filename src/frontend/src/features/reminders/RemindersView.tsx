import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { useReminders, type Reminder } from './useReminders';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RemindersView() {
  const { reminders, addReminder, updateReminder, deleteReminder } = useReminders();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDueDate, setFormDueDate] = useState('');

  const handleAdd = () => {
    if (formTitle.trim() && formDueDate) {
      addReminder(formTitle.trim(), formDueDate);
      setFormTitle('');
      setFormDueDate('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormTitle(reminder.title);
    setFormDueDate(reminder.dueDate);
  };

  const handleUpdate = () => {
    if (editingReminder && formTitle.trim() && formDueDate) {
      updateReminder(editingReminder.id, formTitle.trim(), formDueDate);
      setEditingReminder(null);
      setFormTitle('');
      setFormDueDate('');
    }
  };

  const handleCancelEdit = () => {
    setEditingReminder(null);
    setFormTitle('');
    setFormDueDate('');
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const sortedReminders = [...reminders].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reminders</CardTitle>
            <CardDescription>Keep track of important tasks and deadlines</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Reminder</DialogTitle>
                <DialogDescription>Create a new reminder with a title and due date</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="add-title">Title</Label>
                  <Input
                    id="add-title"
                    placeholder="Enter reminder title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-due-date">Due Date & Time</Label>
                  <Input
                    id="add-due-date"
                    type="datetime-local"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={!formTitle.trim() || !formDueDate}>
                  Add Reminder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No reminders yet</p>
            <p className="text-xs text-muted-foreground">Click "Add" to create your first reminder</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {sortedReminders.map((reminder) => (
                <Card key={reminder.id} className="bg-background/50">
                  <CardContent className="flex items-start justify-between p-4">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium leading-none">{reminder.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDisplayDate(reminder.dueDate)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(reminder)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <Dialog open={!!editingReminder} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Reminder</DialogTitle>
              <DialogDescription>Update the reminder details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter reminder title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date & Time</Label>
                <Input
                  id="edit-due-date"
                  type="datetime-local"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={!formTitle.trim() || !formDueDate}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
