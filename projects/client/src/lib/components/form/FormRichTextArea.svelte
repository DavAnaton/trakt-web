<script lang="ts">
  import type { Snippet } from "svelte";
  import RichTextEditor from "$lib/components/rich-text/RichTextEditor.svelte";
  import type { RichTextMention } from "$lib/components/rich-text/RichTextMention.ts";
  import FormElementWrapper from "./_internal/FormElementWrapper.svelte";
  import type { FormInputProps } from "./models/FormInputProps.ts";

  const randomId = crypto.randomUUID().slice(0, 8);
  const errorLabelId = `trakt-rich-textarea-error-${randomId}`;
  const hintId = `trakt-rich-textarea-hint-${randomId}`;

  const {
    onChange,
    disabled,
    placeholder,
    value = "",
    autofocus = false,
    validation,
    actions,
    mentions,
    hint,
    attachment,
  }: FormInputProps & {
    actions?: Snippet;
    mentions?: ReadonlyArray<RichTextMention>;
    hint?: string;
    /** Shown beside the field, above the toolbar, e.g. a picked image. */
    attachment?: Snippet;
  } = $props();

  let hasBlurred = $state(false);

  const hasError = $derived(
    validation != null &&
      hasBlurred &&
      value.trim() !== "" &&
      !validation.isValid(value),
  );
</script>

{#snippet field(surface: Snippet)}
  <div class="rich-textarea-row">
    <div class="rich-textarea-field">
      {@render surface()}

      {#if hint}
        <p id={hintId} class="field-hint secondary tag bold">{hint}</p>
      {/if}
    </div>

    {@render attachment?.()}
  </div>
{/snippet}

<FormElementWrapper {validation} {hasError} {errorLabelId}>
  <div
    class="trakt-form-rich-textarea"
    onfocusout={(event) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
        return;
      }
      hasBlurred = true;
    }}
    class:is-disabled={disabled}
    class:has-error={hasError}
    aria-describedby={hasError ? errorLabelId : undefined}
  >
    <RichTextEditor
      {value}
      {onChange}
      {placeholder}
      label={placeholder}
      {disabled}
      {autofocus}
      {mentions}
      {field}
      describedBy={hintId}
      toolbarPlacement="bottom"
      toolbarActions={actions}
    />
  </div>
</FormElementWrapper>

<style>
  .trakt-form-rich-textarea {
    .rich-textarea-row {
      display: flex;
      align-items: flex-start;
    }

    .rich-textarea-field {
      flex: 1;
      min-width: 0;
      position: relative;
      min-height: var(--ni-144);

      padding: var(--ni-16);
      /* Room for the hint, kept even once it hides so the text never jumps. */
      padding-block-end: var(--ni-36);
      box-sizing: border-box;

      border-radius: var(--border-radius-m);
      border: calc(var(--border-thickness-xxs) * 1.5) var(--color-border) solid;

      color: var(--color-text-primary);
      background-color: var(--color-input-background);

      transition: border-color var(--transition-increment) ease-in-out;

      backdrop-filter: blur(var(--ni-4));

      &:focus-within {
        border-color: var(--color-input-focus);
      }
    }

    &.has-error .rich-textarea-field {
      border-color: var(--color-input-error);
    }

    .field-hint {
      position: absolute;
      inset-inline-end: var(--ni-14);
      inset-block-end: var(--ni-12);

      margin: 0;
      pointer-events: none;
    }
  }
</style>
