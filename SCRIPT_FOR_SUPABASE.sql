-- This is the script I used for my database


-- Create table Downloads
CREATE TABLE downloads (
  id bigint generated always as identity primary key,
  document_url text not null,
  document_title text not null,
  customer_id text not null,
  customer_name text not null,
  downloaded_at timestamptz default now() not null
);

-- Index to sort by date quickly
CREATE INDEX downloads_downloaded_at_idx ON downloads (downloaded_at desc);

-- Active Row Level Security
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
ON downloads
FOR ALL
TO service_role
USING (true);