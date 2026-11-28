import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import {
  PasswordShowIcon,
  PasswordHideIcon,
  GitHubCat16Icon,
} from '../../components/auth/AuthIcons';
import { defaultUserProfile } from '../../data/achievementsData';
import type { UserProfileData } from '../../types/profile';
import { STORAGE_KEYS, setStorageItem, setAuthToken } from '../../utils/storage';
import {
  isValidEmail,
  isValidPhone,
  isValidNickname,
} from '../../utils/validation';
import { registerUser, githubAuth, ApiError } from '../../utils/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: { name?: string; contact?: string; password?: boolean } = {};
    const trimmedName = nameValue.trim();
    const trimmedContact = contactValue.trim();

    if (!isValidNickname(trimmedName)) {
      nextErrors.name = 'Введите корректное имя (без символов «, ”, »).';
    }
    if (!trimmedContact) {
      nextErrors.contact = 'Укажите Email или телефон.';
    } else if (trimmedContact.includes('@') && !isValidEmail(trimmedContact)) {
      nextErrors.contact = 'Введите корректный Email.';
    } else if (!trimmedContact.includes('@') && !isValidPhone(trimmedContact)) {
      nextErrors.contact = 'Введите корректный Email или телефон (от 10 цифр).';
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

    try {
      const auth = await registerUser(trimmedName, trimmedContact, passwordValue);
      setAuthToken(auth.token);
      setStorageItem(STORAGE_KEYS.PROFILE, newProfile);
      setStorageItem(STORAGE_KEYS.AUTH, true);
      navigate('/profile');
    } catch (err) {
      if (err instanceof ApiError && err.status > 0) {
        setErrors({ contact: err.message });
        return;
      }
      // Офлайн-фолбэк, если бэкенд недоступен
      setStorageItem(STORAGE_KEYS.PROFILE, newProfile);
      setStorageItem(STORAGE_KEYS.AUTH, true);
      navigate('/profile');
    }
  };

  const handleGitHubRegister = async () => {
    try {
      const auth = await githubAuth();
      setAuthToken(auth.token);
      setStorageItem(STORAGE_KEYS.AUTH, true);
      navigate('/profile');
    } catch {
      setStorageItem(STORAGE_KEYS.AUTH, true);
      navigate('/profile');
    }
  };

  return (
    <AuthLayout rightSectionClassName="py-8 lg:py-6">
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
    </AuthLayout>
  );
};
