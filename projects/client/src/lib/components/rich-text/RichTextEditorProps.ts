import type { Snippet } from 'svelte';
import type { RichTextMention } from './RichTextMention.ts';

export type RichTextEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder: string;
  label: string;
  disabled?: boolean;
  autofocus?: boolean;
  mentions?: ReadonlyArray<RichTextMention>;
  /** Id of an element that describes the text, e.g. a hint inside the field. */
  describedBy?: string;
  /** Above the text, or as a row beneath it. */
  toolbarPlacement?: 'top' | 'bottom';
  /** Extra controls appended to the toolbar row, after a divider. */
  toolbarActions?: Snippet;
  /** Wraps the writing surface alone, so a caller can draw a field around the
   * text while the toolbar stays outside it. */
  field?: Snippet<[Snippet]>;
};
