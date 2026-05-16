-- 새 auth.users row가 생기면(예: Google OAuth 가입) public.users 프로필 row를
-- 자동 생성한다.
--
-- SECURITY DEFINER: 함수는 호출자가 아니라 함수 소유자(마이그레이션 role/postgres)
-- 권한으로 실행된다. auth.users INSERT는 `supabase_auth_admin` 컨텍스트에서
-- 일어나는데 이 role은 public.users에 권한이 없다 — DEFINER가 없으면 INSERT 실패.
-- SET search_path = '' 는 search_path 하이재킹을 막는 하드닝이며,
-- 그래서 아래 모든 객체를 스키마로 정규화(public.users)한다.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, avatar)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'avatar_url',
      NEW.raw_user_meta_data ->> 'picture'
    )
  );
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
