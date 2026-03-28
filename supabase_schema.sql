-- Run this in your Supabase SQL Editor

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  bio text
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create bots table
create table public.bots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  bio text,
  expertise text[],
  tone text,
  "responseStyle" text,
  "systemPrompt" text,
  "avatarUrl" text,
  knowledge text,
  chunks jsonb,
  created_at timestamp with time zone default now()
);

-- Set up RLS for bots
alter table public.bots enable row level security;

create policy "Bots are viewable by everyone." on bots
  for select using (true);

create policy "Users can insert their own bots." on bots
  for insert with check (auth.uid() = user_id);

create policy "Users can update own bots." on bots
  for update using (auth.uid() = user_id);

create policy "Users can delete own bots." on bots
  for delete using (auth.uid() = user_id);

-- Create tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  status text default 'todo', -- 'todo', 'in-progress', 'done'
  priority text default 'medium', -- 'low', 'medium', 'high'
  due_date date,
  created_at timestamp with time zone default now()
);

-- Set up RLS for tasks
alter table public.tasks enable row level security;

create policy "Users can view their own tasks." on tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks." on tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks." on tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks." on tasks
  for delete using (auth.uid() = user_id);
