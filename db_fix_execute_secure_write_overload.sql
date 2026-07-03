-- One-time fix for ambiguous RPC overloads.
-- This removes the older execute_secure_write signature and keeps the current canonical one.
DROP FUNCTION IF EXISTS public.execute_secure_write(
  op_username text,
  op_password text,
  target_table text,
  action_type text,
  row_data jsonb,
  row_id text
);
