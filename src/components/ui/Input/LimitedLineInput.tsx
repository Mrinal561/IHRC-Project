import React, { useState, useEffect, useRef, ElementType } from 'react';
import { Input, Notification, toast } from '@/components/ui';
import type { InputProps } from '@/components/ui/Input'; // Import the InputProps type

interface LimitedLineInputProps {
  value: string;
  onChange: (value: string) => void;
  maxCharsPerLine?: number;
  rows?: number;
  placeholder?: string;
  className?: string;
}

const LimitedLineInput = ({
  value,
  onChange,
  maxCharsPerLine = 80,
  rows = 3,
  placeholder = '',
  className = '',
  ...rest
}: LimitedLineInputProps & Omit<InputProps, 'value' | 'onChange'>) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const lines = inputValue.split('\n');
    
    // Process each line to ensure max characters
    const processedLines = lines.map(line => {
      if (line.length <= maxCharsPerLine) return line;
      
      // Split long lines into chunks of maxCharsPerLine
      const chunks = [];
      for (let i = 0; i < line.length; i += maxCharsPerLine) {
        chunks.push(line.substring(i, i + maxCharsPerLine));
      }
      return chunks.join('\n');
    });

    const newValue = processedLines.join('\n');
    
    if (newValue !== inputValue) {
      // Show warning if we had to modify the input
      toast.push(
        <Notification title="Note" type="warning">
          Maximum {maxCharsPerLine} characters per line
        </Notification>
      );
      
      // Set cursor position after the forced newline
      const cursorPos = textareaRef.current?.selectionStart || 0;
      setInternalValue(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          // Adjust cursor position if we inserted newlines
          const addedNewlines = (newValue.match(/\n/g) || []).length - 
                              (inputValue.match(/\n/g) || []).length;
          textareaRef.current.selectionStart = cursorPos + addedNewlines;
          textareaRef.current.selectionEnd = cursorPos + addedNewlines;
        }
      }, 0);
    } else {
      setInternalValue(newValue);
    }
    
    onChange(newValue);
  };

  return (
    <Input
      {...rest}
      textArea
      rows={rows}
      value={internalValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        // This is a hack to make TypeScript happy - we know it's actually a textarea
        handleChange(e as unknown as React.ChangeEvent<HTMLTextAreaElement>);
      }}
      placeholder={placeholder}
      className={className}
      // We can't properly type the ref here due to component limitations
      ref={textareaRef as unknown as React.Ref<HTMLInputElement | ElementType>}
    />
  );
};

export default LimitedLineInput;