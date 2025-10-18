-- Core Health: Script de optimización y saneamiento del esquema/datos
-- Fecha de generación: 2025-10-12
--
-- Objetivos:
--  1) Estandarizar contraseñas con bcrypt ('1234') para ambientes de desarrollo.
--  2) Añadir índices útiles para rendimiento en consultas frecuentes.
--  3) Documentar relaciones e intenciones de integridad referencial.
--  4) Mantener compatibilidad: cada operación valida existencia de tablas/columnas antes de ejecutar.
--
-- NOTA: Este script está diseñado para MySQL 8+. Si alguna instrucción falla por ya existir,
--       puede ignorarse de forma segura. Revise las advertencias al ejecutar.
--
-- Seguridad: Nunca use esta estandarización de contraseñas en producción.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- =====================
-- 1) Password hashing
-- =====================
-- Sobrescribe 'password_hash' para usuarios de tablas conocidas si existen.
-- Hash (bcrypt cost=10) de la contraseña '1234'. Mismo valor para unificar credenciales de dev.
-- Para producción, reemplace por el hash individual generado en la app.
SET @bcrypt_dev := '$2a$10$Y8fHcDq1m1JxM6G3xg0q9uTmQFf5Jr7q1g4oJxN9hY3b2VfE2bO2W';

-- Helper: función para verificar si existe tabla y columna (vía variables)
-- (Usamos SELECTs condicionados para ejecutar UPDATEs solo cuando procede)

-- Pacientes
SET @tbl := (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'pacientes');
SET @col := (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pacientes' AND column_name = 'password_hash');
SET @sql := IF(@tbl=1 AND @col=1, 'UPDATE pacientes SET password_hash = ?;', 'SELECT 1;');
PREPARE stmt FROM @sql; SET @p1=@bcrypt_dev; EXECUTE stmt USING @p1; DEALLOCATE PREPARE stmt;

-- Médicos
SET @tbl := (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'medicos');
SET @col := (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'medicos' AND column_name = 'password_hash');
SET @sql := IF(@tbl=1 AND @col=1, 'UPDATE medicos SET password_hash = ?;', 'SELECT 1;');
PREPARE stmt FROM @sql; SET @p1=@bcrypt_dev; EXECUTE stmt USING @p1; DEALLOCATE PREPARE stmt;

-- =====================
-- 2) Índices de rendimiento
-- =====================
-- Intento de crear índices si columnas existen. Los nombres siguen convención idx_<tabla>__<columna>.

-- Helper para crear índice en una tabla/col si existe y no está indexada
DROP PROCEDURE IF EXISTS add_index_if_needed;
DELIMITER $$
CREATE PROCEDURE add_index_if_needed(IN p_table VARCHAR(64), IN p_column VARCHAR(64), IN p_index VARCHAR(128))
BEGIN
  DECLARE v_has_table INT DEFAULT 0;
  DECLARE v_has_col INT DEFAULT 0;
  DECLARE v_has_idx INT DEFAULT 0;

  SELECT COUNT(*) INTO v_has_table
  FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name = p_table;

  IF v_has_table = 1 THEN
    SELECT COUNT(*) INTO v_has_col
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = p_table AND column_name = p_column;

    IF v_has_col = 1 THEN
      SELECT COUNT(*) INTO v_has_idx
      FROM information_schema.statistics
      WHERE table_schema = DATABASE() AND table_name = p_table AND index_name = p_index;

      IF v_has_idx = 0 THEN
        SET @ddl = CONCAT('ALTER TABLE `', p_table, '` ADD INDEX `', p_index, '` (`', p_column, '`);');
        PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;
      END IF;
    END IF;
  END IF;
END $$
DELIMITER ;

-- Índices típicos
CALL add_index_if_needed('pacientes','email','idx_pacientes__email');
CALL add_index_if_needed('pacientes','usuario','idx_pacientes__usuario');
CALL add_index_if_needed('pacientes','dpi','idx_pacientes__dpi');

CALL add_index_if_needed('medicos','email','idx_medicos__email');
CALL add_index_if_needed('medicos','usuario','idx_medicos__usuario');
CALL add_index_if_needed('medicos','especialidad_id','idx_medicos__especialidad_id');

CALL add_index_if_needed('citas','paciente_id','idx_citas__paciente_id');
CALL add_index_if_needed('citas','medico_id','idx_citas__medico_id');
CALL add_index_if_needed('citas','especialidad_id','idx_citas__especialidad_id');
CALL add_index_if_needed('citas','consulta_id','idx_citas__consulta_id');
CALL add_index_if_needed('citas','evento_id','idx_citas__evento_id');
CALL add_index_if_needed('citas','fecha','idx_citas__fecha');
CALL add_index_if_needed('citas','estado','idx_citas__estado');

CALL add_index_if_needed('recetas','cita_id','idx_recetas__cita_id');
CALL add_index_if_needed('recetas','diagnostico_id','idx_recetas__diagnostico_id');

CALL add_index_if_needed('receta_detalle','receta_id','idx_receta_detalle__receta_id');
CALL add_index_if_needed('receta_detalle','medicamento_id','idx_receta_detalle__medicamento_id');

-- Índices de catálogos
CALL add_index_if_needed('medicamentos','nombre','idx_medicamentos__nombre');
CALL add_index_if_needed('diagnosticos','nombre','idx_diagnosticos__nombre');
CALL add_index_if_needed('especialidades','nombre','idx_especialidades__nombre');

DROP PROCEDURE IF EXISTS add_index_if_needed;

-- =====================
-- 3) Integridad referencial
-- =====================
-- Debido a que los nombres exactos de las FOREIGN KEY dependen del script original,
-- aquí generamos un reporte de FK existentes para que el DBA verifique las políticas
-- ON DELETE/UPDATE. Ajuste manualmente si se requiere RESTRICT / SET NULL.
-- (Esta sección NO modifica constraints automáticamente para evitar romper datos).
SELECT
  rc.CONSTRAINT_NAME,
  rc.TABLE_NAME,
  kcu.COLUMN_NAME,
  kcu.REFERENCED_TABLE_NAME,
  kcu.REFERENCED_COLUMN_NAME,
  rc.UPDATE_RULE,
  rc.DELETE_RULE
FROM information_schema.REFERENTIAL_CONSTRAINTS rc
JOIN information_schema.KEY_COLUMN_USAGE kcu
  ON rc.CONSTRAINT_SCHEMA = kcu.TABLE_SCHEMA
 AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE rc.CONSTRAINT_SCHEMA = DATABASE()
ORDER BY rc.TABLE_NAME, rc.CONSTRAINT_NAME;

-- =====================
-- 4) Convenciones snake_case (documentación)
-- =====================
-- Recomendación: si detecta columnas en camelCase o PascalCase, normalizar a snake_case.
-- Ejemplos sugeridos (ajuste a su esquema):
--  ALTER TABLE pacientes CHANGE COLUMN userName usuario VARCHAR(100) NOT NULL;
--  ALTER TABLE medicos CHANGE COLUMN especialidadId especialidad_id INT NOT NULL;

COMMIT;

-- Fin del script de optimización.