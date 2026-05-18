-- likes row가 추가/삭제되면 posts.likes 카운트를 자동 동기화한다.
-- application 코드는 카운트를 직접 만지지 않는다 — DB가 단일 진실원천.
--
-- SECURITY DEFINER 없음(= 기본 INVOKER): 0002 auth 트리거는 supabase_auth_admin이
-- public.users 권한이 없어 DEFINER가 필수였다. likes INSERT/DELETE는 앱이 테이블
-- 소유 role(DATABASE_URL pooler)로 실행하므로 public.posts UPDATE 권한이 이미
-- 있다 — 권한 상승이 불필요해 INVOKER로 둔다.
-- SET search_path = '' 는 함수 종류와 무관한 일반 하드닝 — 객체를 전부 스키마
-- 정규화(public.posts)한다.
-- GREATEST(likes - 1, 0): 카운트가 음수로 내려가지 않도록 방어.
CREATE OR REPLACE FUNCTION public.increment_post_likes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.posts SET likes = likes + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.decrement_post_likes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.posts SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER on_like_inserted
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_post_likes();
--> statement-breakpoint
CREATE TRIGGER on_like_deleted
  AFTER DELETE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_post_likes();
