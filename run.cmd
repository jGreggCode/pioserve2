@REM Run this File To Automatically Run The System

@echo off
start cmd /k "cd pos-frontend && npm run dev -- --host"
start cmd /k "cd pos-backend && npm run dev"