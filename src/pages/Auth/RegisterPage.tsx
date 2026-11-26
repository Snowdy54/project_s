import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MySkillKeysHero } from '../../components/home/MySkillKeysHero';
import {
  PasswordShowIcon,
  PasswordHideIcon,
  GitHubCat16Icon,
} from '../../components/auth/AuthIcons';
import { defaultUserProfile } from '../../data/achievementsData';
import type { UserProfileData } from '../../types/profile';

const STORAGE_AUTH_KEY = 'skillmap_user_auth_v1';
const STORAGE_PROFILE_KEY = 'skillmap_user_profile_v2';

const GLOW_CIRCLES: Array<{ top: string; left: string }> = [
  { top: '3%', left: '12%' },
  { top: '3%', left: '50%' },
  { top: '3%', left: '88%' },

  { top: '20%', left: '31%' },
  { top: '20%', left: '69%' },

  { top: '37%', left: '12%' },
  { top: '37%', left: '50%' },
  { top: '37%', left: '88%' },

  { top: '65%', left: '12%' },
  { top: '65%', left: '50%' },
  { top: '65%', left: '88%' },

  { top: '82%', left: '31%' },
  { top: '82%', left: '69%' },

  { top: '98%', left: '12%' },
  { top: '98%', left: '50%' },
  { top: '98%', left: '88%' },
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [nameValue, setNameValue] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    contact?: string;
    password?: boolean;
  }>({});

  const isFormReady =
    nameValue.trim().length > 0 &&
    contactValue.trim().length > 0 &&
    passwordValue.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: { name?: string; contact?: string; password?: boolean } = {};
    const trimmedName = nameValue.trim();
    const trimmedContact = contactValue.trim();

    if (!trimmedName || /[«»”]/.test(trimmedName)) {
      nextErrors.name = 'Введите корректное имя (без символов «, ”, »).';
    }
    if (!trimmedContact) {
      nextErrors.contact = 'Укажите Email или телефон.';
    }
    if (passwordValue.length < 6) {
      nextErrors.password = true;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const isEmail = trimmedContact.includes('@');
    const newProfile: UserProfileData = {
      ...defaultUserProfile,
      nickname: trimmedName,
      email: isEmail ? trimmedContact : '',
      phone: !isEmail ? trimmedContact : '',
    };

    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(true));
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/profile');
  };

  const handleGitHubRegister = () => {
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(true));
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/profile');
  };

  return (
    <div
      style={{ fontFamily: 'Product Sans, sans-serif' }}
      className="min-h-[calc(100vh-88px)] bg-[#05131C] text-[#FDFCEA] flex flex-col lg:flex-row items-stretch pt-3 px-4 sm:px-6 lg:pl-[90px] lg:pr-[90px]"
    >
      {/* ЛЕВАЯ ЧАСТЬ: ПАНЕЛЬ С КРУГАМИ СО СВЕЧЕНИЕМ И КЛАВИШАМИ MY SKILL → */}
      <section className="hidden lg:flex lg:w-[52%] xl:w-[53%] shrink-0 rounded-t-[30px] border-t-2 border-l-2 border-r-2 border-b-0 border-[#FDFCEA] bg-[#05131C] relative overflow-hidden items-center justify-center p-8 select-none">
        {GLOW_CIRCLES.map((pos, idx) => (
          <span
            key={idx}
            style={{
              top: pos.top,
              left: pos.left,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 24px 6px rgba(253, 252, 234, 0.28)',
            }}
            className="absolute w-[30px] h-[30px] xl:w-[34px] xl:h-[34px] rounded-full bg-[#05131C] pointer-events-none"
          />
        ))}

        <div className="relative z-10 scale-[0.82] xl:scale-[0.95] 2xl:scale-100">
          <MySkillKeysHero />
        </div>
      </section>

      {/* ПРАВАЯ ЧАСТЬ: ФОРМА РЕГИСТРАЦИИ */}
      <section className="flex-1 flex items-center justify-center py-8 lg:py-6 lg:pl-12">
        <div className="w-full max-w-[350px] space-y-5">
          <h1
            style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
            className="text-[32px] font-black text-center text-[#FDFCEA] leading-none"
          >
            Регистрация
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Поле «Имя» */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-name"
                className="block text-[14px] text-[#FDFCEA]"
              >
                Имя
              </label>
              <input
                id="reg-name"
                type="text"
                value={nameValue}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                  setNameValue(e.target.value);
                }}
                placeholder="Alexander Myskill"
                className={`w-full h-[43px] rounded-[10px] border px-3.5 text-[14.5px] text-[#FDFCEA] placeholder-[#FDFCEA]/55 focus:bg-[#05131C] focus:shadow-[0_0_5px_#FDFCEA] focus:outline-none transition ${
                  errors.name
                    ? 'border-[#FF383C] bg-[#05131C]'
                    : 'border-[#FDFCEA] bg-[#FDFCEA0D]'
                }`}
              />
              {errors.name && (
                <p className="text-[11.5px] text-[#FF383C]">{errors.name}</p>
              )}
            </div>

            {/* Поле «Email / Телефон» */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-contact"
                className="block text-[14px] text-[#FDFCEA]"
              >
                Email / Телефон
              </label>
              <input
                id="reg-contact"
                type="text"
                value={contactValue}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, contact: undefined }));
                  setContactValue(e.target.value);
                }}
                placeholder="example@myskill.com"
                className={`w-full h-[43px] rounded-[10px] border px-3.5 text-[14.5px] text-[#FDFCEA] placeholder-[#FDFCEA]/55 focus:bg-[#05131C] focus:shadow-[0_0_5px_#FDFCEA] focus:outline-none transition ${
                  errors.contact
                    ? 'border-[#FF383C] bg-[#05131C]'
                    : 'border-[#FDFCEA] bg-[#FDFCEA0D]'
                }`}
              />
              {errors.contact && (
                <p className="text-[11.5px] text-[#FF383C]">{errors.contact}</p>
              )}
            </div>

            {/* Поле «Придумайте пароль» + кнопка показать/скрыть */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-password"
                className="block text-[14px] text-[#FDFCEA]"
              >
                Придумайте пароль
              </label>
              <div
                className={`w-full h-[43px] rounded-[10px] border px-3.5 flex items-center justify-between gap-2 transition focus-within:bg-[#05131C] focus-within:shadow-[0_0_5px_#FDFCEA] ${
                  errors.password
                    ? 'border-[#FF383C] bg-[#05131C]'
                    : 'border-[#FDFCEA] bg-[#FDFCEA0D]'
                }`}
              >
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordValue}
                  onChange={(e) => {
                    setErrors((prev) => ({ ...prev, password: false }));
                    setPasswordValue(e.target.value);
                  }}
                  placeholder=""
                  className="w-full bg-transparent text-[14.5px] text-[#FDFCEA] placeholder-[#FDFCEA]/55 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  className="hover:opacity-100 transition cursor-pointer shrink-0 flex items-center justify-center"
                >
                  {showPassword ? <PasswordHideIcon /> : <PasswordShowIcon />}
                </button>
              </div>
              <p
                className={`text-[12px] leading-tight pt-[2px] ${
                  errors.password ? 'text-[#FF383C]' : 'text-[#FDFCEA]'
                }`}
              >
                Минимальная длина пароля 6 символов
              </p>
            </div>

            {/* Кнопка «Зарегистрироваться»: #FDFCEA -> #FFF886 при заполнении -> свечение при hover */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full h-[43px] rounded-[30px] text-[#05131C] font-medium text-[15px] transition-all duration-200 cursor-pointer select-none ${
                  isFormReady
                    ? 'bg-[#FFF886] hover:shadow-[0_0_10px_#FFF886]'
                    : 'bg-[#FDFCEA] hover:brightness-95'
                }`}
              >
                Зарегистрироваться
              </button>
            </div>
          </form>

          {/* Разделитель «— или —» */}
          <div className="flex items-center gap-3 select-none">
            <span className="flex-1 h-[1px] bg-[#FDFCEA]/75" />
            <span className="text-[14px] text-[#FDFCEA] leading-none">или</span>
            <span className="flex-1 h-[1px] bg-[#FDFCEA]/75" />
          </div>

          {/* Кнопка «Зарегистрироваться с помощью GitHub» (hover: фон #FFF886, текст и кот #05131C, свечение) */}
          <button
            type="button"
            onClick={handleGitHubRegister}
            className="w-full h-[43px] rounded-[30px] border border-[#FFF886] bg-[#05131C] text-[#FFF886] text-[14.5px] font-normal flex items-center justify-center gap-2.5 hover:bg-[#FFF886] hover:text-[#05131C] hover:shadow-[0_0_10px_#FFF886] transition-all duration-200 cursor-pointer select-none"
          >
            <span>Зарегистрироваться с помощью GitHub</span>
            <GitHubCat16Icon />
          </button>

          {/* Нижняя ссылка перехода ко входу */}
          <div className="flex items-center justify-between text-[13px] pt-0.5">
            <span className="text-[#FDFCEA]">Уже есть аккаунт?</span>
            <Link
              to="/login"
              className="text-[#FFF886] font-medium hover:underline"
            >
              Войти
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};