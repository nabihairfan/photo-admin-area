import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  'https://qihsgnfjqmkjmoowyfbn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaHNnbmZqcW1ram1vb3d5ZmJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUyNzQwMCwiZXhwIjoyMDY1MTAzNDAwfQ.-UVd2ho68QQ--Wbc0u2uOK11SaJjyHPS5nz9UhmbG-E'
)