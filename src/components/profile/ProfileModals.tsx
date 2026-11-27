import React, { useEffect } from 'react';

interface DeleteProfileModalProps {
  isOpen: boolean;
  confirmWord: string;
  error: string | null;
  onChangeConfirmWord: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  isOpen,
  confirmWord,
  error,
  onChangeConfirmWord,
  onClose,
  onSubmit,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-profile-modal-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-[20px] border-2 border-[#FF383C] bg-[#05131C] p-6 sm:p-7 space-y-4 shadow-2xl"
      >
        <h3
          id="delete-profile-modal-title"
          style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
          className="text-[20px] font-black text-[#FDFCEA]"
        >
          Подтверждение удаления профиля
        </h3>
        <p className="text-[14px] text-[#FDFCEA]/85 leading-relaxed">
          Для подтверждения безвозвратного удаления аккаунта введите слово{' '}
          <span className="font-bold text-[#FF383C]">Удалить</span> в поле ниже:
        </p>

        {error && (
          <p className="text-[13px] text-[#FF383C] font-medium">{error}</p>
        )}

        <input
          type="text"
          value={confirmWord}
          onChange={(e) => onChangeConfirmWord(e.target.value)}
          placeholder="Удалить"
          className="w-full h-[43px] rounded-[10px] border border-[#FF383C] bg-[#FDFCEA0D] px-4 text-[14.5px] text-[#FDFCEA] focus:outline-none"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] px-5 rounded-[30px] border border-[#FDFCEA]/50 text-[#FDFCEA] text-[14px] hover:bg-white/5 transition cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="h-[42px] px-6 rounded-[30px] border border-[#FF383C] bg-[#FF383C] text-[#05131C] font-medium text-[14px] hover:brightness-110 transition cursor-pointer"
          >
            Подтвердить
          </button>
        </div>
      </form>
    </div>
  );
};

interface RemoveFavoriteModalProps {
  mapId: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export const RemoveFavoriteModal: React.FC<RemoveFavoriteModalProps> = ({
  mapId,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    if (!mapId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapId, onCancel]);

  if (!mapId) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-[20px] border-2 border-[#DDD2FD] bg-[#05131C] p-6 space-y-5 shadow-2xl"
      >
        <p className="text-[16px] text-[#FDFCEA] leading-snug">
          Вы действительно хотите удалить карту из избранного?
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-[40px] px-6 rounded-[30px] border border-[#FDFCEA]/50 text-[#FDFCEA] text-[14px] hover:bg-white/5 transition cursor-pointer"
          >
            Нет
          </button>
          <button
            type="button"
            onClick={() => onConfirm(mapId)}
            className="h-[40px] px-6 rounded-[30px] bg-[#DDD2FD] text-[#05131C] font-medium text-[14px] hover:brightness-105 transition cursor-pointer"
          >
            Да
          </button>
        </div>
      </div>
    </div>
  );
};
