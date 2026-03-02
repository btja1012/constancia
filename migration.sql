-- Run this once in your Neon DB console
-- Adds missing columns to the configuracion table

ALTER TABLE configuracion
  ADD COLUMN IF NOT EXISTS director_cedula       VARCHAR(50),
  ADD COLUMN IF NOT EXISTS director_credencial   VARCHAR(50),
  ADD COLUMN IF NOT EXISTS institucion_ubicacion TEXT,
  ADD COLUMN IF NOT EXISTS codigo_administrativo VARCHAR(50),
  ADD COLUMN IF NOT EXISTS codigo_plantel        VARCHAR(50),
  ADD COLUMN IF NOT EXISTS codigo_estadistico    VARCHAR(50);
