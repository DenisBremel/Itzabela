-- ============================================================
--  ITZABELA — ESTRUCTURA DE LA BASE DE DATOS
--  ------------------------------------------------------------
--  Pega todo este archivo en Supabase → SQL Editor → Run.
--  Se puede ejecutar más de una vez sin romper nada.
-- ============================================================

-- Tabla del catálogo -----------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  description text        not null default '',
  price       numeric(10, 2) not null default 0 check (price >= 0),
  image_url   text        not null default '',
  category    text        not null default 'ramos'
                check (category in ('ramos', 'cajas', 'arreglos', 'plantas')),
  stock       integer     not null default 0 check (stock >= 0),
  featured    boolean     not null default false,
  active      boolean     not null default true,
  sort_order  integer     not null default 100,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Última barrera contra datos rotos: aunque alguien escriba en la
-- tabla saltándose el panel, el nombre no puede quedar en blanco.
alter table public.products drop constraint if exists products_name_not_blank;
alter table public.products
  add constraint products_name_not_blank check (length(trim(name)) > 0);

-- Índices para las consultas que hace la web ------------------
create index if not exists products_active_order_idx
  on public.products (active, sort_order);

create index if not exists products_featured_idx
  on public.products (featured) where featured;

-- `updated_at` siempre al día ---------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ============================================================
--  SEGURIDAD (RLS)
--  ------------------------------------------------------------
--  La clave "anon" del sitio es pública: cualquiera puede leerla
--  en el navegador. Lo que protege el catálogo son estas reglas:
--   - Cualquiera puede LEER los productos activos.
--   - Solo alguien con sesión iniciada puede leer los ocultos,
--     crear, editar o borrar.
-- ============================================================
alter table public.products enable row level security;

drop policy if exists "Catalogo publico visible" on public.products;
create policy "Catalogo publico visible"
  on public.products for select
  to anon
  using (active = true);

drop policy if exists "Administracion lee todo" on public.products;
create policy "Administracion lee todo"
  on public.products for select
  to authenticated
  using (true);

drop policy if exists "Administracion crea" on public.products;
create policy "Administracion crea"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "Administracion edita" on public.products;
create policy "Administracion edita"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Administracion borra" on public.products;
create policy "Administracion borra"
  on public.products for delete
  to authenticated
  using (true);

-- ============================================================
--  ALMACÉN DE FOTOS (Supabase Storage)
--  ------------------------------------------------------------
--  Depósito público `productos`: cualquiera puede VER las fotos
--  (es el catálogo de la tienda), pero solo con sesión iniciada
--  se puede subir, reemplazar o borrar.
--
--  Si esta parte falla con un error de permisos, crea el
--  depósito a mano: Storage -> New bucket -> nombre `productos`
--  -> marcar "Public bucket". Las políticas de abajo ya no harán
--  falta, Supabase pone las suyas.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do update set public = true;

drop policy if exists "Fotos de productos visibles" on storage.objects;
create policy "Fotos de productos visibles"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'productos');

drop policy if exists "Administracion sube fotos" on storage.objects;
create policy "Administracion sube fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

drop policy if exists "Administracion reemplaza fotos" on storage.objects;
create policy "Administracion reemplaza fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos')
  with check (bucket_id = 'productos');

drop policy if exists "Administracion borra fotos" on storage.objects;
create policy "Administracion borra fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');

-- ============================================================
--  CATÁLOGO DE EJEMPLO (opcional)
--  ------------------------------------------------------------
--  Descomenta este bloque si prefieres cargar los productos
--  desde aquí en vez de usar el botón "Importar catálogo de
--  ejemplo" del panel. Las fotos son de Unsplash: cámbialas por
--  las tuyas cuando las tengas.
-- ============================================================
-- insert into public.products (name, description, price, image_url, category, stock, featured, sort_order)
-- values
--   ('Ramo de 12 rosas rojas', 'El clásico que nunca falla.', 129, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80', 'ramos', 8, true, 1),
--   ('Ramo primaveral de tulipanes', 'Quince tulipanes de temporada.', 149, 'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=900&q=80', 'ramos', 5, true, 2);
