# ScaleBound - Creator Partnership Platform

A modern, sleek platform connecting creators with business infrastructure.

## Features

- **Waitlist System**: Collect creator applications with Supabase backend
- **Admin Dashboard**: View real-time statistics and applications
- **Secure Authentication**: Key-based admin access
- **Responsive Design**: Works on all devices
- **Dynamic Navigation**: Smart navbar that transforms on scroll
- **Particle Background**: Three.js animated background

## Setup Instructions

1. **Supabase Setup**:
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run SQL queries from setup guide to create tables
   - Get Project URL and Anon Key

2. **Local Development**:
   - Copy `.env.local` to `.env`
   - Update with your Supabase credentials
   - Open `index.html` in browser or use a local server

3. **Deploy to Vercel**:
   - Push to GitHub
   - Import repository on Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `ADMIN_ACCESS_KEY`: Admin access key (default: ALPHA-88)

## Project Structure
