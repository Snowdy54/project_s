import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MySkillKeysHero } from '../../components/home/MySkillKeysHero';
import {
  PasswordShowIcon,
  PasswordHideIcon,
  GitHubCat16Icon,
} from '../../components/auth/AuthIcons';

const STORAGE_AUTH_KEY = 'skillmap_user_auth_v1';

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

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    login?: string;
    password?: string;
  }>({});

  const isFormReady =
    loginValue.trim().length > 0 && passwordValue.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: { login?: string; password?: string } = {};
    if (!loginValue.trim()) {
      nextErrors.login = 'Введите Email или телефон.';
    }
    if (!passwordValue.trim()) {
      nextErrors.password = 'Введите пароль.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(true));
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/profile');
  };

  const handleGitHubLogin = () => {
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

      {/* ПРАВАЯ ЧАСТЬ: ФОРМА ВХОДА */}
      <section className="flex-1 flex items-center justify-center py-10 lg:py-8 lg:pl-12">
        <div className="w-full max-w-[350px] space-y-6">
          <h1
            style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
            className="text-[32px] font-black text-center text-[#FDFCEA] leading-none"
          >
            Вход
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Поле «Логин» */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-contact"
                className="block text-[14px] text-[#FDFCEA]"
              >
                Логин
              </label>
              <input
                id="login-contact"
                type="text"
                value={loginValue}
                onChange={(e) => {
                  setErrors((prev) => ({ ...prev, login: undefined }));
                  setLoginValue(e.target.value);
                }}
                placeholder="Email / Телефон"
                className={`w-full h-[43px] rounded-[10px] border px-3.5 text-[14.5px] text-[#FDFCEA] placeholder-[#FDFCEA]/55 focus:bg-[#05131C] focus:shadow-[0_0_5px_#FDFCEA] focus:outline-none transition ${
                  errors.login
                    ? 'border-[#FF383C] bg-[#05131C]'
                    : 'border-[#FDFCEA] bg-[#FDFCEA0D]'
                }`}
              />
              {errors.login && (
                <p className="text-[11.5px] text-[#FF383C]">{errors.login}</p>
              )}
            </div>

            {/* Поле «Пароль» + кнопка показать/скрыть */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-[14px] text-[#FDFCEA]"
              >
                Пароль
              </label>
              <div
                className={`w-full h-[43px] rounded-[10px] border px-3.5 flex items-center justify-between gap-2 transition focus-within:bg-[#05131C] focus-within:shadow-[0_0_5px_#FDFCEA] ${
                  errors.password
                    ? 'border-[#FF383C] bg-[#05131C]'
                    : 'border-[#FDFCEA] bg-[#FDFCEA0D]'
                }`}
              >
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordValue}
                  onChange={(e) => {
                    setErrors((prev) => ({ ...prev, password: undefined }));
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
              {errors.password && (
                <p className="text-[11.5px] text-[#FF383C]">{errors.password}</p>
              )}
            </div>

            {/* Кнопка «Войти»: #FDFCEA -> #FFF886 при заполнении -> свечение при hover */}
            <div className="pt-3">
              <button
                type="submit"
                className={`w-full h-[43px] rounded-[30px] text-[#05131C] font-medium text-[15px] transition-all duration-200 cursor-pointer select-none ${
                  isFormReady
                    ? 'bg-[#FFF886] hover:shadow-[0_0_10px_#FFF886]'
                    : 'bg-[#FDFCEA] hover:brightness-95'
                }`}
              >
                Войти
              </button>
            </div>
          </form>

          {/* Разделитель «— или —» */}
          <div className="flex items-center gap-3 select-none">
            <span className="flex-1 h-[1px] bg-[#FDFCEA]/75" />
            <span className="text-[14px] text-[#FDFCEA] leading-none">или</span>
            <span className="flex-1 h-[1px] bg-[#FDFCEA]/75" />
          </div>

          {/* Кнопка «Войти с помощью GitHub» (hover: фон #FFF886, текст и кот #05131C, свечение) */}
          <button
            type="button"
            onClick={handleGitHubLogin}
            className="w-full h-[43px] rounded-[30px] border border-[#FFF886] bg-[#05131C] text-[#FFF886] text-[14.5px] font-normal flex items-center justify-center gap-2.5 hover:bg-[#FFF886] hover:text-[#05131C] hover:shadow-[0_0_10px_#FFF886] transition-all duration-200 cursor-pointer select-none"
          >
            <span>Войти с помощью GitHub</span>
            <GitHubCat16Icon />
          </button>

          {/* Нижняя ссылка перехода к регистрации */}
          <div className="flex items-center justify-between text-[13px] pt-0.5">
            <span className="text-[#FDFCEA]">Еще нет аккаунта?</span>
            <Link
              to="/register"
              className="text-[#FFF886] font-medium hover:underline"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};