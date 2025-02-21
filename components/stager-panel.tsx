"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Timer, Trash2, GripVertical, Plus, Play, StopCircle, Settings } from 'lucide-react';
import { StagedRelay, Sequence } from "@/lib/types";
import { SequenceVisualizer } from "./sequence-visualizer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StagerPanelProps {
  sequence: Sequence;
  setSequence: (steps: StagedRelay[]) => void;
  setCurrentNode: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function StagerPanel({ sequence, setSequence, setCurrentNode }: StagerPanelProps) {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const { toast } = useToast();

  const stagedRelays: StagedRelay[] = sequence.steps.map((step, index) => ({
    id: `${step.nodeId}-${step.relayId}`,
    relayId: step.relayId,
    nodeId: step.nodeId,
    delay: step.delay,
    status: 'pending'
  }));

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(stagedRelays);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSequence(items);
  }, [stagedRelays, setSequence]);

  const addRelay = useCallback((nodeId: string, relayId: number, delay: number) => {
    const newRelay: StagedRelay = {
      id: Math.random().toString(36).substr(2, 9),
      relayId,
      nodeId,
      delay,
      status: 'pending',
    };
    setSequence([...stagedRelays, newRelay]);
  }, [stagedRelays, setSequence]);

  const removeRelay = useCallback((id: string) => {
    setSequence(stagedRelays.filter((relay) => relay.id !== id));
  }, [stagedRelays, setSequence]);

  const updateDelay = useCallback((id: string, delay: number) => {
    setSequence(
      stagedRelays.map((relay) =>
        relay.id === id ? { ...relay, delay } : relay
      )
    );
  }, [stagedRelays, setSequence]);

  const runSequence = useCallback(() => {
    setRunning(true);
    setCurrentStep(0);
    toast({
      title: "Sequence Started",
      description: "The relay sequence is now running.",
    });
  }, [toast]);

  const stopSequence = useCallback(() => {
    setRunning(false);
    setCurrentStep(-1);
    setCurrentNode(undefined);
    toast({
      title: "Sequence Stopped",
      description: "The relay sequence has been stopped.",
      variant: "destructive",
    });
  }, [setCurrentNode, toast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running && currentStep < stagedRelays.length) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setCurrentNode(stagedRelays[currentStep].id);
      }, stagedRelays[currentStep].delay * 1000);
    } else if (running && currentStep >= stagedRelays.length) {
      setRunning(false);
      setCurrentStep(-1);
      setCurrentNode(undefined);
      toast({
        title: "Sequence Complete",
        description: "All relays in the sequence have been fired.",
      });
    }
    return () => clearTimeout(timer);
  }, [running, currentStep, stagedRelays, setCurrentNode, toast]);

  return (
    <div className="space-y-6">
      <SequenceVisualizer
        sequence={sequence}
        isRunning={running}
        currentStep={currentStep}
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sequence Stager</h2>
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={running}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Relay
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Relay</DialogTitle>
                </DialogHeader>
                <AddRelayForm onAdd={(nodeId, relayId, delay) => {
                  addRelay(nodeId, relayId, delay);
                  toast({
                    title: "Relay Added",
                    description: `Node ${nodeId}, Relay ${relayId} added with ${delay}s delay.`,
                  });
                }} />
              </DialogContent>
            </Dialog>
            <Button
              variant={running ? "destructive" : "default"}
              onClick={running ? stopSequence : runSequence}
            >
              {running ? (
                <>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Sequence
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Sequence
                </>
              )}
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sequence">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {stagedRelays.map((relay, index) => (
                  <Draggable
                    key={relay.id}
                    draggableId={relay.id}
                    index={index}
                    isDragDisabled={running}
                  >
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 ${snapshot.isDragging ? 'bg-secondary-focus' : 'bg-secondary'} transition-colors duration-200`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className="flex-1 font-medium">
                            Node {relay.nodeId}, Relay {relay.relayId}
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            <Input
                              type="number"
                              value={relay.delay}
                              onChange={(e) =>
                                updateDelay(
                                  relay.id,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-20"
                              min={0}
                              step={0.1}
                              disabled={running}
                            />
                            <span className="text-sm">sec</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRelay(relay.id)}
                            disabled={running}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {stagedRelays.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            Add relays to create a sequence
          </Card>
        )}
      </Card>
    </div>
  );
}

function AddRelayForm({ onAdd }: { onAdd: (nodeId: string, relayId: number, delay: number) => void }) {
  const [nodeId, setNodeId] = useState("node1");
  const [relayId, setRelayId] = useState(1);
  const [delay, setDelay] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(nodeId, relayId, delay);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nodeId">Node ID</Label>
        <Select value={nodeId} onValueChange={setNodeId}>
          <SelectTrigger id="nodeId" className="w-full">
            <SelectValue placeholder="Select node" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="node1">Node 1</SelectItem>
            <SelectItem value="node2">Node 2</SelectItem>
            <SelectItem value="node3">Node 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="relayId">Relay ID</Label>
        <Input
          id="relayId"
          type="number"
          value={relayId}
          onChange={(e) => setRelayId(parseInt(e.target.value))}
          min={1}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="delay">Delay (seconds)</Label>
        <Input
          id="delay"
          type="number"
          value={delay}
          onChange={(e) => setDelay(parseFloat(e.target.value))}
          min={0}
          step={0.1}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">Add Relay</Button>
    </form>
  );
}

