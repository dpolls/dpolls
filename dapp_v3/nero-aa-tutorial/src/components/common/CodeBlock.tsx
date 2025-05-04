import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const trimmedCode = code.trim();
  
  return (
    <div className="code-block-container">
      <Highlight
        theme={themes.nightOwl}
        code={trimmedCode}
        language={language as any}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ 
            ...style, 
            padding: '15px', 
            borderRadius: '8px', 
            maxHeight: '300px', 
            overflow: 'auto',
            fontSize: '14px',
            margin: '15px 0'
          }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                <span className="line-number" style={{ 
                  display: 'inline-block',
                  width: '2em',
                  userSelect: 'none',
                  opacity: 0.5,
                  marginRight: '1em',
                  textAlign: 'right'
                }}>
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock; 