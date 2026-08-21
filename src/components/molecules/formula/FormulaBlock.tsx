import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { useVariableStore } from '@/stores';
import { useEditing } from '@/contexts/EditingContext';
import { useAppMode } from '@/contexts/AppModeContext';
import { useBlockContext } from '@/contexts/BlockContext';

export interface FormulaBlockProps {
    /**
     * LaTeX formula string.
     *
     * Supports custom macros:
     * - `\clr{name}{content}` — colors a static term using `colorMap`
     * - `\val{varName}` — renders a read-only number bound to a global variable
     *
     * @example
     * "\\clr{force}{F} = \\clr{mass}{m} \\times \\clr{acceleration}{a}"
     */
    latex: string;

    /**
     * Term name → hex color mapping for `\clr{name}{content}` syntax.
     * Also used as default color for `\val{varName}` if no store color is set.
     */
    colorMap?: Record<string, string>;

    /** Default accent color for the formula wrapper (default: #000000) */
    color?: string;

    /** Optional className on the outer wrapper */
    className?: string;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT_VALUE_COLOR = '#D81B60';

/**
 * FormulaBlock Component
 *
 * Renders a KaTeX math formula with colored terms (`\clr{}{}`), live read-only
 * values (`\val{}`).
 *
 * @example
 * ```tsx
 * <FormulaBlock
 * />
 * ```
 */
export const FormulaBlock: React.FC<FormulaBlockProps> = ({
    latex,
    colorMap = {},
    color = '#000000',
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const katexRef = useRef<HTMLSpanElement>(null);

    // ── Editing support ─────────────────────────────────────────────────────
    const { isEditor } = useAppMode();
    const { isEditing, openFormulaBlockEditor, pendingEdits } = useEditing();
    const [isHovered, setIsHovered] = useState(false);
    const { id: blockIdFromContext } = useBlockContext();

    // Allow editing in editor mode OR standalone mode for testing
    const isStandalone = typeof window !== 'undefined' && window.self === window.top;
    const canEdit = isEditor || isStandalone;

    // Stable identity for matching pending edits (same pattern as the inline components)
    const [editIdentity, setEditIdentity] = useState<{ blockId: string; elementPath: string } | null>(null);

    useEffect(() => {
        if (blockIdFromContext) {
            const elementPath = `formulaBlock-${blockIdFromContext}`;
            setEditIdentity({ blockId: blockIdFromContext, elementPath });
            return;
        }
        if (!containerRef.current) return;
        const block = containerRef.current.closest('[data-block-id]');
        const blockId = block?.getAttribute('data-block-id') || '';
        const elementPath = `formulaBlock-${blockId}`;
        setEditIdentity({ blockId, elementPath });
    }, [blockIdFromContext]);

    // Check for pending edits using the stored identity
    const pendingEdit = useMemo(() => {
        if (!editIdentity || (!isEditing && !canEdit)) return null;

        const { blockId, elementPath } = editIdentity;

        const edit = [...pendingEdits].reverse().find(e =>
            e.type === 'formulaBlock' &&
            (e as any).blockId === blockId &&
            (e as any).elementPath === elementPath
        );
        return edit as { newProps: { latex?: string; colorMap?: Record<string, string>; color?: string } } | null;
    }, [isEditing, canEdit, pendingEdits, editIdentity]);

    // Use edited values if available
    const displayLatex = pendingEdit?.newProps?.latex ?? latex;
    const displayColorMap = pendingEdit?.newProps?.colorMap ?? colorMap;
    const displayColor = pendingEdit?.newProps?.color ?? color;

    const handleEditClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!editIdentity) return;
        openFormulaBlockEditor(
            { latex: displayLatex, colorMap: displayColorMap, color: displayColor },
            editIdentity.blockId,
            editIdentity.elementPath
        );
    }, [displayLatex, displayColorMap, displayColor, openFormulaBlockEditor, editIdentity]);

    // ── Variable store ──────────────────────────────────────────────────────
    const allVars = useVariableStore((s) => s.variables);
    const allVarColors = useVariableStore((s) => s.colors);

    // ── Parse \val{varName} markers ─────────────────────────────────────────
    const valVarNames = useMemo(() => {
        const matches = displayLatex.matchAll(/\\val\{([^}]+)\}/g);
        return [...new Set([...matches].map((m) => m[1]))];
    }, [displayLatex]);

    // ── Resolve effective color for each \val variable ─────────────────
    const resolvedColors = useMemo(() => {
        const map: Record<string, string> = {};
        for (const name of valVarNames) {
            map[name] =
                allVarColors[name] ??
                displayColorMap[name] ??
                DEFAULT_VALUE_COLOR;
        }
        return map;
    }, [valVarNames, allVarColors, displayColorMap]);

    // ── Merge store colors into colorMap for \clr{} terms ───────────────────
    const effectiveColorMap = useMemo(() => {
        if (pendingEdit?.newProps?.colorMap !== undefined) {
            return displayColorMap;
        }
        const merged = { ...displayColorMap };
        for (const key of Object.keys(merged)) {
            const storeColor = allVarColors[key];
            if (storeColor) merged[key] = storeColor;
        }
        return merged;
    }, [displayColorMap, allVarColors, pendingEdit]);

    // ── Format a variable's value for display ───────────────────────────────
    const formatValue = useCallback((_varName: string, value: number): string => {
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }, []);

    // ── Build processed LaTeX string ────────────────────────────────────────
    const processedLatex = useMemo(() => {
        let result = displayLatex;

        // 0. Repair doubled backslashes before command names (`\\frac` → `\frac`).
        // JSX string attributes pass `\\` through literally, and AI-generated
        // formulas sometimes double-escape — KaTeX then fails and dumps raw red
        // source. A `\\` before a letter is never a legitimate row break (those
        // precede whitespace, `&`, or end-of-row), so this is safe to collapse.
        result = result.replace(/\\\\(?=[A-Za-z])/g, '\\');

        // 5. Replace \clr{name}{content} with \textcolor{color}{content}
        result = result.replace(
            /\\clr\{([^}]+)\}\{([^}]+)\}/g,
            (_, termName: string, content: string) => {
                const c = effectiveColorMap[termName];
                return c ? `\\textcolor{${c}}{${content}}` : content;
            },
        );

        // 6. Replace \val{varName} with a non-interactive colored number
        result = result.replace(
            /\\val\{([^}]+)\}/g,
            (_, varName: string) => {
                const val = (allVars[varName] as number) ?? 0;
                const col = resolvedColors[varName] ?? DEFAULT_VALUE_COLOR;
                const display = formatValue(varName, val);
                return `\\htmlClass{val-${varName}}{\\textcolor{${col}}{${display}}}`;
            },
        );

        return result;
    }, [displayLatex, allVars, resolvedColors, formatValue, effectiveColorMap]);

    // ── Render KaTeX ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!katexRef.current) return;
        try {
            katex.render(processedLatex, katexRef.current, {
                throwOnError: false,
                trust: true,
                output: 'html',
            });
        } catch {
            if (katexRef.current) {
                katexRef.current.textContent = displayLatex;
            }
        }
    }, [processedLatex, displayLatex]);

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div
            ref={containerRef}
            className={cn(
                'formula-block w-full flex justify-center items-center py-4',
                isEditor && isEditing && 'group',
                className,
            )}
            style={{ color: displayColor }}
            contentEditable={false}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="relative inline-block">
                <span
                    ref={katexRef}
                    className={cn(
                        'inline-block text-2xl',
                        isEditor && isEditing && 'cursor-pointer hover:outline hover:outline-2 hover:outline-dashed hover:outline-offset-2 hover:outline-[#3cc499] rounded transition-all duration-150',
                    )}
                    onClick={isEditor && isEditing ? handleEditClick : undefined}
                />
                {/* Edit button — appears on hover in edit mode */}
                {isEditor && isEditing && isHovered && (
                    <button
                        onClick={handleEditClick}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#3cc499] text-white rounded-full shadow-lg flex items-center justify-center text-xs hover:bg-[#3cc499]/90 transition-all duration-150 z-10"
                        title="Edit formula block"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                )}
            </span>

        </div>
    );
};

export default FormulaBlock;
