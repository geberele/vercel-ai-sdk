import { ReactNode } from 'react';

export const FormatMessageContent = ({
  content,
}: {
  content: string;
}): ReactNode => {
  if (!content.includes('<think>')) {
    return <div>{content}</div>;
  }

  // Parse <think> blocks
  const parts = content.split(/(<think>|<\/think>)/);
  const formattedParts = [];
  let isInsideThinkBlock = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part === '<think>') {
      isInsideThinkBlock = true;
      continue;
    } else if (part === '</think>') {
      isInsideThinkBlock = false;
      continue;
    }

    if (part.trim() === '') {
      continue;
    }

    if (isInsideThinkBlock) {
      formattedParts.push(
        <div
          key={i}
          style={{
            padding: '10px 15px',
            margin: '8px 0',
            backgroundColor: '#f8f8f8',
            borderLeft: '4px solid #ccc',
            color: '#666',
            fontStyle: 'italic',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Thinking:
          </div>
          {part}
        </div>
      );
    } else {
      formattedParts.push(<div key={i}>{part}</div>);
    }
  }

  return <>{formattedParts}</>;
};
