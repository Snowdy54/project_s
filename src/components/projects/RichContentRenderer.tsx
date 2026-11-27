import React, { useState } from 'react';
import type { ProjectContentBlock, ProjectListItem } from '../../types/project';

interface RichContentRendererProps {
  blocks: ProjectContentBlock[];
}

// Пиксельная иконка </> из макета (сетка 12x6)
const PixelCodeIcon: React.FC = () => (
  <svg
    width="18"
    height="9"
    viewBox="0 0 12 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="shrink-0"
  >
    <path
      d="M7 0H8V1H7ZM2 1H3V2H2ZM7 1H8V2H7ZM9 1H10V2H9ZM1 2H2V3H1ZM6 2H7V3H6ZM10 2H11V3H10ZM0 3H1V4H0ZM6 3H7V4H6ZM11 3H12V4H11ZM1 4H2V5H1ZM5 4H6V5H5ZM10 4H11V5H10ZM2 5H3V6H2ZM5 5H6V6H5ZM9 5H10V6H9Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельная иконка копирования из макета (сетка 10x10)
const PixelCopyIcon: React.FC = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
  >
    <path
      d="M1 0H7V1H1ZM0 1H1V2H0ZM7 1H8V2H7ZM0 2H1V3H0ZM3 2H9V3H3ZM0 3H1V4H0ZM2 3H3V4H2ZM9 3H10V4H9ZM0 4H1V5H0ZM2 4H3V5H2ZM9 4H10V5H9ZM0 5H1V6H0ZM2 5H3V6H2ZM9 5H10V6H9ZM0 6H1V7H0ZM2 6H3V7H2ZM9 6H10V7H9ZM1 7H3V8H1ZM9 7H10V8H9ZM2 8H3V9H2ZM9 8H10V9H9ZM3 9H9V10H3Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельная галочка при успешном копировании (сетка 10x7)
const PixelCheckIcon: React.FC = () => (
  <svg
    width="15"
    height="11"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
  >
    <path
      d="M9 0H10V1H9ZM8 1H9V2H8ZM7 2H8V3H7ZM0 3H1V4H0ZM6 3H7V4H6ZM1 4H2V5H1ZM5 4H6V5H5ZM2 5H3V6H2ZM4 5H5V6H4ZM3 6H4V7H3Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельная иконка скачивания из макета (сетка 9x10)
const PixelDownloadIcon: React.FC = () => (
  <svg
    width="14"
    height="15"
    viewBox="0 0 9 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
  >
    <path
      d="M4 0H5V1H4ZM4 1H5V2H4ZM4 2H5V3H4ZM4 3H5V4H4ZM4 4H5V5H4ZM2 5H7V6H2ZM3 6H6V7H3ZM0 7H1V8H0ZM4 7H5V8H4ZM8 7H9V8H8ZM0 8H1V9H0ZM8 8H9V9H8ZM1 9H8V10H1Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельная стрелка сворачивания/разворачивания из макета (сетка 7x4)
const PixelChevronIcon: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <svg
    width="12"
    height="7"
    viewBox="0 0 7 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`transition-transform duration-150 ${isCollapsed ? 'rotate-180' : ''}`}
  >
    <path
      d="M3 0H4V1H3ZM2 1H3V2H2ZM4 1H5V2H4ZM1 2H2V3H1ZM5 2H6V3H5ZM0 3H1V4H0ZM6 3H7V4H6Z"
      fill="currentColor"
    />
  </svg>
);

const CodeBlockView: React.FC<{
  language: string;
  filename?: string;
  code: string;
}> = ({ language, filename, code }) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      bash: 'sh',
      json: 'json',
      python: 'py',
      typescript: 'ts',
      javascript: 'js',
    };
    const ext = extMap[language.toLowerCase()] || 'txt';
    const downloadName = filename || `snippet.${ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{ fontFamily: 'UnifontExMono, monospace' }}
      className="mt-1.5 mb-3 rounded-[18px] border-2 border-[#FDFCEA] overflow-hidden bg-[#05131C] max-w-[780px]"
    >
      {/* Верхняя светлая плашка #FDFCEA */}
      <div className="bg-[#FDFCEA] text-[#05131C] px-5 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5 text-[14px] font-medium lowercase">
          <PixelCodeIcon />
          <span>{language}</span>
        </div>

        <div className="flex items-center gap-4 text-[#05131C]">
          <button
            type="button"
            onClick={handleCopy}
            className="hover:opacity-70 transition cursor-pointer flex items-center justify-center w-4 h-4"
            title={copied ? 'Скопировано!' : 'Копировать код'}
          >
            {copied ? <PixelCheckIcon /> : <PixelCopyIcon />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="hover:opacity-70 transition cursor-pointer flex items-center justify-center w-4 h-4"
            title="Скачать фрагмент"
          >
            <PixelDownloadIcon />
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hover:opacity-70 transition cursor-pointer flex items-center justify-center w-4 h-4"
            title={isCollapsed ? 'Развернуть' : 'Свернуть'}
          >
            <PixelChevronIcon isCollapsed={isCollapsed} />
          </button>
        </div>
      </div>

      {/* Тело кода в пиксельном шрифте UnifontExMono */}
      {!isCollapsed && (
        <div className="px-4 py-3 overflow-x-auto text-[14px] leading-[1.45] bg-[#05131C]">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, index) => (
                <tr key={index} className="hover:bg-white/[0.03]">
                  <td className="select-none pr-4 text-right text-[#FFFFFF]/45 w-7 align-top">
                    {index + 1}
                  </td>
                  <td className="text-[#FDFCEA] whitespace-pre">{line || ' '}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const renderListItemContent = (item: string | ProjectListItem) => {
  if (typeof item === 'string') {
    return <span>{item}</span>;
  }
  return (
    <span>
      {item.boldPrefix && (
        <strong
          style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
          className="font-black"
        >
          {item.boldPrefix}{' '}
        </strong>
      )}
      {item.italicPrefix && <span className="italic">{item.italicPrefix} </span>}
      {item.text}
      {item.monoSuffix && (
        <code
          style={{ fontFamily: 'UnifontExMono, monospace' }}
          className="text-[14.5px] text-[#FDFCEA]"
        >
          {' '}
          {item.monoSuffix}
        </code>
      )}
    </span>
  );
};

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  blocks,
}) => {
  return (
    <div
      style={{ fontFamily: 'Product Sans, sans-serif' }}
      className="text-[#FFFFFF] text-[14.5px] md:text-[15px] leading-[1.35]"
    >
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={idx}
                id={block.id}
                style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                className="text-[20px] md:text-[22px] font-black text-[#FFFFFF] mt-6 first:mt-0 mb-1.5 tracking-tight scroll-mt-8"
              >
                {block.text}
              </h2>
            );

          case 'subheading':
            return (
              <p
                key={idx}
                style={
                  block.bold
                    ? { fontFamily: 'Product Sans Black, Product Sans, sans-serif' }
                    : undefined
                }
                className={`text-[14.5px] md:text-[15px] ${
                  block.bold ? 'font-black' : 'font-normal'
                } text-[#FFFFFF] mt-1.5 first:mt-0 leading-[1.35]`}
              >
                {block.text}
              </p>
            );

          case 'paragraph':
            return (
              <p
                key={idx}
                className="text-[#FFFFFF] text-[14.5px] md:text-[15px] font-normal leading-[1.35] mb-1 last:mb-0"
              >
                {block.italicPrefix && (
                  <span className="italic">{block.italicPrefix} </span>
                )}
                {block.boldPrefix && (
                  <strong
                    style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                    className="font-black"
                  >
                    {block.boldPrefix}{' '}
                  </strong>
                )}
                {block.text}
                {block.boldSegment && (
                  <strong
                    style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                    className="font-black"
                  >
                    {block.boldSegment}
                  </strong>
                )}
                {block.textAfterBold}
              </p>
            );

          case 'list':
            return (
              <ul key={idx} className="space-y-0.5 pl-2 my-0.5">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-[14.5px] md:text-[15px] font-normal text-[#FFFFFF] leading-[1.35]"
                  >
                    <span className="text-[#FFFFFF] font-bold">•</span>
                    {renderListItemContent(item)}
                  </li>
                ))}
              </ul>
            );

          case 'steps':
            return (
              <div key={idx} className="space-y-2 mt-1 mb-3">
                {block.steps.map((step, sIdx) => (
                  <div key={sIdx} className="space-y-0.5">
                    <div
                      style={
                        step.boldTitle
                          ? { fontFamily: 'Product Sans Black, Product Sans, sans-serif' }
                          : undefined
                      }
                      className={`text-[14.5px] md:text-[15px] ${
                        step.boldTitle ? 'font-black' : 'font-normal'
                      } text-[#FFFFFF] leading-[1.35]`}
                    >
                      {sIdx + 1}. {step.title}
                    </div>

                    {step.description && (
                      <p className="text-[14.5px] md:text-[15px] font-normal text-[#FFFFFF] leading-[1.35]">
                        {step.description}
                      </p>
                    )}

                    {step.items && step.items.length > 0 && (
                      <ul className="space-y-0.5 pl-2.5">
                        {step.items.map((subItem, subIdx) => (
                          <li
                            key={subIdx}
                            className="flex items-start gap-2.5 text-[14.5px] md:text-[15px] font-normal text-[#FFFFFF] leading-[1.35]"
                          >
                            <span className="text-[#FFFFFF] font-bold">•</span>
                            {renderListItemContent(subItem)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );

          case 'code':
            return (
              <CodeBlockView
                key={idx}
                language={block.language}
                filename={block.filename}
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