import React from 'react';
import { AlertCircle, X, LogIn, UserPlus } from 'lucide-react';

interface AuthWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const AuthWarningModal: React.FC<AuthWarningModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] bg-[#0E1A26] border border-[#23384B] rounded-[32px] p-7 md:p-8 text-center text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/20">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold">Персонализация дерева</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Персонализация дерева доступна только для зарегистрированных пользователей.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            onClick={onLogin}
            className="w-full h-11 rounded-full bg-[#FFF886] hover:bg-[#F5EE7A] text-black font-bold text-sm flex items-center justify-center gap-2 transition shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>Войти в аккаунт</span>
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-full h-11 rounded-full bg-[#071018] hover:bg-[#162534] border border-[#23384B] text-white font-medium text-sm flex items-center justify-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Зарегистрироваться</span>
          </button>
        </div>
      </div>
    </div>
  );
};