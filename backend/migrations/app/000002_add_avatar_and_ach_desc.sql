-- Добавляем поддержку хранения аватаров и обновляем описания достижений под суммарные этапы
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS avatar_url TEXT NOT NULL DEFAULT '';

UPDATE public.achievements SET description = 'Изучить 5 этапов суммарно по картам или достичь 50% одной карты' WHERE code = 'tip_of_iceberg';
UPDATE public.achievements SET description = 'Изучить 10 этапов суммарно или пройти 50% в направлении' WHERE code = 'halfway_there';
UPDATE public.achievements SET description = 'Пройти 15 этапов суммарно или завершить карту на 100%' WHERE code = 'first_peak';
UPDATE public.achievements SET description = 'Пройти 24 этапа суммарно или закрыть карту на 100%' WHERE code = 'mastered_skill';
