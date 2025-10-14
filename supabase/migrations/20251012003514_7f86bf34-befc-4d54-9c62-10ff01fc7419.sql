-- Assign admin role to ekvinpeiris@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'ekvinpeiris@gmail.com'),
  'admin'::app_role
)
ON CONFLICT (user_id, role) DO NOTHING;