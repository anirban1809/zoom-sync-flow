import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CreateAutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const triggerOptions = [
  'Meeting ends',
  'Transcript complete',
  'Meeting tagged',
  'Keyword detected',
  'Participant joined',
  'Recording started',
];

const actionOptions = [
  'Create task',
  'Send email',
  'Update CRM',
  'Send notification',
  'Tag meeting',
  'Generate summary',
  'Extract action items',
];

export default function CreateAutomationModal({ open, onOpenChange }: CreateAutomationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const handleAddAction = (action: string) => {
    if (!selectedActions.includes(action)) {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const handleRemoveAction = (action: string) => {
    setSelectedActions(selectedActions.filter(a => a !== action));
  };

  const handleCreate = () => {
    // TODO: Implement automation creation logic
    console.log('Creating automation:', { name, description, trigger, actions: selectedActions });
    onOpenChange(false);
    // Reset form
    setName('');
    setDescription('');
    setTrigger('');
    setSelectedActions([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Automation</DialogTitle>
          <DialogDescription>
            Set up a workflow to automate tasks based on meeting events
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Automation Name</Label>
            <Input
              id="name"
              placeholder="e.g., Auto-create tasks from action items"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this automation does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger">Trigger Event</Label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger id="trigger">
                <SelectValue placeholder="Select a trigger event" />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Actions</Label>
            <Select onValueChange={handleAddAction}>
              <SelectTrigger>
                <SelectValue placeholder="Add an action" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions
                  .filter(action => !selectedActions.includes(action))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            {selectedActions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedActions.map((action) => (
                  <Badge key={action} variant="secondary" className="gap-1">
                    {action}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveAction(action)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!name || !trigger || selectedActions.length === 0}
          >
            Create Automation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
