### dotenv preload
For any new Node, Edge Function, or cron script the Agent generates
(extensions .ts or .js, folders “supabase/functions”, “scripts”, “src/pages/api”),
prepend:  import 'dotenv/config';
