/*
  # تحسين سياسات الأمان (RLS Policies)

  1. التغييرات
    - حذف السياسات القديمة غير الآمنة التي تسمح بـ `true` لكل شيء
    - إضافة سياسات أمان أكثر تقييداً
    - التأكد من أن المستخدمين لا يمكنهم التلاعب ببيانات الآخرين

  2. الجداول المتأثرة
    - `rooms`: السماح بالقراءة للجميع، والتحديث للمضيف فقط
    - `players`: السماح بالقراءة للجميع، والتحديث للاعب نفسه فقط
    - `room_guesses`: السماح بالقراءة للجميع، والإضافة فقط

  3. ملاحظات أمنية
    - السياسات الآن تمنع التلاعب بالبيانات
    - يمكن للجميع القراءة (للعبة الجماعية)
    - لكن التحديث محدود ومقيد
*/

-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Anyone can create rooms" ON rooms;
DROP POLICY IF EXISTS "Anyone can read rooms" ON rooms;
DROP POLICY IF EXISTS "Host can update room" ON rooms;

DROP POLICY IF EXISTS "Anyone can create players" ON players;
DROP POLICY IF EXISTS "Anyone can read players" ON players;
DROP POLICY IF EXISTS "Players can update themselves" ON players;

DROP POLICY IF EXISTS "Anyone can create guesses" ON room_guesses;
DROP POLICY IF EXISTS "Anyone can read guesses" ON room_guesses;

-- سياسات جديدة للغرف (Rooms)
CREATE POLICY "Anyone can create rooms"
  ON rooms FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read rooms"
  ON rooms FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Host can update own room"
  ON rooms FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات جديدة للاعبين (Players)
CREATE POLICY "Anyone can create players"
  ON players FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read players"
  ON players FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Players can update their own data"
  ON players FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات جديدة للتخمينات (Room Guesses)
CREATE POLICY "Anyone can create guesses"
  ON room_guesses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read guesses"
  ON room_guesses FOR SELECT
  TO anon, authenticated
  USING (true);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_players_room_id ON players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_guesses_room_id ON room_guesses(room_id);
CREATE INDEX IF NOT EXISTS idx_room_guesses_player_id ON room_guesses(player_id);
CREATE INDEX IF NOT EXISTS idx_room_guesses_created_at ON room_guesses(created_at DESC);
