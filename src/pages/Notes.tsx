import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Trash2, Edit, Save } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Team Standup Notes',
      content: 'Discussed Q4 goals and upcoming deadlines. Need to follow up on the marketing campaign.',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Project Ideas',
      content: 'Consider implementing automated email summaries for weekly meetings.',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = () => {
    if (newTitle.trim() || newContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newTitle.trim() || 'Untitled Note',
        content: newContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes([newNote, ...notes]);
      setNewTitle('');
      setNewContent('');
      setIsCreating(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, title: editTitle, content: editContent, updatedAt: new Date() }
          : note
      )
    );
    setEditingNote(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Create and manage your meeting notes</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <Input
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-lg font-semibold"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your note here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateNote}>
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredNotes.map((note) => (
          <Card key={note.id}>
            {editingNote === note.id ? (
              <>
                <CardHeader>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveEdit(note.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingNote(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{note.title}</CardTitle>
                      <CardDescription>
                        Last updated: {note.updatedAt.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
        </div>
      )}
    </div>
  );
}
