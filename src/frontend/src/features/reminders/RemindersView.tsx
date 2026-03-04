import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Reminder, useReminders } from "./useReminders";

export function RemindersView() {
  const { reminders, addReminder, updateReminder, deleteReminder } =
    useReminders();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDueDate, setFormDueDate] = useState("");

  const handleAdd = () => {
    if (formTitle.trim() && formDueDate) {
      addReminder(formTitle.trim(), formDueDate);
      setFormTitle("");
      setFormDueDate("");
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
      setFormTitle("");
      setFormDueDate("");
    }
  };

  const handleCancelEdit = () => {
    setEditingReminder(null);
    setFormTitle("");
    setFormDueDate("");
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  return (
    <Card className="w-full bg-settings-pink border border-settings-crimson/40 shadow-none rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold text-settings-crimson flex items-center justify-between">
          <span>Reminders</span>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="w-7 h-7 border-2 border-settings-crimson text-settings-crimson bg-transparent hover:bg-settings-crimson hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-settings-pink border-2 border-settings-crimson/40">
              <DialogHeader>
                <DialogTitle className="text-settings-crimson">
                  Add Reminder
                </DialogTitle>
                <DialogDescription className="text-settings-crimson/60">
                  Create a new reminder with a title and due date
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-settings-crimson font-semibold">
                    Title
                  </Label>
                  <Input
                    placeholder="Enter reminder title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="bg-white text-settings-crimson border-2 border-settings-crimson/40 focus:ring-settings-crimson placeholder:text-settings-crimson/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-settings-crimson font-semibold">
                    Due Date &amp; Time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="bg-white text-settings-crimson border-2 border-settings-crimson/40 focus:ring-settings-crimson"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-2 border-settings-crimson text-settings-crimson bg-transparent hover:bg-settings-crimson hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!formTitle.trim() || !formDueDate}
                  className="bg-settings-crimson text-white hover:bg-settings-crimson-hover border-2 border-settings-crimson"
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
            <Clock className="w-8 h-8 text-settings-crimson/30" />
            <p className="text-sm text-settings-crimson/50 text-center">
              No reminders yet.
              <br />
              Tap + to add one.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-48 w-full rounded border border-settings-crimson/30">
            <div className="p-2 space-y-1">
              {sortedReminders.map((reminder) => {
                const isPast = new Date(reminder.dueDate) < new Date();
                return (
                  <div
                    key={reminder.id}
                    className={`flex items-center justify-between px-2 py-1.5 rounded border ${
                      isPast
                        ? "border-settings-crimson/20 bg-settings-pink-active/60"
                        : "border-settings-crimson/20 bg-settings-pink-active"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-sm font-semibold truncate text-settings-crimson ${
                          isPast ? "line-through opacity-60" : ""
                        }`}
                      >
                        {reminder.title}
                      </span>
                      <span className="text-xs text-settings-crimson/60">
                        {formatDisplayDate(reminder.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(reminder)}
                        className="w-6 h-6 text-settings-crimson hover:bg-settings-crimson hover:text-white"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        className="w-6 h-6 text-settings-crimson hover:bg-settings-crimson hover:text-white"
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
        <Dialog
          open={!!editingReminder}
          onOpenChange={(open) => !open && handleCancelEdit()}
        >
          <DialogContent className="bg-settings-pink border-2 border-settings-crimson/40">
            <DialogHeader>
              <DialogTitle className="text-settings-crimson">
                Edit Reminder
              </DialogTitle>
              <DialogDescription className="text-settings-crimson/60">
                Update the reminder details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-settings-crimson font-semibold">
                  Title
                </Label>
                <Input
                  placeholder="Enter reminder title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="bg-white text-settings-crimson border-2 border-settings-crimson/40 focus:ring-settings-crimson placeholder:text-settings-crimson/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-settings-crimson font-semibold">
                  Due Date &amp; Time
                </Label>
                <Input
                  type="datetime-local"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="bg-white text-settings-crimson border-2 border-settings-crimson/40 focus:ring-settings-crimson"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="border-2 border-settings-crimson text-settings-crimson bg-transparent hover:bg-settings-crimson hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!formTitle.trim() || !formDueDate}
                className="bg-settings-crimson text-white hover:bg-settings-crimson-hover border-2 border-settings-crimson"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
