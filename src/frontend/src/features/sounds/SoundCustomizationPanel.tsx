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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Link as LinkIcon,
  Music,
  Pencil,
  Play,
  Plus,
  Trash2,
  Upload,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCustomSounds } from "./CustomSoundsProvider";
import { getMaxCustomSounds } from "./customSoundsStorage";
import type { CustomSound } from "./customSoundsStorage";
import { useSoundPanelVisibility } from "./useSoundPanelVisibility";

export function SoundCustomizationPanel() {
  const {
    sounds,
    volume,
    setVolume,
    addSound,
    addSoundFromFile,
    updateSound,
    removeSound,
    reorderSounds,
    previewSound,
    canAddMore,
  } = useCustomSounds();
  const { isVisible, toggle } = useSoundPanelVisibility();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [addMode, setAddMode] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const soundsRef = useRef<HTMLDivElement>(null);

  const handleAddUrl = () => {
    if (addSound(formName, formUrl)) {
      setFormName("");
      setFormUrl("");
      setIsAddDialogOpen(false);
    }
  };

  const handleAddFile = async () => {
    if (!selectedFile) {
      return;
    }

    const success = await addSoundFromFile(
      formName || selectedFile.name.replace(/\.[^/.]+$/, ""),
      selectedFile,
    );
    if (success) {
      setFormName("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsAddDialogOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formName) {
        setFormName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleEdit = (id: string) => {
    const sound = sounds.find((s) => s.id === id);
    if (sound) {
      setFormName(sound.name);
      setFormUrl(sound.url);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (editingId && updateSound(editingId, formName, formUrl)) {
      setFormName("");
      setFormUrl("");
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setFormName("");
    setFormUrl("");
    setEditingId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...sounds];
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1],
      ];
      reorderSounds(newOrder);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < sounds.length - 1) {
      const newOrder = [...sounds];
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
      reorderSounds(newOrder);
    }
  };

  // Drag and drop handlers
  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    const target = e.target as HTMLElement;
    if (!target.closest("[data-drag-handle]")) {
      return;
    }

    e.preventDefault();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDraggedIndex(index);
    isDragging.current = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartPos.current) return;

      const dx = moveEvent.clientX - dragStartPos.current.x;
      const dy = moveEvent.clientY - dragStartPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        isDragging.current = true;
      }

      if (isDragging.current && soundsRef.current) {
        const soundItems = Array.from(
          soundsRef.current.querySelectorAll("[data-sound-index]"),
        );
        let newOverIndex: number | null = null;

        for (let i = 0; i < soundItems.length; i++) {
          const item = soundItems[i] as HTMLElement;
          const rect = item.getBoundingClientRect();
          if (
            moveEvent.clientY >= rect.top &&
            moveEvent.clientY <= rect.bottom
          ) {
            newOverIndex = i;
            break;
          }
        }

        setDragOverIndex(newOverIndex);
      }
    };

    const handlePointerUp = () => {
      if (
        isDragging.current &&
        draggedIndex !== null &&
        dragOverIndex !== null &&
        draggedIndex !== dragOverIndex
      ) {
        const newOrder = [...sounds];
        const [removed] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(dragOverIndex, 0, removed);
        reorderSounds(newOrder);
      }

      setDraggedIndex(null);
      setDragOverIndex(null);
      dragStartPos.current = null;
      isDragging.current = false;

      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  useEffect(() => {
    return () => {
      setDraggedIndex(null);
      setDragOverIndex(null);
    };
  }, []);

  return (
    <div className="fixed bottom-12 left-0 right-0 z-20">
      {/* Toggle Button */}
      <div className="flex justify-center mb-1">
        <Button
          onClick={toggle}
          size="sm"
          variant="outline"
          className="h-6 px-3 gap-1.5 bg-settings-pink text-settings-crimson border border-settings-crimson/20 shadow-md hover:bg-settings-pink-active hover:text-settings-crimson"
        >
          <Music className="h-3 w-3" />
          <span className="text-xs">Custom Sounds</span>
          <ChevronUp
            className={`h-3 w-3 transition-transform ${isVisible ? "" : "rotate-180"}`}
          />
        </Button>
      </div>

      {/* Collapsible Panel */}
      {isVisible && (
        <div className="border-t bg-settings-pink border-settings-crimson/20 shadow-lg">
          <div className="container mx-auto px-2 py-1">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="px-0 py-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <CardTitle className="text-xs text-settings-crimson">
                      Manage Sounds
                    </CardTitle>
                    <span className="text-[10px] text-settings-crimson/60">
                      ({sounds.length}/{getMaxCustomSounds()})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Volume control */}
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="h-3 w-3 text-settings-crimson/70 shrink-0" />
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[Math.round(volume * 100)]}
                        onValueChange={([val]) => setVolume(val / 100)}
                        className="w-20 [&_[data-slot=slider-track]]:bg-settings-crimson/20 [&_[data-slot=slider-range]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:border-settings-crimson"
                        aria-label="Preview volume"
                      />
                      <span className="text-[10px] text-settings-crimson w-7 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                    <Dialog
                      open={isAddDialogOpen}
                      onOpenChange={setIsAddDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          disabled={!canAddMore}
                          className="gap-1 h-6 text-xs px-2 bg-settings-pink text-settings-crimson border border-settings-crimson/30 hover:bg-settings-pink-active"
                        >
                          <Plus className="h-3 w-3" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-settings-pink border-settings-crimson/20">
                        <DialogHeader>
                          <DialogTitle className="text-settings-crimson">
                            Add Custom Sound
                          </DialogTitle>
                          <DialogDescription className="text-settings-crimson/70">
                            Add a custom sound by URL (including YouTube links)
                            or upload an audio file.
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs
                          value={addMode}
                          onValueChange={(v) =>
                            setAddMode(v as "url" | "upload")
                          }
                        >
                          <TabsList className="grid w-full grid-cols-2 bg-settings-pink-active">
                            <TabsTrigger
                              value="url"
                              className="text-settings-crimson data-[state=active]:bg-settings-pink data-[state=active]:text-settings-crimson"
                            >
                              <LinkIcon className="mr-2 h-4 w-4" />
                              URL
                            </TabsTrigger>
                            <TabsTrigger
                              value="upload"
                              className="text-settings-crimson data-[state=active]:bg-settings-pink data-[state=active]:text-settings-crimson"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="url" className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="sound-name"
                                className="text-settings-crimson"
                              >
                                Name
                              </Label>
                              <Input
                                id="sound-name"
                                placeholder="My Custom Sound"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="border-settings-crimson/30 text-settings-crimson placeholder:text-settings-crimson/40 bg-settings-pink-active"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="sound-url"
                                className="text-settings-crimson"
                              >
                                URL
                              </Label>
                              <Input
                                id="sound-url"
                                placeholder="https://example.com/sound.mp3 or YouTube URL"
                                value={formUrl}
                                onChange={(e) => setFormUrl(e.target.value)}
                                className="border-settings-crimson/30 text-settings-crimson placeholder:text-settings-crimson/40 bg-settings-pink-active"
                              />
                            </div>
                          </TabsContent>
                          <TabsContent value="upload" className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="sound-name-upload"
                                className="text-settings-crimson"
                              >
                                Name
                              </Label>
                              <Input
                                id="sound-name-upload"
                                placeholder="My Custom Sound"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="border-settings-crimson/30 text-settings-crimson placeholder:text-settings-crimson/40 bg-settings-pink-active"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="sound-file"
                                className="text-settings-crimson"
                              >
                                Audio File
                              </Label>
                              <Input
                                id="sound-file"
                                type="file"
                                accept="audio/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="border-settings-crimson/30 text-settings-crimson bg-settings-pink-active"
                              />
                              {selectedFile && (
                                <p className="text-sm text-settings-crimson/70">
                                  Selected: {selectedFile.name}
                                </p>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                        <DialogFooter>
                          {addMode === "url" ? (
                            <Button
                              onClick={handleAddUrl}
                              disabled={!formName.trim() || !formUrl.trim()}
                              className="bg-settings-pink text-settings-crimson border border-settings-crimson/30 hover:bg-settings-pink-active"
                            >
                              Add Sound
                            </Button>
                          ) : (
                            <Button
                              onClick={handleAddFile}
                              disabled={!selectedFile}
                              className="bg-settings-pink text-settings-crimson border border-settings-crimson/30 hover:bg-settings-pink-active"
                            >
                              Upload Sound
                            </Button>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0.5">
                {sounds.length === 0 ? (
                  <p className="text-center text-[10px] text-settings-crimson/60 py-1">
                    No custom sounds yet. Click "Add" to create one.
                  </p>
                ) : (
                  <ScrollArea className="h-12">
                    <div ref={soundsRef} className="space-y-0.5">
                      {sounds.map((sound, index) => (
                        <div
                          key={sound.id}
                          data-sound-index={index}
                          onPointerDown={(e) => handlePointerDown(e, index)}
                          className={`flex items-center gap-1 rounded border bg-settings-pink-active border-settings-crimson/20 p-0.5 transition-opacity ${
                            draggedIndex === index ? "opacity-50" : ""
                          } ${dragOverIndex === index ? "border-settings-crimson" : ""}`}
                        >
                          <button
                            type="button"
                            data-drag-handle
                            className="cursor-grab active:cursor-grabbing touch-none p-0.5"
                            aria-label="Drag to reorder"
                          >
                            <GripVertical className="h-3 w-3 text-settings-crimson/50" />
                          </button>
                          <div className="flex-1 min-w-0">
                            {editingId === sound.id ? (
                              <div className="flex gap-1">
                                <Input
                                  value={formName}
                                  onChange={(e) => setFormName(e.target.value)}
                                  placeholder="Name"
                                  className="h-5 text-xs border-settings-crimson/30 text-settings-crimson bg-settings-pink"
                                />
                                <Input
                                  value={formUrl}
                                  onChange={(e) => setFormUrl(e.target.value)}
                                  placeholder="URL"
                                  className="h-5 text-xs border-settings-crimson/30 text-settings-crimson bg-settings-pink"
                                />
                              </div>
                            ) : (
                              <div className="truncate">
                                <span className="text-xs font-medium text-settings-crimson">
                                  {sound.name}
                                </span>
                                <span className="text-[10px] text-settings-crimson/60 ml-1 truncate">
                                  {sound.url.startsWith("data:")
                                    ? "(uploaded file)"
                                    : sound.url}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {editingId === sound.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleUpdate}
                                  className="h-5 w-5 p-0 text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
                                >
                                  <span className="text-xs">✓</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                  className="h-5 w-5 p-0 text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
                                >
                                  <span className="text-xs">✕</span>
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => previewSound(sound.url)}
                                  className="h-5 w-5 p-0 text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
                                >
                                  <Play className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(sound.id)}
                                  className="h-5 w-5 p-0 text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeSound(sound.id)}
                                  className="h-5 w-5 p-0 text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <div className="flex flex-col">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    className="h-2.5 w-4 p-0 text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
                                  >
                                    <ChevronUp className="h-2.5 w-2.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === sounds.length - 1}
                                    className="h-2.5 w-4 p-0 text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
                                  >
                                    <ChevronDown className="h-2.5 w-2.5" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
