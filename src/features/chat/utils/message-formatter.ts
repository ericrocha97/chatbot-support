export function formatBotText(text: string): string {
  if (!text) return ''
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\n/g, '<br />')
  html = html.replace(/(^|<br \/>)(\d+)\.\s/g, '$1<strong>$2.</strong> ')
  return html
}
