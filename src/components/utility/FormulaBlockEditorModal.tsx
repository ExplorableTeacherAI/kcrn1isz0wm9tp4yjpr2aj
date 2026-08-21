import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditing } from '@/contexts/EditingContext';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { COLOR_PRESETS_NAMED, BRAND_GREEN, ACCENT_VIOLET } from './editorColors';
import { createPortal } from 'react-dom';

// ─── Colored term row editor ──────────────

interface TermRowProps {
    termName: string;
    content: string;
    color: string;
    onUpdate: (termName: string, content: string, color: string) => void;
    onRemove: (termName: string) => void;
}

const TermRow: React.FC<TermRowProps> = ({ termName, content, color, onUpdate, onRemove }) => {
    const [localContent, setLocalContent] = useState(content);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (showColorPicker && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPickerPos({ top: rect.bottom + 8 + window.scrollY, left: rect.left + window.scrollX - 100 });
        }
    }, [showColorPicker]);

    useEffect(() => {
        if (!showColorPicker) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!buttonRef.current?.contains(target) && !target.closest('.color-picker-portal')) {
                setShowColorPicker(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showColorPicker]);

    return (
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
            <span className="text-xs font-mono text-muted-foreground min-w-[60px]">{termName}</span>
            <input
                type="text"
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                onBlur={() => onUpdate(termName, localContent, color)}
                className="flex-1 px-2 py-1 text-sm bg-background border rounded"
                placeholder="Content"
            />
            <button
                ref={buttonRef}
                className="w-6 h-6 rounded border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Change color"
            />
            {showColorPicker && createPortal(
                <div
                    className="color-picker-portal fixed z-[10000] bg-popover text-popover-foreground border rounded-lg shadow-xl p-3 grid grid-cols-5 gap-2 animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: pickerPos.top, left: Math.max(10, Math.min(window.innerWidth - 180, pickerPos.left)), width: '180px' }}
                >
                    {COLOR_PRESETS_NAMED.map((preset) => (
                        <button
                            key={preset.value}
                            className={cn(
                                "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
                                color.toLowerCase() === preset.value.toLowerCase() ? "border-foreground ring-2 ring-offset-1 ring-foreground/20" : "border-transparent"
                            )}
                            style={{ backgroundColor: preset.value }}
                            onClick={() => { onUpdate(termName, localContent, preset.value); setShowColorPicker(false); }}
                            title={preset.name}
                        />
                    ))}
                </div>,
                document.body
            )}
            <button
                onClick={() => onRemove(termName)}
                className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                title="Remove term"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// ─── Main modal ─────────────────────────────────────────────────────────────────

export const FormulaBlockEditorModal: React.FC = () => {
    const { editingFormulaBlock, closeFormulaBlockEditor, saveFormulaBlockEdit } = useEditing();

    const [latex, setLatex] = useState('');
    const [wrapperColor, setWrapperColor] = useState<string | undefined>(undefined);
    const [colorMap, setColorMap] = useState<Record<string, string>>({});
    const [colorTerms, setColorTerms] = useState<{ name: string; content: string; color: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'latex' | 'terms'>('latex');

    const previewRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initialize state when modal opens
    useEffect(() => {
        if (editingFormulaBlock) {
            const props = editingFormulaBlock;
            setLatex(props.latex || '');
            setWrapperColor(props.color);
            setColorMap(props.colorMap || {});
            setActiveTab('latex');

            // Parse colored terms from \clr{name}{content}
            parseTermsFromLatex(props.latex || '', props.colorMap || {});

        }
    }, [editingFormulaBlock]);

    // Parse \clr{term}{content}
    const parseTermsFromLatex = useCallback((latexStr: string, currentColors: Record<string, string>) => {
        const pattern = /\\clr\s*\{\s*([^}]+)\s*\}\s*\{\s*([^}]+)\s*\}/g;
        const foundTerms: { name: string; content: string; color: string }[] = [];
        const seenNames = new Set<string>();
        let match;

        const updatedColors = { ...currentColors };
        let hasNewColors = false;

        while ((match = pattern.exec(latexStr)) !== null) {
            const [, termName, content] = match;
            const cleanName = termName.trim();
            if (seenNames.has(cleanName)) continue;
            seenNames.add(cleanName);

            if (!updatedColors[cleanName]) {
                const defaultColor = COLOR_PRESETS_NAMED[foundTerms.length % COLOR_PRESETS_NAMED.length].value;
                updatedColors[cleanName] = defaultColor;
                hasNewColors = true;
            }

            foundTerms.push({ name: cleanName, content: content.trim(), color: updatedColors[cleanName] });
        }

        setColorTerms(foundTerms);
        if (hasNewColors) setColorMap(updatedColors);
    }, []);

    // Render preview
    useEffect(() => {
        if (!previewRef.current || !latex) {
            if (previewRef.current && !latex) previewRef.current.textContent = '';
            return;
        }

        try {
            let processedLatex = latex;

            // Replace \clr{name}{content}
            processedLatex = processedLatex.replace(
                /\\clr\s*\{\s*([^}]+)\s*\}\s*\{\s*([^}]+)\s*\}/g,
                (_, termName: string, content: string) => {
                    const color = colorMap[termName.trim()] || '#888888';
                    return `\\textcolor{${color}}{${content}}`;
                },
            );

            katex.render(processedLatex, previewRef.current, {
                throwOnError: false,
                trust: true,
                output: 'html',
                displayMode: true,
            });
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        }
    }, [latex, colorMap, activeTab]);

    // Term handlers
    const handleUpdateTerm = useCallback((termName: string, newContent: string, newColor: string) => {
        setColorMap(prev => ({ ...prev, [termName]: newColor }));
        setLatex(prev => {
            const pattern = new RegExp(`\\\\clr\\{${termName}\\}\\{[^}]+\\}`, 'g');
            return prev.replace(pattern, `\\clr{${termName}}{${newContent}}`);
        });
        setColorTerms(prev => prev.map(t => t.name === termName ? { ...t, content: newContent, color: newColor } : t));
    }, []);

    const handleRemoveTerm = useCallback((termName: string) => {
        setLatex(prev => {
            const pattern = new RegExp(`\\\\clr\\{${termName}\\}\\{([^}]+)\\}`, 'g');
            return prev.replace(pattern, '$1');
        });
        setColorMap(prev => { const next = { ...prev }; delete next[termName]; return next; });
        setColorTerms(prev => prev.filter(t => t.name !== termName));
    }, []);


    const handleSave = useCallback(() => {
        if (!latex.trim()) {
            setError('Formula is required.');
            setActiveTab('latex');
            return;
        }
        saveFormulaBlockEdit({
            latex,
            colorMap,
            color: wrapperColor,
        });
    }, [latex, colorMap, wrapperColor, saveFormulaBlockEdit]);

    const handleCancel = useCallback(() => {
        closeFormulaBlockEditor();
    }, [closeFormulaBlockEditor]);

    if (!editingFormulaBlock) return null;

    const hasColorTerms = colorTerms.length > 0;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border rounded-xl shadow-2xl w-[90vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {editingFormulaBlock.isNew ? 'New Formula Block' : 'Edit Formula Block'}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b overflow-x-auto">
                    <button
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                            activeTab === 'latex'
                                ? `border-b-2 border-[${BRAND_GREEN}] text-[${BRAND_GREEN}]`
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setActiveTab('latex')}
                    >
                        LaTeX Source
                    </button>
                    <button
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                            activeTab === 'terms'
                                ? `border-b-2 border-[${BRAND_GREEN}] text-[${BRAND_GREEN}]`
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setActiveTab('terms')}
                    >
                        Colors ({colorTerms.length})
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    {activeTab === 'latex' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">LaTeX Code</label>
                                <textarea
                                    ref={textareaRef}
                                    value={latex}
                                    onChange={(e) => {
                                        setLatex(e.target.value);
                                        parseTermsFromLatex(e.target.value, colorMap);
                                    }}
                                    className={`w-full h-32 px-3 py-2 font-mono text-sm bg-muted/30 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[${ACCENT_VIOLET}]`}
                                    placeholder="Enter LaTeX formula..."
                                    spellCheck={false}
                                />
                                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                    <p>
                                        <code className="bg-muted px-1 rounded">\clr{'{'}name{'}'}{'{'}content{'}'}</code> — colored term
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">Live Preview</label>
                                </div>
                                <div
                                    ref={previewRef}
                                    className={cn(
                                        "min-h-[60px] p-4 bg-muted/20 rounded-lg flex items-center justify-center text-xl",
                                        error && "border-2 border-destructive"
                                    )}
                                />
                                {error && (
                                    <p className="text-xs text-destructive mt-1">{error}</p>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'terms' ? (
                        <div className="space-y-3">
                            {!hasColorTerms ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No colored terms found.</p>
                                    <p className="text-sm mt-1">
                                        Use <code className="bg-muted px-1 rounded">\clr{'{'}name{'}'}{'{'}content{'}'}</code> in the LaTeX Source tab to add colored terms.
                                    </p>
                                </div>
                            ) : (
                                colorTerms.map((term) => (
                                    <TermRow
                                        key={term.name}
                                        termName={term.name}
                                        content={term.content}
                                        color={term.color}
                                        onUpdate={handleUpdateTerm}
                                        onRemove={handleRemoveTerm}
                                    />
                                ))
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t bg-muted/30">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 text-sm font-medium bg-[${BRAND_GREEN}] text-white rounded-lg hover:bg-[${BRAND_GREEN}]/90 transition-colors`}
                    >
                        {editingFormulaBlock.isNew ? 'Insert Formula' : 'Apply Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormulaBlockEditorModal;
