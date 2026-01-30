'use client';

import React, { useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MoreHorizontal, Plus, Calendar,
    User, DollarSign, ArrowRight,
    CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { updateDealStageAction } from '@/app/actions/crm/deals';
import { toast } from 'sonner';

interface Deal {
    id: string;
    title: string;
    value: number;
    currency: string;
    stage_id: string | null;
    account?: { name: string } | null;
    owner?: { name: string | null } | null;
    expected_close_date?: Date | null;
}

interface Stage {
    id: string;
    name: string;
    type: string;
    sort_order: number;
    probability?: number | null;
}

interface Pipeline {
    id: string;
    name: string;
    stages: Stage[];
}

export function PipelineKanban({ pipeline, initialDeals }: { pipeline: Pipeline, initialDeals: any[] }) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const stages = useMemo(() => {
        return [...pipeline.stages].sort((a, b) => a.sort_order - b.sort_order);
    }, [pipeline.stages]);

    const dealsByStage = useMemo(() => {
        const grouped: Record<string, Deal[]> = {};
        stages.forEach(s => grouped[s.id] = []);
        deals.forEach(d => {
            if (d.stage_id && grouped[d.stage_id]) {
                grouped[d.stage_id].push(d);
            }
        });
        return grouped;
    }, [deals, stages]);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const dealId = active.id as string;
        const overId = over.id as string;

        // Find which stage we dropped into
        let newStageId = overId;
        // If dropped over a card, find its stage
        const overDeal = deals.find(d => d.id === overId);
        if (overDeal) {
            newStageId = overDeal.stage_id || stages[0].id;
        }

        const activeDeal = deals.find(d => d.id === dealId);
        if (!activeDeal || activeDeal.stage_id === newStageId) return;

        // Optimistic UI Update
        const oldDeals = [...deals];
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage_id: newStageId } : d));

        // API Call
        const result = await updateDealStageAction(dealId, newStageId);
        if (result?.error) {
            toast.error(result.error);
            setDeals(oldDeals);
        } else {
            toast.success(`Deal moved to ${stages.find(s => s.id === newStageId)?.name}`);
        }
    }

    const activeDeal = activeId ? deals.find(d => d.id === activeId) : null;

    return (
        <div className="h-full w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 p-6 h-full min-w-max">
                    {stages.map(stage => (
                        <KanbanColumn
                            key={stage.id}
                            stage={stage}
                            deals={dealsByStage[stage.id] || []}
                        />
                    ))}
                </div>

                <DragOverlay dropAnimation={{
                    duration: 250,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}>
                    {activeDeal ? (
                        <div className="rotate-3 scale-105 opacity-90 shadow-2xl pointer-events-none">
                            <KanbanCard deal={activeDeal} isDragging />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

function KanbanColumn({ stage, deals }: { stage: Stage, deals: Deal[] }) {
    const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const winRate = stage.name.toLowerCase().includes('won') ? '💯' : (stage.probability ? `${stage.probability}%` : '');

    // Define colors based on stage types
    const getColorClass = () => {
        const name = stage.name.toLowerCase();
        if (name.includes('won') || name.includes('closed')) return 'from-emerald-500 to-teal-500';
        if (name.includes('lost')) return 'from-rose-500 to-pink-500';
        if (name.includes('propos') || name.includes('negotiat')) return 'from-indigo-500 to-violet-500';
        if (name.includes('qualif')) return 'from-amber-500 to-orange-500';
        return 'from-blue-500 to-indigo-500';
    };

    return (
        <div className="w-80 flex flex-col h-full group">
            {/* Column Header */}
            <div className="mb-4 flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full bg-gradient-to-tr", getColorClass())} />
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight uppercase">
                            {stage.name}
                        </h3>
                        <span className="bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            {deals.length}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 font-mono">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: deals[0]?.currency || 'USD' }).format(totalValue)}
                    </span>
                    {winRate && <span className="text-[10px] text-slate-400 dark:text-zinc-600 font-bold">{winRate} Success</span>}
                </div>
            </div>

            {/* Droppable Area */}
            <div className="flex-1 bg-slate-100/30 dark:bg-zinc-900/10 rounded-2xl p-2 border border-dashed border-slate-200 dark:border-zinc-800/50 hover:border-indigo-500/30 transition-colors overflow-y-auto scrollbar-none">
                <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3 pb-20">
                        {deals.map(deal => (
                            <KanbanCard key={deal.id} deal={deal} />
                        ))}
                    </div>
                </SortableContext>

                {deals.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-slate-300 dark:text-zinc-800 border-2 border-dashed border-slate-100 dark:border-zinc-900/50 rounded-xl mt-2">
                        <Plus className="w-5 h-5 opacity-20" />
                    </div>
                )}
            </div>
        </div>
    );
}

function KanbanCard({ deal, isDragging }: { deal: Deal, isDragging?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: deal.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: deal.currency || 'USD',
        maximumFractionDigits: 0
    }).format(deal.value);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800",
                "hover:shadow-md hover:border-indigo-400/50 dark:hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50 ring-2 ring-indigo-500 scale-95"
            )}
        >
            <div className="flex flex-col gap-3">
                {/* Title and Value */}
                <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {deal.title}
                    </h4>
                </div>

                {/* Account / Company */}
                {deal.account && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{deal.account.name}</span>
                    </div>
                )}

                {/* Footer Partition */}
                <div className="pt-3 mt-1 border-t border-slate-50 dark:border-zinc-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[11px] font-black tracking-tight">
                            {formattedValue}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {deal.expected_close_date && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(deal.expected_close_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        )}
                        <Avatar className="h-5 w-5 border border-white dark:border-zinc-800">
                            <AvatarFallback className="text-[8px] bg-slate-100 dark:bg-zinc-800">
                                {deal.owner?.name?.substring(0, 1) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none rounded-xl transition-opacity" />
        </div>
    );
}
