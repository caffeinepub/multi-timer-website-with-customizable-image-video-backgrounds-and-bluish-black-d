import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
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

  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Card className="w-full bg-white border-2 border-black shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-black flex items-center justify-between">
          <span>Reminders</span>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="w-7 h-7 border-2 border-black text-black hover:bg-black hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-black">
              <DialogHeader>
                <DialogTitle className="text-black">Add Reminder</DialogTitle>
                <DialogDescription className="text-black/60">
                  Create a new reminder with a title and due date
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-black font-semibold">Title</Label>
                  <Input
                    placeholder="Enter reminder title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="bg-white text-black border-2 border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-black font-semibold">Due Date &amp; Time</Label>
                  <Input
                    type="datetime-local"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="bg-white text-black border-2 border-black focus:ring-black"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-2 border-black text-black hover:bg-black hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!formTitle.trim() || !formDueDate}
                  className="bg-black text-white hover:bg-black/80 border-2 border-black"
                >
                  Add Reminder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {sortedReminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Clock className="w-8 h-8 text-black/30" />
            <p className="text-sm text-black/50 text-center">
              No reminders yet.<br />Tap + to add one.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-48 w-full rounded border-2 border-black">
            <div className="p-2 space-y-1">
              {sortedReminders.map((reminder) => {
                const isPast = new Date(reminder.dueDate) < new Date();
                return (
                  <div
                    key={reminder.id}
                    className={`flex items-center justify-between px-2 py-1.5 rounded border ${
                      isPast ? 'border-black/30 bg-black/5' : 'border-black/20 bg-white'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-sm font-semibold truncate text-black ${
                          isPast ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {reminder.title}
                      </span>
                      <span className="text-xs text-black/60">
                        {formatDisplayDate(reminder.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(reminder)}
                        className="w-6 h-6 text-black hover:bg-black hover:text-white"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        className="w-6 h-6 text-black hover:bg-black hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingReminder} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="bg-white border-2 border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Edit Reminder</DialogTitle>
              <DialogDescription className="text-black/60">
                Update the reminder details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-black font-semibold">Title</Label>
                <Input
                  placeholder="Enter reminder title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="bg-white text-black border-2 border-black focus:ring-black"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-semibold">Due Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="bg-white text-black border-2 border-black focus:ring-black"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="border-2 border-black text-black hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!formTitle.trim() || !formDueDate}
                className="bg-black text-white hover:bg-black/80 border-2 border-black"
              >
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
