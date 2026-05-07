export function safeUrl(input) {
    if (!input || typeof input !== 'string') return '#';
    const trimmed = input.trim();
    if (!/^https?:\/\//i.test(trimmed)) return '#';
    try { new URL(trimmed); return trimmed; } catch { return '#'; }
}
