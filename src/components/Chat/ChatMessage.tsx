export interface ChatMessageProps {
  sender: string;
  children?: React.ReactNode;
}

export function ChatMessage({ sender, children }: ChatMessageProps) {
  return (
    <div className="px-6 py-4 group even:bg-muted">
      <div className="text-sm text-muted-foreground">{sender}:</div>
      <div>{children}</div>
    </div>
  );
}
