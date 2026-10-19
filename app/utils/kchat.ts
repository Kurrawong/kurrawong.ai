// Helpers for the kchat chat widget (see KChat.vue).

export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function inlineMarkdown(value: string): string {
    return value
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/__([^_]+)__/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, url: string) => {
            const safe = /^(https?:\/\/|\/)/i.test(url) ? url : "#";
            return `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener">${label}</a>`;
        });
}

/** Render a small subset of Markdown (code blocks, headings, lists, links) to safe HTML. */
export function kchatMarkdown(source: string): string {
    const code: string[] = [];
    let text = escapeHtml(source || "").replace(/```([^\n]*)\n?([\s\S]*?)```/g, (_, language: string, body: string) => {
        const key = `@@KCHATCODE${code.length}@@`;
        code.push(`<pre><code class="language-${escapeHtml(language.trim())}">${body.replace(/^\n|\n$/g, "")}</code></pre>`);
        return key;
    });

    const lines = text.split("\n");
    let html = "";
    let list = "";
    const closeList = () => {
        if (list) {
            html += `</${list}>`;
            list = "";
        }
    };
    for (const line of lines) {
        if (/^@@KCHATCODE\d+@@$/.test(line)) {
            closeList();
            html += line;
            continue;
        }
        const heading = line.match(/^(#{1,3})\s+(.+)/);
        const unordered = line.match(/^\s*[-*]\s+(.+)/);
        const ordered = line.match(/^\s*\d+\.\s+(.+)/);
        if (heading) {
            closeList();
            const n = heading[1].length;
            html += `<h${n}>${inlineMarkdown(heading[2])}</h${n}>`;
        } else if (unordered) {
            if (list !== "ul") {
                closeList();
                list = "ul";
                html += "<ul>";
            }
            html += `<li>${inlineMarkdown(unordered[1])}</li>`;
        } else if (ordered) {
            if (list !== "ol") {
                closeList();
                list = "ol";
                html += "<ol>";
            }
            html += `<li>${inlineMarkdown(ordered[1])}</li>`;
        } else if (!line.trim()) {
            closeList();
        } else {
            closeList();
            html += `<p>${inlineMarkdown(line)}</p>`;
        }
    }
    closeList();
    return html.replace(/@@KCHATCODE(\d+)@@/g, (_, index: string) => code[Number(index)] ?? "");
}

export interface KchatEvent {
    content?: { parts?: { text?: string; thought?: boolean }[] };
    partial?: boolean;
    usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        prompt_token_count?: number;
        candidates_token_count?: number;
        inputTokenCount?: number;
        outputTokenCount?: number;
        input_token_count?: number;
        output_token_count?: number;
    };
}

/** Extract the visible text chunks from an ADK streaming event. */
export function kchatEventText(event: KchatEvent): string {
    return (event.content?.parts ?? []).filter(part => part.text && !part.thought).map(part => part.text).join("");
}

/** Consume an SSE response body, invoking the callback once per JSON event. */
export async function kchatConsumeSse(response: Response, onEvent: (event: KchatEvent) => void): Promise<void> {
    if (!response.ok) {
        let message = (await response.text()) || `Chat request failed (${response.status})`;
        try {
            message = JSON.parse(message).detail ?? message;
        } catch {
            // Not a JSON error body: show the raw text.
        }
        throw new Error(message);
    }
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const emit = (block: string) => {
        const data = block.split(/\r?\n/).filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
        if (data && data !== "[DONE]") onEvent(JSON.parse(data));
    };
    while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() || "";
        for (const block of blocks) emit(block);
        if (done) break;
    }
    if (buffer.trim()) emit(buffer);
}

/** Decode ADK artifact bytes: URL-safe base64, padding omitted. */
export function kchatDecodeArtifact(data: string): string {
    const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
}

export function kchatArtifactLabel(name: string): string {
    if (name.endsWith(".rq")) return "SPARQL query";
    if (name.endsWith(".json")) return "JSON result";
    if (name.endsWith(".ttl")) return "Turtle result";
    return name;
}
