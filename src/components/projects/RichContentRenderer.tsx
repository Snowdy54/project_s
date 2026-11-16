import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ProjectContentBlock } from '../../types/project';

interface RichContentRendererProps {
  blocks: ProjectContentBlock[];
}

const CodeBlockView: React.FC<{ language: string; code: string }> = ({
  language,
  code,
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-5 rounded-[16px] border-2 border-[#FDFCEA] overflow-hidden bg-[#05101A] max-w-3xl">
      {/* Верхняя светлая плашка языка как в Figma */}
      <div className="bg-[#FDFCEA] text-[#05101A] px-5 py-1.5 flex items-center justify-between">
        <span className="font-mono text-xs font-bold tracking-wide lowercase">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#05101A]/80 hover:text-[#05101A] transition cursor-pointer"
          title="Скопировать код"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span>Скопировано</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Копировать</span>
            </>
          )}
        </button>
      </div>

      {/* Тело кода с нумерацией строк */}
      <div className="p-4 overflow-x-auto font-mono text-[13px] leading-[1.6]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-white/[0.03]">
                <td className="select-none pr-4 text-right text-gray-500 w-8 align-top">
                  {index + 1}
                </td>
                <td className="text-[#FDFCEA] whitespace-pre">{line || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  blocks,
}) => {
  return (
    <div className="space-y-4 text-white/95 text-[15px] leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={idx}
                className="text-xl font-bold text-white pt-4 pb-1 tracking-tight"
              >
                {block.text}
              </h2>
            );

          case 'subheading':
            return (
              <h3
                key={idx}
                className="text-[15px] font-semibold text-[#FDFCEA] pt-2"
              >
                {block.text}
              </h3>
            );

          case 'paragraph':
            return (
              <p key={idx} className="text-white/90 text-[14px] md:text-[15px] leading-[1.6]">
                {block.text}
              </p>
            );

          case 'list':
            return (
              <ul key={idx} className="space-y-1.5 pl-2">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-[14px] md:text-[15px] text-white/90 leading-[1.55]"
                  >
                    <span className="text-[#FDFCEA] font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'code':
            return (
              <CodeBlockView
                key={idx}
                language={block.language}
                code={block.code}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};