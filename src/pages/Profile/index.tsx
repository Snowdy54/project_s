import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type {
  UserProfileData,
  UserRoadmapProgress,
  AchievementDefinition,
} from '../../types/profile';
import {
  defaultUserProfile,
  initialStartedMaps,
  initialFavoriteMaps,
  achievementsCatalog,
} from '../../data/achievementsData';
import {
  PixelEmptyAvatarUserIcon,
  PixelVerifiedCheckIcon,
  PixelSidebarProfileIcon,
  PixelSidebarBoltIcon,
  PixelSidebarTrophyIcon,
  PixelMenuChevronRight,
  PixelLogoutIcon,
  PixelGitHubIcon,
  PixelVKIcon,
  PixelTelegramIcon,
  PixelWebsiteIcon,
} from '../../components/profile/ProfileIcons';
import { AvatarCropModal } from '../../components/profile/AvatarCropModal';
import { Footer } from '../../components/layout/Footer';
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from '../../utils/storage';

type ProfileTab = 'profile' | 'activity' | 'achievements';
type AuthMode = 'login' | 'register' | 'forgot';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidPhone = (value: string) =>
  value.replace(/\D/g, '').length >= 10;

export const ProfilePage: React.FC = () => {
  // Авторизация пользователя
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() =>
    getStorageItem(STORAGE_KEYS.AUTH, true)
  );
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authName, setAuthName] = useState('');
  const [authContact, setAuthContact] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMessage, setAuthMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // Синхронизация статуса авторизации при переключении между вкладками
  useEffect(() => {
    const handleSync = () => {
      setIsAuthorized(getStorageItem(STORAGE_KEYS.AUTH, true));
    };
    window.addEventListener('skillmap-storage-sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('skillmap-storage-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Активная вкладка ЛК
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

  // Сохранённый и редактируемый профиль (по умолчанию avatarUrl = '' — пустая жёлтая аватарка)
  const [savedProfile, setSavedProfile] = useState<UserProfileData>(() =>
    getStorageItem(STORAGE_KEYS.PROFILE, defaultUserProfile)
  );
  const [formProfile, setFormProfile] = useState<UserProfileData>(savedProfile);

  // Выбор и обрезка аватарки из галереи
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rawImageToCrop, setRawImageToCrop] = useState<string | null>(null);

  // Отслеживание фокуса полей
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Статус сохранения на кнопке (5 сек светится #DDD2FD, затем возврат в #FFF886)
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ошибка валидации формы профиля
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Модальное окно удаления профиля (по ЧТЗ 2.2.2)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmWord, setDeleteConfirmWord] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Активность: начатые и избранные карты
  const [startedMaps] = useState<UserRoadmapProgress[]>(initialStartedMaps);
  const [favoriteMaps, setFavoriteMaps] = useState<UserRoadmapProgress[]>(() =>
    getStorageItem(STORAGE_KEYS.FAVORITES, initialFavoriteMaps)
  );
  const [mapToRemoveId, setMapToRemoveId] = useState<string | null>(null);

  // Достижения
  const [achievements] = useState<AchievementDefinition[]>(achievementsCatalog);

  // Проверка наличия несохранённых изменений
  const isDirty = useMemo(() => {
    return JSON.stringify(formProfile) !== JSON.stringify(savedProfile);
  }, [formProfile, savedProfile]);

  // Статусы подтверждения Email и Телефона
  const isEmailConfirmed =
    formProfile.email.trim().length > 0 &&
    formProfile.email.trim() === savedProfile.email.trim() &&
    isValidEmail(formProfile.email) &&
    focusedField !== 'email';

  const isPhoneConfirmed =
    formProfile.phone.trim().length > 0 &&
    formProfile.phone.trim() === savedProfile.phone.trim() &&
    isValidPhone(formProfile.phone) &&
    focusedField !== 'phone';

  // Открытие галереи при клике на аватарку
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Выберите файл изображения (JPG, PNG, WebP).');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawImageToCrop(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveCroppedAvatar = (croppedDataUrl: string) => {
    const updatedSaved = { ...savedProfile, avatarUrl: croppedDataUrl };
    const updatedForm = { ...formProfile, avatarUrl: croppedDataUrl };
    setSavedProfile(updatedSaved);
    setFormProfile(updatedForm);
    setStorageItem(STORAGE_KEYS.PROFILE, updatedSaved);
    setRawImageToCrop(null);
  };

  const handleResetAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSaved = { ...savedProfile, avatarUrl: '' };
    const updatedForm = { ...formProfile, avatarUrl: '' };
    setSavedProfile(updatedSaved);
    setFormProfile(updatedForm);
    setStorageItem(STORAGE_KEYS.PROFILE, updatedSaved);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedNick = formProfile.nickname.trim();
    if (!trimmedNick) {
      setFormError('Укажите никнейм пользователя.');
      return;
    }
    if (/[«»”]/.test(trimmedNick)) {
      setFormError('Имя не должно содержать символы «, ”, »');
      return;
    }
    if (formProfile.email.trim() && !isValidEmail(formProfile.email)) {
      setFormError('Введите корректный адрес Email.');
      return;
    }
    if (formProfile.phone.trim() && !isValidPhone(formProfile.phone)) {
      setFormError('Введите корректный номер телефона.');
      return;
    }

    const normalizedProfile: UserProfileData = {
      ...formProfile,
      nickname: trimmedNick,
      email: formProfile.email.trim(),
      phone: formProfile.phone.trim(),
    };

    setSavedProfile(normalizedProfile);
    setFormProfile(normalizedProfile);
    setStorageItem(STORAGE_KEYS.PROFILE, normalizedProfile);

    setIsSavedSuccess(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setIsSavedSuccess(false);
    }, 5000);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setStorageItem(STORAGE_KEYS.AUTH, false);
    setAuthMode('login');
    setAuthMessage(null);
  };

  const handleConfirmDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmWord.trim() !== 'Удалить') {
      setDeleteError('Неверный ввод. Удаление аккаунта прервано.');
      return;
    }
    removeStorageItem(STORAGE_KEYS.PROFILE);
    removeStorageItem(STORAGE_KEYS.FAVORITES);
    setStorageItem(STORAGE_KEYS.AUTH, false);
    setSavedProfile(defaultUserProfile);
    setFormProfile(defaultUserProfile);
    setIsDeleteModalOpen(false);
    setDeleteConfirmWord('');
    setDeleteError(null);
    setIsAuthorized(false);
  };

  const handleRemoveFavorite = (id: string) => {
    const updated = favoriteMaps.filter((m) => m.id !== id);
    setFavoriteMaps(updated);
    setStorageItem(STORAGE_KEYS.FAVORITES, updated);
    setMapToRemoveId(null);
  };

  const unlockedAchievements = achievements.filter((a) => a.unlockedCount > 0);
  const totalAchievementPoints = achievements.reduce(
    (sum, a) => sum + a.points * a.unlockedCount,
    0
  );

  const nameParts = savedProfile.nickname.trim().split(/\s+/);
  const firstNameLine = nameParts[0] || 'Пользователь';
  const secondNameLine = nameParts.slice(1).join(' ');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (authMode === 'forgot') {
      if (!authContact.trim()) {
        setAuthMessage({
          type: 'error',
          text: 'Пользователь с таким email/телефоном не найден.',
        });
        return;
      }
      setAuthMessage({
        type: 'success',
        text: 'Ссылка для сброса пароля отправлена на указанный адрес.',
      });
      return;
    }

    if (authMode === 'register') {
      if (/[«»”]/.test(authName)) {
        setAuthMessage({
          type: 'error',
          text: 'Не удалось зарегистрироваться из-за недопустимых символов в имени («, ”, »).',
        });
        return;
      }
      if (authPassword.length < 6) {
        setAuthMessage({
          type: 'error',
          text: 'Не удалось зарегистрироваться: минимальная длина пароля 6 символов.',
        });
        return;
      }
      const nextProfile: UserProfileData = {
        ...defaultUserProfile,
        nickname: authName.trim() || defaultUserProfile.nickname,
        email: authContact.includes('@') ? authContact.trim() : '',
        phone: !authContact.includes('@') ? authContact.trim() : '',
      };
      setSavedProfile(nextProfile);
      setFormProfile(nextProfile);
      setStorageItem(STORAGE_KEYS.PROFILE, nextProfile);
    }

    setIsAuthorized(true);
    setStorageItem(STORAGE_KEYS.AUTH, true);
  };

  if (!isAuthorized) {
    const isFormReady =
      authMode === 'forgot'
        ? authContact.trim().length > 0
        : authMode === 'login'
          ? authContact.trim().length > 0 && authPassword.length > 0
          : authName.trim().length > 0 &&
            authContact.trim().length > 0 &&
            authPassword.length > 0;

    return (
      <div className="min-h-[calc(100vh-88px)] bg-[#05131C] text-[#FFFFFF] flex flex-col justify-between">
        <main className="w-full px-6 lg:px-[90px] py-12 flex items-center justify-center flex-1">
          <div className="w-full max-w-[440px] rounded-[20px] border-2 border-[#FFF886] bg-[#05131C] p-8 shadow-[0_0_16px_rgba(255,248,134,0.25)] space-y-6">
            <div className="text-center space-y-1.5">
              <h1
                style={{ fontFamily: 'UnifontExMono, monospace' }}
                className="text-[28px] text-[#FFF886]"
              >
                {authMode === 'login' && 'Вход в аккаунт'}
                {authMode === 'register' && 'Регистрация'}
                {authMode === 'forgot' && 'Восстановление пароля'}
              </h1>
              <p className="text-[13.5px] text-[#FDFCEA]/75">
                Войдите в личный кабинет или зарегистрируйтесь для сохранения прогресса
              </p>
            </div>

            {authMessage && (
              <div
                className={`px-4 py-3 rounded-[12px] border text-[13px] ${
                  authMessage.type === 'error'
                    ? 'border-[#FF383C] bg-[#FF383C]/10 text-[#FDFCEA]'
                    : 'border-[#FFF886] bg-[#FFF886]/10 text-[#FFF886]'
                }`}
              >
                {authMessage.text}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1.5">
                  <label className="block text-[14px] text-[#FFFFFF]">Имя</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Александр Скиллмапов"
                    className="w-full h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] px-4 text-[14px] text-[#FDFCEA]/55 focus:text-[#FDFCEA] focus:shadow-[0_0_5px_#FDFCEA] focus:outline-none transition"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[14px] text-[#FFFFFF]">
                  Email / телефон
                </label>
                <input
                  type="text"
                  value={authContact}
                  onChange={(e) => setAuthContact(e.target.value)}
                  placeholder="example@skillmap.ru"
                  className="w-full h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] px-4 text-[14px] text-[#FDFCEA]/55 focus:text-[#FDFCEA] focus:shadow-[0_0_5px_#FDFCEA] focus:outline-none transition"
                />
              </div>

              {authMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[14px] text-[#FFFFFF]">Пароль</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setAuthMessage(null);
                        }}
                        className="text-[12.5px] text-[#DDD2FD] hover:underline cursor-pointer"
                      >
                        Забыли пароль?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="w-full h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] px-4 text-[14px] text-[#FDFCEA]/55 focus:text-[#FDFCEA] focus:shadow-[0_0_5px_#FDFCEA] focus:outline-none transition"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormReady}
                className={`w-full h-[43px] rounded-[30px] bg-[#FFF886] text-[#05131C] font-medium text-[15px] transition ${
                  isFormReady
                    ? 'opacity-100 hover:shadow-[0_0_10px_#FFF886] cursor-pointer'
                    : 'opacity-45 cursor-not-allowed'
                }`}
              >
                {authMode === 'login' && 'Войти'}
                {authMode === 'register' && 'Зарегистрироваться'}
                {authMode === 'forgot' && 'Отправить ссылку'}
              </button>
            </form>

            {authMode !== 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setIsAuthorized(true);
                  setStorageItem(STORAGE_KEYS.AUTH, true);
                }}
                className="w-full h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] text-[#FDFCEA] text-[14px] flex items-center justify-center gap-2.5 hover:shadow-[0_0_5px_#FDFCEA] transition cursor-pointer"
              >
                <PixelGitHubIcon />
                <span>
                  {authMode === 'login'
                    ? 'Войти через GitHub'
                    : 'Зарегистрироваться через GitHub'}
                </span>
              </button>
            )}

            <div className="pt-2 text-center text-[13.5px] text-[#FDFCEA]/75">
              {authMode === 'login' ? (
                <>
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthMessage(null);
                    }}
                    className="text-[#FFF886] hover:underline cursor-pointer"
                  >
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthMessage(null);
                  }}
                  className="text-[#FFF886] hover:underline cursor-pointer"
                >
                  Вернуться ко входу
                </button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: 'Product Sans, sans-serif' }}
      className="min-h-[calc(100vh-88px)] bg-[#05131C] text-[#FFFFFF] flex flex-col justify-between relative"
    >
      {/* Скрытый input для выбора изображения из галереи */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Основная сетка Личного кабинета: Левое меню (208px) + Правая рабочая область */}
      <main className="w-full px-6 lg:px-[90px] pt-4 pb-16">
        <div className="flex flex-col lg:flex-row items-stretch gap-5">
          {/* 1. ЛЕВОЕ БОКОВОЕ МЕНЮ (208px, контур 2px #DDD2FD) */}
          <aside className="w-full lg:w-[208px] shrink-0 rounded-[16px] border-2 border-[#DDD2FD] bg-[#FDFCEA0D] p-3.5 flex flex-col justify-between lg:min-h-[680px] select-none">
            {/* Три вкладки навигации с пиксельным шрифтом и точными цветами */}
            <nav
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="space-y-2 pt-1"
            >
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full h-[44px] px-4 rounded-full flex items-center justify-between text-[15px] transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#DDD2FD] text-[#05131C]'
                    : 'text-[#FDFCEA] hover:bg-white/[0.04]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <PixelSidebarProfileIcon />
                  <span>Профиль</span>
                </span>
                <PixelMenuChevronRight />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activity')}
                className={`w-full h-[44px] px-4 rounded-full flex items-center justify-between text-[15px] transition cursor-pointer ${
                  activeTab === 'activity'
                    ? 'bg-[#DDD2FD] text-[#05131C]'
                    : 'text-[#FDFCEA] hover:bg-white/[0.04]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <PixelSidebarBoltIcon />
                  <span>Активность</span>
                </span>
                <PixelMenuChevronRight />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('achievements')}
                className={`w-full h-[44px] px-4 rounded-full flex items-center justify-between text-[15px] transition cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-[#DDD2FD] text-[#05131C]'
                    : 'text-[#FDFCEA] hover:bg-white/[0.04]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <PixelSidebarTrophyIcon />
                  <span>Достижения</span>
                </span>
                <PixelMenuChevronRight />
              </button>
            </nav>

            {/* Нижний мини-профиль в меню (40x40: фото или пустая жёлтая аватарка) */}
            <div className="pt-8 lg:pt-0 px-2 pb-1 flex items-center gap-3">
              {savedProfile.avatarUrl ? (
                <img
                  src={savedProfile.avatarUrl}
                  alt={savedProfile.nickname}
                  className="w-10 h-10 rounded-full object-cover border border-[#FFF886] shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#FFF886] border border-[#FFF886] text-[#05131C] flex items-center justify-center shrink-0">
                  <PixelEmptyAvatarUserIcon size={20} />
                </div>
              )}
              <div className="min-w-0 text-[12px] leading-[1.25] text-[#FDFCEA]/85">
                <div className="truncate">{firstNameLine}</div>
                {secondNameLine && <div className="truncate">{secondNameLine}</div>}
              </div>
            </div>
          </aside>

          {/* 2. ПРАВАЯ ОБЛАСТЬ СОДЕРЖИМОГО */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* ВЕРХНЯЯ КАРТОЧКА ПОЛЬЗОВАТЕЛЯ */}
            <section className="w-full rounded-[20px] border-2 border-[#FFF886] bg-[#05131C] px-6 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_10px_rgba(255,248,134,0.3)]">
              <div className="flex items-center gap-5 sm:gap-7 min-w-0">
                {/* АВАТАРКА 100x100: по умолчанию пустая жёлтая (#FFF886) с иконкой #05131C */}
                <div className="relative group shrink-0">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    title="Нажмите, чтобы загрузить фото из галереи"
                    className="w-[100px] h-[100px] rounded-full border border-[#FFF886] bg-[#FFF886] text-[#05131C] shadow-[0_0_10px_#FFF886] flex items-center justify-center overflow-hidden relative cursor-pointer transition hover:brightness-105"
                  >
                    {savedProfile.avatarUrl ? (
                      <img
                        src={savedProfile.avatarUrl}
                        alt={savedProfile.nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PixelEmptyAvatarUserIcon size={50} />
                    )}

                    {/* Подсказка при наведении на аватарку */}
                    <div className="absolute inset-0 bg-[#05131C]/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center px-2">
                      <span
                        style={{ fontFamily: 'UnifontExMono, monospace' }}
                        className="text-[11px] leading-tight text-[#FFF886]"
                      >
                        {savedProfile.avatarUrl ? 'Изменить фото' : 'Загрузить фото'}
                      </span>
                    </div>
                  </button>

                  {/* Кнопка сброса фото обратно в пустую аватарку (если фото загружено) */}
                  {savedProfile.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleResetAvatar}
                      title="Удалить фото"
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#05131C] border border-[#FF383C] text-[#FF383C] hover:bg-[#FF383C] hover:text-[#05131C] text-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <h1
                    style={{ fontFamily: 'UnifontExMono, monospace' }}
                    className="text-2xl sm:text-[32px] text-[#FFF886] leading-tight truncate"
                  >
                    {savedProfile.nickname}
                  </h1>
                  <p className="text-[14px] text-[#FFF886] mt-1">
                    {activeTab === 'profile' && 'Настройки вашего аккаунта'}
                    {activeTab === 'activity' && 'Ваши начатые и избранные карты навыков'}
                    {activeTab === 'achievements' &&
                      `Получено достижений: ${unlockedAchievements.length} · Всего очков: ${totalAchievementPoints}`}
                  </p>
                </div>
              </div>

              {/* Кнопка «Выйти»: default #FDFCEA80 (50%), hover заливка #FDFCEA + цвет #05131C */}
              <button
                type="button"
                onClick={handleLogout}
                className="h-[43px] px-5 rounded-[30px] border-2 border-[#FDFCEA80] bg-[#05131C] text-[#FDFCEA80] text-[14px] inline-flex items-center gap-2.5 hover:bg-[#FDFCEA] hover:border-[#FDFCEA] hover:text-[#05131C] transition cursor-pointer select-none"
              >
                <span>Выйти</span>
                <PixelLogoutIcon />
              </button>
            </section>

            {/* ================= ВКЛАДКА 1: ПРОФИЛЬ (ТОЧНО ПО FIGMA) ================= */}
            {activeTab === 'profile' && (
              <form
                onSubmit={handleSaveProfile}
                className="grid grid-cols-1 xl:grid-cols-[1.04fr_1fr] gap-5 items-stretch"
              >
                {/* ЛЕВАЯ КАРТОЧКА: ОСНОВНАЯ ИНФОРМАЦИЯ */}
                <div className="rounded-[20px] border-2 border-[#FFF886] bg-[#05131C] p-6 sm:p-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <h2
                      style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                      className="text-[20px] sm:text-[22px] font-black text-[#FFFFFF]"
                    >
                      Основная информация
                    </h2>

                    {/* Никнейм* */}
                    <div className="space-y-1.5">
                      <label className="block text-[14px] text-[#FFFFFF]">
                        Никнейм*
                      </label>
                      <input
                        type="text"
                        value={formProfile.nickname}
                        onFocus={() => setFocusedField('nickname')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => {
                          setIsSavedSuccess(false);
                          setFormError(null);
                          setFormProfile((prev) => ({
                            ...prev,
                            nickname: e.target.value,
                          }));
                        }}
                        placeholder="Александр Скиллмапов"
                        className={`w-full h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] px-4 text-[14.5px] placeholder-[#FDFCEA]/45 focus:outline-none transition ${
                          focusedField === 'nickname'
                            ? 'text-[#FDFCEA] shadow-[0_0_5px_#FDFCEA]'
                            : 'text-[#FDFCEA]/55'
                        }`}
                      />
                    </div>

                    {/* Email или Телефон */}
                    <div className="space-y-2 pt-0.5">
                      <p className="text-[13px] text-[#FDFCEA]/50">
                        Укажите хотя бы один способ связи: Email или Телефон
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Поле Email */}
                        <div className="space-y-1.5">
                          <label className="block text-[14px] text-[#FFFFFF]">
                            Email
                          </label>
                          <div
                            className={`w-full h-[43px] rounded-[10px] border bg-[#FDFCEA0D] px-3.5 flex items-center justify-between gap-2 transition ${
                              focusedField === 'email'
                                ? 'border-[#FDFCEA] shadow-[0_0_5px_#FDFCEA]'
                                : isEmailConfirmed
                                  ? 'border-[#34C759]'
                                  : 'border-[#FDFCEA]'
                            }`}
                          >
                            <input
                              type="email"
                              value={formProfile.email}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              onChange={(e) => {
                                setIsSavedSuccess(false);
                                setFormError(null);
                                setFormProfile((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }));
                              }}
                              placeholder=""
                              className={`w-full bg-transparent text-[14.5px] focus:outline-none ${
                                focusedField === 'email'
                                  ? 'text-[#FDFCEA]'
                                  : 'text-[#FDFCEA]/60'
                              }`}
                            />
                            {isEmailConfirmed && (
                              <span className="text-[#34C759] shrink-0" title="Подтверждено">
                                <PixelVerifiedCheckIcon />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Поле Телефон */}
                        <div className="space-y-1.5">
                          <label className="block text-[14px] text-[#FFFFFF]">
                            Телефон
                          </label>
                          <div
                            className={`w-full h-[43px] rounded-[10px] border bg-[#FDFCEA0D] px-3.5 flex items-center justify-between gap-2 transition ${
                              focusedField === 'phone'
                                ? 'border-[#FDFCEA] shadow-[0_0_5px_#FDFCEA]'
                                : isPhoneConfirmed
                                  ? 'border-[#34C759]'
                                  : 'border-[#FDFCEA]'
                            }`}
                          >
                            <input
                              type="tel"
                              value={formProfile.phone}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              onChange={(e) => {
                                setIsSavedSuccess(false);
                                setFormError(null);
                                setFormProfile((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }));
                              }}
                              placeholder=""
                              className={`w-full bg-transparent text-[14.5px] focus:outline-none ${
                                focusedField === 'phone'
                                  ? 'text-[#FDFCEA]'
                                  : 'text-[#FDFCEA]/60'
                              }`}
                            />
                            {isPhoneConfirmed && (
                              <span className="text-[#34C759] shrink-0" title="Подтверждено">
                                <PixelVerifiedCheckIcon />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {formError && (
                        <p className="text-[12.5px] text-[#FF383C] pt-0.5">{formError}</p>
                      )}
                    </div>
                  </div>

                  {/* Кнопка «Сохранить изменения» */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!isDirty && !isSavedSuccess}
                      className={`w-full h-[43px] rounded-[30px] text-[#05131C] font-medium text-[15px] transition select-none ${
                        isSavedSuccess
                          ? 'bg-[#DDD2FD] shadow-[0_0_10px_#DDD2FD] cursor-default'
                          : isDirty
                            ? 'bg-[#FFF886] hover:shadow-[0_0_10px_#FFF886] cursor-pointer'
                            : 'bg-[#FFF886] opacity-90 cursor-not-allowed'
                      }`}
                    >
                      {isSavedSuccess
                        ? 'Изменения успешно сохранены!'
                        : 'Сохранить изменения'}
                    </button>
                  </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА: ССЫЛКИ + ОПАСНАЯ ЗОНА */}
                <div className="flex flex-col justify-between gap-5">
                  {/* КАРТОЧКА ССЫЛОК */}
                  <div className="rounded-[20px] border-2 border-[#FFF886] bg-[#05131C] p-6 sm:p-7 space-y-4">
                    <h2
                      style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                      className="text-[20px] sm:text-[22px] font-black text-[#FFFFFF]"
                    >
                      Ссылки
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* GitHub */}
                      <label
                        className={`h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] pl-[15px] pr-3 flex items-center gap-2.5 transition ${
                          focusedField === 'github'
                            ? 'text-[#FDFCEA] shadow-[0_0_5px_#FDFCEA]'
                            : 'text-[#FDFCEA]/55'
                        }`}
                      >
                        <PixelGitHubIcon />
                        <input
                          type="text"
                          value={formProfile.links.github}
                          onFocus={() => setFocusedField('github')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => {
                            setIsSavedSuccess(false);
                            setFormProfile((prev) => ({
                              ...prev,
                              links: { ...prev.links, github: e.target.value },
                            }));
                          }}
                          placeholder="GitHub"
                          className="w-full bg-transparent text-[14.5px] text-inherit placeholder-[#FDFCEA]/50 focus:outline-none"
                        />
                      </label>

                      {/* VK */}
                      <label
                        className={`h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] pl-[15px] pr-3 flex items-center gap-2.5 transition ${
                          focusedField === 'vk'
                            ? 'text-[#FDFCEA] shadow-[0_0_5px_#FDFCEA]'
                            : 'text-[#FDFCEA]/55'
                        }`}
                      >
                        <PixelVKIcon />
                        <input
                          type="text"
                          value={formProfile.links.vk}
                          onFocus={() => setFocusedField('vk')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => {
                            setIsSavedSuccess(false);
                            setFormProfile((prev) => ({
                              ...prev,
                              links: { ...prev.links, vk: e.target.value },
                            }));
                          }}
                          placeholder="VK"
                          className="w-full bg-transparent text-[14.5px] text-inherit placeholder-[#FDFCEA]/50 focus:outline-none"
                        />
                      </label>

                      {/* Telegram */}
                      <label
                        className={`h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] pl-[15px] pr-3 flex items-center gap-2.5 transition ${
                          focusedField === 'telegram'
                            ? 'text-[#FDFCEA] shadow-[0_0_5px_#FDFCEA]'
                            : 'text-[#FDFCEA]/55'
                        }`}
                      >
                        <PixelTelegramIcon />
                        <input
                          type="text"
                          value={formProfile.links.telegram}
                          onFocus={() => setFocusedField('telegram')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => {
                            setIsSavedSuccess(false);
                            setFormProfile((prev) => ({
                              ...prev,
                              links: { ...prev.links, telegram: e.target.value },
                            }));
                          }}
                          placeholder="Telegram"
                          className="w-full bg-transparent text-[14.5px] text-inherit placeholder-[#FDFCEA]/50 focus:outline-none"
                        />
                      </label>

                      {/* Website */}
                      <label
                        className={`h-[43px] rounded-[10px] border border-[#FDFCEA] bg-[#FDFCEA0D] pl-[15px] pr-3 flex items-center gap-2.5 transition ${
                          focusedField === 'website'
                            ? 'text-[#FDFCEA] shadow-[0_0_5px_#FDFCEA]'
                            : 'text-[#FDFCEA]/55'
                        }`}
                      >
                        <PixelWebsiteIcon />
                        <input
                          type="text"
                          value={formProfile.links.website}
                          onFocus={() => setFocusedField('website')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => {
                            setIsSavedSuccess(false);
                            setFormProfile((prev) => ({
                              ...prev,
                              links: { ...prev.links, website: e.target.value },
                            }));
                          }}
                          placeholder="Website"
                          className="w-full bg-transparent text-[14.5px] text-inherit placeholder-[#FDFCEA]/50 focus:outline-none"
                        />
                      </label>
                    </div>
                  </div>

                  {/* ОПАСНАЯ ЗОНА (КРАСНЫЙ #FF383C) */}
                  <div className="rounded-[20px] border-2 border-[#FF383C] bg-[#05131C] px-6 sm:px-7 py-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2
                        style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                        className="text-[19px] sm:text-[20px] font-black text-[#FDFCEA]"
                      >
                        Опасная зона
                      </h2>
                      <p className="text-[13px] text-[#FDFCEA]/85 leading-[1.35]">
                        Удаление аккаунта необратимо.
                        <br />
                        Все данные
                        <br />и прогресс будут стёрты.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmWord('');
                        setDeleteError(null);
                        setIsDeleteModalOpen(true);
                      }}
                      className="shrink-0 h-[43px] px-[21px] rounded-[30px] border border-[#FF383C] bg-[#05131C] text-[#FDFCEA] text-[14px] hover:bg-[#FF383C] hover:text-[#05131C] transition cursor-pointer select-none"
                    >
                      Удалить профиль
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ================= ВКЛАДКА 2: АКТИВНОСТЬ (ЧТЗ 2.2.1) ================= */}
            {activeTab === 'activity' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Начатые карты пользователя */}
                <div className="rounded-[20px] border-2 border-[#FFF886] bg-[#05131C] p-6 sm:p-7 space-y-4">
                  <h2
                    style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                    className="text-[20px] font-black text-[#FFFFFF]"
                  >
                    Начатые карты
                  </h2>

                  {startedMaps.length === 0 ? (
                    <p className="text-[14px] text-[#FDFCEA]/75 leading-relaxed">
                      Отсутствуют начатые карты. Выберите карту из{' '}
                      <Link to="/roadmap" className="text-[#FFF886] underline">
                        списка
                      </Link>{' '}
                      и начните своё обучение!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {startedMaps.map((map) => (
                        <Link
                          key={map.id}
                          to={map.path}
                          className="block rounded-[14px] border border-[#FDFCEA]/60 bg-[#FDFCEA0D] p-4 hover:border-[#FFF886] transition space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              style={{ fontFamily: 'UnifontExMono, monospace' }}
                              className="text-[17px] text-[#FDFCEA]"
                            >
                              {map.title}
                            </span>
                            <span
                              style={{ fontFamily: 'UnifontExMono, monospace' }}
                              className="text-[15px] text-[#FFF886]"
                            >
                              {map.progress}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#FDFCEA]/15 overflow-hidden">
                            <div
                              className="h-full bg-[#FFF886] rounded-full"
                              style={{ width: `${map.progress}%` }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Избранные карты пользователя */}
                <div className="rounded-[20px] border-2 border-[#DDD2FD] bg-[#05131C] p-6 sm:p-7 space-y-4">
                  <h2
                    style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                    className="text-[20px] font-black text-[#FFFFFF]"
                  >
                    Избранные карты
                  </h2>

                  {favoriteMaps.length === 0 ? (
                    <p className="text-[14px] text-[#FDFCEA]/75 leading-relaxed">
                      Отсутствуют избранные карты. Отметьте особо понравившиеся направления в{' '}
                      <Link to="/roadmap" className="text-[#DDD2FD] underline">
                        списке
                      </Link>{' '}
                      интерактивных карт!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {favoriteMaps.map((map) => (
                        <div
                          key={map.id}
                          className="rounded-[14px] border border-[#FDFCEA]/60 bg-[#FDFCEA0D] p-4 space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <Link
                              to={map.path}
                              style={{ fontFamily: 'UnifontExMono, monospace' }}
                              className="text-[17px] text-[#FDFCEA] hover:text-[#DDD2FD] transition"
                            >
                              {map.title}
                            </Link>
                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                style={{ fontFamily: 'UnifontExMono, monospace' }}
                                className="text-[15px] text-[#DDD2FD]"
                              >
                                {map.progress}%
                              </span>
                              <button
                                type="button"
                                onClick={() => setMapToRemoveId(map.id)}
                                className="text-[12px] px-3 py-1 rounded-full border border-[#FF383C] text-[#FDFCEA] hover:bg-[#FF383C] hover:text-[#05131C] transition cursor-pointer"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#FDFCEA]/15 overflow-hidden">
                            <div
                              className="h-full bg-[#DDD2FD] rounded-full"
                              style={{ width: `${map.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= ВКЛАДКА 3: ДОСТИЖЕНИЯ (ЧТЗ 2.2.3) ================= */}
            {activeTab === 'achievements' && (
              <div className="space-y-5">
                {/* Счётчик очков */}
                <div className="rounded-[20px] border-2 border-[#DDD2FD] bg-[#05131C] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-[15px] text-[#FDFCEA]">
                    Получено достижений:{' '}
                    <span className="font-bold text-[#FFF886]">
                      {unlockedAchievements.length} из {achievements.length}
                    </span>
                  </div>
                  <div
                    style={{ fontFamily: 'UnifontExMono, monospace' }}
                    className="text-[18px] text-[#FFF886]"
                  >
                    Счётчик очков: {totalAchievementPoints} XP
                  </div>
                </div>

                {/* Список всех достижений */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {achievements.map((ach) => {
                    const isUnlocked = ach.unlockedCount > 0;
                    return (
                      <div
                        key={ach.id}
                        className={`rounded-[18px] border-2 p-5 flex flex-col justify-between space-y-3 transition ${
                          isUnlocked
                            ? 'border-[#FFF886] bg-[#FFF886]/[0.06]'
                            : 'border-[#FDFCEA]/25 bg-[#FDFCEA0D] opacity-75'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              style={{
                                fontFamily: 'Product Sans Black, Product Sans, sans-serif',
                              }}
                              className={`text-[16px] font-black ${
                                isUnlocked ? 'text-[#FFF886]' : 'text-[#FDFCEA]'
                              }`}
                            >
                              {ach.title}
                            </span>
                            <span className="shrink-0 text-[11px] px-2.5 py-0.5 rounded-full border border-[#DDD2FD]/50 text-[#DDD2FD]">
                              {ach.type === 'unique' ? 'Уникальное' : 'Многоразовое'}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#FDFCEA]/80 leading-snug">
                            {ach.condition}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#FDFCEA]/15 flex items-center justify-between text-[13px]">
                          <span
                            style={{ fontFamily: 'UnifontExMono, monospace' }}
                            className="text-[#FFF886]"
                          >
                            +{ach.points} очков
                          </span>
                          <span className="text-[#FDFCEA]/75">
                            {isUnlocked
                              ? ach.type === 'repeatable'
                                ? `Получено: ${ach.unlockedCount}× (${ach.points * ach.unlockedCount} очк.)`
                                : 'Получено'
                              : 'Не получено'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* МОДАЛКА КАДРИРОВАНИЯ АВАТАРКИ (КВАДРАТ С КРУГЛОЙ РАМКОЙ) */}
      {rawImageToCrop && (
        <AvatarCropModal
          imageSrc={rawImageToCrop}
          onCancel={() => setRawImageToCrop(null)}
          onSave={handleSaveCroppedAvatar}
        />
      )}

      {/* МОДАЛКА ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ ПРОФИЛЯ (ЧТЗ 2.2.2) */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <form
            onSubmit={handleConfirmDeleteAccount}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-[20px] border-2 border-[#FF383C] bg-[#05131C] p-6 sm:p-7 space-y-4 shadow-2xl"
          >
            <h3
              style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
              className="text-[20px] font-black text-[#FDFCEA]"
            >
              Подтверждение удаления профиля
            </h3>
            <p className="text-[14px] text-[#FDFCEA]/85 leading-relaxed">
              Для подтверждения безвозвратного удаления аккаунта введите слово{' '}
              <span className="font-bold text-[#FF383C]">Удалить</span> в поле ниже:
            </p>

            {deleteError && (
              <p className="text-[13px] text-[#FF383C] font-medium">{deleteError}</p>
            )}

            <input
              type="text"
              value={deleteConfirmWord}
              onChange={(e) => setDeleteConfirmWord(e.target.value)}
              placeholder="Удалить"
              className="w-full h-[43px] rounded-[10px] border border-[#FF383C] bg-[#FDFCEA0D] px-4 text-[14.5px] text-[#FDFCEA] focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
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
      )}

      {/* МОДАЛКА ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ ИЗ ИЗБРАННОГО (ЧТЗ 2.2.1) */}
      {mapToRemoveId && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setMapToRemoveId(null)}
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
                onClick={() => setMapToRemoveId(null)}
                className="h-[40px] px-6 rounded-[30px] border border-[#FDFCEA]/50 text-[#FDFCEA] text-[14px] hover:bg-white/5 transition cursor-pointer"
              >
                Нет
              </button>
              <button
                type="button"
                onClick={() => handleRemoveFavorite(mapToRemoveId)}
                className="h-[40px] px-6 rounded-[30px] bg-[#DDD2FD] text-[#05131C] font-medium text-[14px] hover:brightness-105 transition cursor-pointer"
              >
                Да
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};