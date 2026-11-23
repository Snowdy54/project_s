import React, { useState, useRef, useEffect } from 'react';

interface AvatarCropModalProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (croppedDataUrl: string) => void;
}

const CROP_VIEW_SIZE = 280; // Размер квадратной области обрезки в окне
const OUTPUT_AVATAR_SIZE = 400; // Итоговый размер квадратного файла (400x400)

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  imageSrc,
  onCancel,
  onSave,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number }>({
    pointerX: 0,
    pointerY: 0,
    startX: 0,
    startY: 0,
  });

  // Базовый масштаб, при котором фото полностью заполняет квадрат 280x280
  const baseScale = naturalSize
    ? Math.max(CROP_VIEW_SIZE / naturalSize.w, CROP_VIEW_SIZE / naturalSize.h)
    : 1;
  const currentScale = baseScale * zoom;

  const dispW = naturalSize ? naturalSize.w * currentScale : CROP_VIEW_SIZE;
  const dispH = naturalSize ? naturalSize.h * currentScale : CROP_VIEW_SIZE;

  const clampOffset = (nextX: number, nextY: number, scaleVal: number) => {
    if (!naturalSize) return { x: 0, y: 0 };
    const w = naturalSize.w * scaleVal;
    const h = naturalSize.h * scaleVal;
    const maxX = Math.max(0, (w - CROP_VIEW_SIZE) / 2);
    const maxY = Math.max(0, (h - CROP_VIEW_SIZE) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, nextX)),
      y: Math.min(maxY, Math.max(-maxY, nextY)),
    };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    imgRef.current = img;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: offset.x,
      startY: offset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;
    setOffset(
      clampOffset(
        dragStartRef.current.startX + dx,
        dragStartRef.current.startY + dy,
        currentScale
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.min(3, Math.max(1, newZoom));
    const newScale = baseScale * clampedZoom;
    setZoom(clampedZoom);
    setOffset((prev) => clampOffset(prev.x, prev.y, newScale));
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    handleZoomChange(zoom + delta);
  };

  const handleConfirmCrop = () => {
    const img = imgRef.current;
    if (!img || !naturalSize) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_AVATAR_SIZE;
    canvas.height = OUTPUT_AVATAR_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgLeft = (CROP_VIEW_SIZE - dispW) / 2 + offset.x;
    const imgTop = (CROP_VIEW_SIZE - dispH) / 2 + offset.y;

    const sx = -imgLeft / currentScale;
    const sy = -imgTop / currentScale;
    const sSize = CROP_VIEW_SIZE / currentScale;

    ctx.drawImage(
      img,
      sx,
      sy,
      sSize,
      sSize,
      0,
      0,
      OUTPUT_AVATAR_SIZE,
      OUTPUT_AVATAR_SIZE
    );

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSave(dataUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-[20px] border-2 border-[#FFF886] bg-[#05131C] p-6 sm:p-7 space-y-5 shadow-[0_0_24px_rgba(255,248,134,0.28)]"
      >
        <div className="text-center space-y-1">
          <h3
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="text-[22px] text-[#FFF886]"
          >
            Обрезка аватарки
          </h3>
          <p className="text-[13px] text-[#FDFCEA]/75">
            Перетащите фото и настройте масштаб под круглую рамку
          </p>
        </div>

        {/* Квадратная область обрезки с круглой рамкой */}
        <div className="flex justify-center">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            style={{ width: CROP_VIEW_SIZE, height: CROP_VIEW_SIZE }}
            className="relative overflow-hidden rounded-[12px] border border-[#FDFCEA]/50 bg-[#05131C] cursor-grab active:cursor-grabbing touch-none"
          >
            {/* Само изображение */}
            <img
              src={imageSrc}
              alt="Предпросмотр аватарки"
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                width: `${dispW}px`,
                height: `${dispH}px`,
                maxWidth: 'none',
                left: `${(CROP_VIEW_SIZE - dispW) / 2 + offset.x}px`,
                top: `${(CROP_VIEW_SIZE - dispH) / 2 + offset.y}px`,
              }}
              className="absolute pointer-events-none select-none"
            />

            {/* Затемнение углов квадрата и жёлтая круглая рамка #FFF886 */}
            <div
              style={{
                boxShadow: '0 0 0 9999px rgba(5, 19, 28, 0.68)',
              }}
              className="absolute inset-0 rounded-full border-2 border-[#FFF886] pointer-events-none"
            />
          </div>
        </div>

        {/* Ползунок масштаба */}
        <div className="space-y-1.5 px-2">
          <div className="flex items-center justify-between text-[12.5px] text-[#FDFCEA]/75">
            <span>Масштаб</span>
            <span style={{ fontFamily: 'UnifontExMono, monospace' }} className="text-[#FFF886]">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.02}
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="w-full accent-[#FFF886] cursor-pointer"
          />
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="h-[42px] px-5 rounded-[30px] border border-[#FDFCEA]/50 text-[#FDFCEA] text-[14px] hover:bg-white/5 transition cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="h-[42px] px-6 rounded-[30px] bg-[#FFF886] text-[#05131C] font-medium text-[14px] hover:shadow-[0_0_10px_#FFF886] transition cursor-pointer"
          >
            Сохранить фото
          </button>
        </div>
      </div>
    </div>
  );
};