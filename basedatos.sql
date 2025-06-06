CREATE DATABASE IF NOT EXISTS `talleres_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `talleres_db`;


CREATE TABLE `alumnos` (
  `idalumno` int UNSIGNED NOT NULL,
  `nua` varchar(20) NOT NULL,
  `nivel_ingles` varchar(30) NOT NULL,
  `idprofesor` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `asistencias` (
  `idasistencia` int UNSIGNED NOT NULL,
  `idinscripcion` int UNSIGNED NOT NULL,
  `asistencia` enum('presente','ausente') DEFAULT 'ausente',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `inscripciones` (
  `idinscripcion` int UNSIGNED NOT NULL,
  `idalumno` int UNSIGNED NOT NULL,
  `idtaller` int UNSIGNED NOT NULL,
  `fecha_inscripcion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estatus` enum('inscrito','cancelado') DEFAULT 'inscrito'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `materiales` (
  `idmaterial` int UNSIGNED NOT NULL,
  `idtaller` int UNSIGNED NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `tipo` enum('pdf','link','presentacion','otro') NOT NULL,
  `recurso` text NOT NULL,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificaciones`
--

CREATE TABLE `notificaciones` (
  `idnotificacion` int UNSIGNED NOT NULL,
  `iduser` int UNSIGNED DEFAULT NULL,
  `idtaller` int UNSIGNED DEFAULT NULL,
  `rol_destino` enum('alumno','tallerista','profesor','admin') DEFAULT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('info','aviso','urgente') DEFAULT 'info',
  `leida` tinyint(1) DEFAULT '0',
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `periodos`
--

CREATE TABLE `periodos` (
  `idperiodo` int UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `periodos`
--

INSERT INTO `periodos` (`idperiodo`, `nombre`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(2, 'January-June 2025', '2025-01-20', '2025-05-31', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `talleres`
--

CREATE TABLE `talleres` (
  `idtaller` int UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `cupo_maximo` int UNSIGNED DEFAULT '8',
  `idtallerista` int UNSIGNED NOT NULL,
  `idperiodo` int UNSIGNED NOT NULL,
  `estado` enum('active','canceled','finished') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `iduser` int UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `paterno` varchar(50) NOT NULL,
  `materno` varchar(50) DEFAULT NULL,
  `rol` enum('alumno','tallerista','profesor','admin') NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`iduser`, `nombre`, `paterno`, `materno`, `rol`, `email`, `password`, `fecha_registro`) VALUES
(2, 'Kimberly', 'Villalobos', 'Villanueva', 'tallerista', 'k.villalobosvillanueva@ugto.mx', '$2b$10$MHqsRM1QJ8LzFGQ66TMYFOLcUl3MxTEDqTkk8p6bXeHK92Jll7x7e', '2025-04-10 22:13:27'),
(3, 'Cesar Isai', 'Ortega', 'Diaz', 'tallerista', 'ci.ortegadiaz@ugto.mx', '$2b$10$fNSYbsPFbyOaRBxyHd1xKu.OYyqHZEUFyyvolopMECUITmyz54c5C', '2025-04-10 22:13:27'),
(4, 'Alicia Estefania', 'Camarena', 'Zavala', 'tallerista', 'ae.camarenazavala@ugto.mx', '$2b$10$PQY53iPprE0POgE.MFXHKexFiB3jTxUobUvwM8dshnXWnGFHuHtUq', '2025-04-10 22:13:27'),
(5, 'Rodolfo', 'Reyes', 'Vieyra', 'profesor', 'r.reyes@ugto.mx', '$2b$10$.UdRpcph0yncK2fTslBo8.CV3IHAMZK1F9MCkm6ktozuKh7n1E2q6', '2025-04-16 16:58:12'),
(6, 'Marcelina', 'Pantoja', 'Flores', 'profesor', 'm.pantoja@ugto.mx', '$2b$10$4SlUtuLL5ZV8HMpVre.cGeo5d.chrmiBKhCEezzxHjM5BTaiUdlyO', '2025-04-16 16:58:12'),
(7, 'Ricardo', 'Vieyra', 'Ramirez', 'profesor', 'r.vieyra@ugto.mx', '$2b$10$LTJLkaAJ0zAL8eeCLaTn.O5wQfCfq8WjGFHD2sSHdFjfG/3qbe1ke', '2025-04-16 16:58:12'),
(8, 'Bertha', 'Sámano', 'Orozco', 'profesor', 'b.samano@ugto.mx', '$2b$10$PK70mFnnEWKeDgJv0D4F2Oo9DABR.ku2aolqD7qYUUrjeH2OxIK/W', '2025-04-16 16:58:12'),
(14, 'Admin', 'Admin', 'Admin', 'admin', 'admin@admin.com', '$2b$10$XsvuutNUumvIMlHSasyk6e0btdm3ry52KK0ZsjtPbJgoGJ8iufg7u', '2025-04-25 00:08:58'),
(42, 'Rosalina', 'Romo', 'Molinares', 'profesor', 'r.romo@ugto.mx', '$2b$10$neqE1i89qTP7585/hJlgIuBWVmXPJ/FWbTHEgupbtCVuCAksu25H.', '2025-05-08 04:31:36');

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_admin_alumnos`
-- (See below for the actual view)
--
CREATE TABLE `view_admin_alumnos` (
`email` varchar(100)
,`idalumno` int unsigned
,`nivel_ingles` varchar(30)
,`nombre_completo` varchar(152)
,`nua` varchar(20)
,`profesor` varchar(152)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_admin_alumno_by_id`
-- (See below for the actual view)
--
CREATE TABLE `view_admin_alumno_by_id` (
`email` varchar(100)
,`idalumno` int unsigned
,`idprofesor` int unsigned
,`materno` varchar(50)
,`nivel_ingles` varchar(30)
,`nombre` varchar(50)
,`nua` varchar(20)
,`paterno` varchar(50)
,`profesor` varchar(152)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_admin_profesores`
-- (See below for the actual view)
--
CREATE TABLE `view_admin_profesores` (
`email` varchar(100)
,`idprofesor` int unsigned
,`nombre_completo` varchar(152)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_admin_profesor_by_id`
-- (See below for the actual view)
--
CREATE TABLE `view_admin_profesor_by_id` (
`email` varchar(100)
,`idprofesor` int unsigned
,`materno` varchar(50)
,`nombre` varchar(50)
,`paterno` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_admin_talleristas`
-- (See below for the actual view)
--
CREATE TABLE `view_admin_talleristas` (
`email` varchar(100)
,`idtallerista` int unsigned
,`nombre_completo` varchar(152)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_admin_tallerista_by_id`
-- (See below for the actual view)
--
CREATE TABLE `view_admin_tallerista_by_id` (
`email` varchar(100)
,`idtallerista` int unsigned
,`materno` varchar(50)
,`nombre` varchar(50)
,`paterno` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_admin_taller_by_id`
-- (See below for the actual view)
--
CREATE TABLE `view_admin_taller_by_id` (
`cupo_maximo` int unsigned
,`descripcion` text
,`estado` enum('active','canceled','finished')
,`fecha` date
,`hora` time
,`idperiodo` int unsigned
,`idtaller` int unsigned
,`idtallerista` int unsigned
,`nombre` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_periodos_admin`
-- (See below for the actual view)
--
CREATE TABLE `view_periodos_admin` (
`estado` enum('active','inactive')
,`fecha_fin` varchar(10)
,`fecha_inicio` varchar(10)
,`idperiodo` int unsigned
,`nombre` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_periodo_activo`
-- (See below for the actual view)
--
CREATE TABLE `view_periodo_activo` (
`fecha_fin` varchar(10)
,`fecha_inicio` varchar(10)
,`idperiodo` int unsigned
,`nombre` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_periodo_by_id`
-- (See below for the actual view)
--
CREATE TABLE `view_periodo_by_id` (
`estado` enum('active','inactive')
,`fecha_fin` date
,`fecha_inicio` date
,`idperiodo` int unsigned
,`nombre` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_profesores`
-- (See below for the actual view)
--
CREATE TABLE `view_profesores` (
`email` varchar(100)
,`iduser` int unsigned
,`materno` varchar(50)
,`nombre` varchar(50)
,`paterno` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_talleres_admin`
-- (See below for the actual view)
--
CREATE TABLE `view_talleres_admin` (
`cupo_maximo` int unsigned
,`descripcion` text
,`estado` enum('active','canceled','finished')
,`fecha` varchar(8)
,`hora` varchar(10)
,`idtaller` int unsigned
,`nombre` varchar(100)
,`periodo` varchar(50)
,`tallerista` varchar(152)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_talleres_calendario`
-- (See below for the actual view)
--
CREATE TABLE `view_talleres_calendario` (
`descripcion` text
,`fecha` varchar(8)
,`hora` varchar(10)
,`id` int unsigned
,`periodo` varchar(50)
,`start` varchar(21)
,`tallerista` varchar(152)
,`title` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_talleristas_dropdown`
-- (See below for the actual view)
--
CREATE TABLE `view_talleristas_dropdown` (
`idtallerista` int unsigned
,`nombre_completo` varchar(152)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_taller_by_id`
-- (See below for the actual view)
--
CREATE TABLE `view_taller_by_id` (
`cupo_maximo` int unsigned
,`descripcion` text
,`estado` enum('active','canceled','finished')
,`fecha` varchar(8)
,`hora` varchar(10)
,`idperiodo` int unsigned
,`idtaller` int unsigned
,`idtallerista` int unsigned
,`nombre` varchar(100)
,`periodo` varchar(50)
,`tallerista` varchar(152)
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`idalumno`),
  ADD UNIQUE KEY `nua` (`nua`),
  ADD KEY `idprofesor` (`idprofesor`);

--
-- Indexes for table `asistencias`
--
ALTER TABLE `asistencias`
  ADD PRIMARY KEY (`idasistencia`),
  ADD KEY `idinscripcion` (`idinscripcion`);

--
-- Indexes for table `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`idinscripcion`),
  ADD UNIQUE KEY `idalumno` (`idalumno`,`idtaller`),
  ADD KEY `idtaller` (`idtaller`);

--
-- Indexes for table `materiales`
--
ALTER TABLE `materiales`
  ADD PRIMARY KEY (`idmaterial`),
  ADD KEY `idtaller` (`idtaller`);

--
-- Indexes for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`idnotificacion`),
  ADD KEY `iduser` (`iduser`),
  ADD KEY `idtaller` (`idtaller`);

--
-- Indexes for table `periodos`
--
ALTER TABLE `periodos`
  ADD PRIMARY KEY (`idperiodo`);

--
-- Indexes for table `talleres`
--
ALTER TABLE `talleres`
  ADD PRIMARY KEY (`idtaller`),
  ADD KEY `idtallerista` (`idtallerista`),
  ADD KEY `idperiodo` (`idperiodo`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`iduser`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asistencias`
--
ALTER TABLE `asistencias`
  MODIFY `idasistencia` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `idinscripcion` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materiales`
--
ALTER TABLE `materiales`
  MODIFY `idmaterial` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `idnotificacion` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `periodos`
--
ALTER TABLE `periodos`
  MODIFY `idperiodo` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `talleres`
--
ALTER TABLE `talleres`
  MODIFY `idtaller` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `iduser` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

-- --------------------------------------------------------

--
-- Structure for view `view_admin_alumnos`
--
DROP TABLE IF EXISTS `view_admin_alumnos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_admin_alumnos`  AS SELECT `u`.`iduser` AS `idalumno`, concat(`u`.`nombre`,' ',`u`.`paterno`,' ',`u`.`materno`) AS `nombre_completo`, `u`.`email` AS `email`, `a`.`nua` AS `nua`, `a`.`nivel_ingles` AS `nivel_ingles`, concat(`p`.`nombre`,' ',`p`.`paterno`,' ',`p`.`materno`) AS `profesor` FROM ((`alumnos` `a` join `usuarios` `u` on((`a`.`idalumno` = `u`.`iduser`))) left join `usuarios` `p` on((`a`.`idprofesor` = `p`.`iduser`))) ;

-- --------------------------------------------------------

--
-- Structure for view `view_admin_alumno_by_id`
--
DROP TABLE IF EXISTS `view_admin_alumno_by_id`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_admin_alumno_by_id`  AS SELECT `u`.`iduser` AS `idalumno`, `u`.`nombre` AS `nombre`, `u`.`paterno` AS `paterno`, `u`.`materno` AS `materno`, `u`.`email` AS `email`, `a`.`nua` AS `nua`, `a`.`nivel_ingles` AS `nivel_ingles`, `a`.`idprofesor` AS `idprofesor`, concat(`p`.`nombre`,' ',`p`.`paterno`,' ',`p`.`materno`) AS `profesor` FROM ((`usuarios` `u` join `alumnos` `a` on((`u`.`iduser` = `a`.`idalumno`))) left join `usuarios` `p` on(((`a`.`idprofesor` = `p`.`iduser`) and (`p`.`rol` = 'profesor')))) ;

-- --------------------------------------------------------

--
-- Structure for view `view_admin_profesores`
--
DROP TABLE IF EXISTS `view_admin_profesores`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_admin_profesores`  AS SELECT `usuarios`.`iduser` AS `idprofesor`, concat(`usuarios`.`nombre`,' ',`usuarios`.`paterno`,' ',`usuarios`.`materno`) AS `nombre_completo`, `usuarios`.`email` AS `email` FROM `usuarios` WHERE (`usuarios`.`rol` = 'profesor') ;

-- --------------------------------------------------------

--
-- Structure for view `view_admin_profesor_by_id`
--
DROP TABLE IF EXISTS `view_admin_profesor_by_id`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_admin_profesor_by_id`  AS SELECT `usuarios`.`iduser` AS `idprofesor`, `usuarios`.`nombre` AS `nombre`, `usuarios`.`paterno` AS `paterno`, `usuarios`.`materno` AS `materno`, `usuarios`.`email` AS `email` FROM `usuarios` WHERE (`usuarios`.`rol` = 'profesor') ;

-- --------------------------------------------------------

--
-- Structure for view `view_admin_talleristas`
--
DROP TABLE IF EXISTS `view_admin_talleristas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_admin_talleristas`  AS SELECT `usuarios`.`iduser` AS `idtallerista`, concat(`usuarios`.`nombre`,' ',`usuarios`.`paterno`,' ',`usuarios`.`materno`) AS `nombre_completo`, `usuarios`.`email` AS `email` FROM `usuarios` WHERE (`usuarios`.`rol` = 'tallerista') ;

-- --------------------------------------------------------

--
-- Structure for view `view_admin_tallerista_by_id`
--
DROP TABLE IF EXISTS `view_admin_tallerista_by_id`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_admin_tallerista_by_id`  AS SELECT `usuarios`.`iduser` AS `idtallerista`, `usuarios`.`nombre` AS `nombre`, `usuarios`.`paterno` AS `paterno`, `usuarios`.`materno` AS `materno`, `usuarios`.`email` AS `email` FROM `usuarios` WHERE (`usuarios`.`rol` = 'tallerista') ;

-- --------------------------------------------------------

--
-- Structure for view `view_admin_taller_by_id`
--
DROP TABLE IF EXISTS `view_admin_taller_by_id`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_admin_taller_by_id`  AS SELECT `t`.`idtaller` AS `idtaller`, `t`.`nombre` AS `nombre`, `t`.`descripcion` AS `descripcion`, `t`.`fecha` AS `fecha`, `t`.`hora` AS `hora`, `t`.`cupo_maximo` AS `cupo_maximo`, `t`.`idtallerista` AS `idtallerista`, `t`.`idperiodo` AS `idperiodo`, `t`.`estado` AS `estado` FROM `talleres` AS `t` ;

-- --------------------------------------------------------

--
-- Structure for view `view_periodos_admin`
--
DROP TABLE IF EXISTS `view_periodos_admin`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_periodos_admin`  AS SELECT `periodos`.`idperiodo` AS `idperiodo`, `periodos`.`nombre` AS `nombre`, date_format(`periodos`.`fecha_inicio`,'%d/%m/%Y') AS `fecha_inicio`, date_format(`periodos`.`fecha_fin`,'%d/%m/%Y') AS `fecha_fin`, `periodos`.`estado` AS `estado` FROM `periodos` ORDER BY date_format(`periodos`.`fecha_inicio`,'%d/%m/%Y') DESC ;

-- --------------------------------------------------------

--
-- Structure for view `view_periodo_activo`
--
DROP TABLE IF EXISTS `view_periodo_activo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_periodo_activo`  AS SELECT `periodos`.`idperiodo` AS `idperiodo`, `periodos`.`nombre` AS `nombre`, date_format(`periodos`.`fecha_inicio`,'%d/%m/%Y') AS `fecha_inicio`, date_format(`periodos`.`fecha_fin`,'%d/%m/%Y') AS `fecha_fin` FROM `periodos` WHERE (`periodos`.`estado` = 'active') LIMIT 0, 1 ;

-- --------------------------------------------------------

--
-- Structure for view `view_periodo_by_id`
--
DROP TABLE IF EXISTS `view_periodo_by_id`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_periodo_by_id`  AS SELECT `periodos`.`idperiodo` AS `idperiodo`, `periodos`.`nombre` AS `nombre`, `periodos`.`fecha_inicio` AS `fecha_inicio`, `periodos`.`fecha_fin` AS `fecha_fin`, `periodos`.`estado` AS `estado` FROM `periodos` ;

-- --------------------------------------------------------

--
-- Structure for view `view_profesores`
--
DROP TABLE IF EXISTS `view_profesores`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_profesores`  AS SELECT `usuarios`.`iduser` AS `iduser`, `usuarios`.`nombre` AS `nombre`, `usuarios`.`paterno` AS `paterno`, `usuarios`.`materno` AS `materno`, `usuarios`.`email` AS `email` FROM `usuarios` WHERE (`usuarios`.`rol` = 'profesor') ;

-- --------------------------------------------------------

--
-- Structure for view `view_talleres_admin`
--
DROP TABLE IF EXISTS `view_talleres_admin`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_talleres_admin`  AS SELECT `t`.`idtaller` AS `idtaller`, `t`.`nombre` AS `nombre`, `t`.`descripcion` AS `descripcion`, date_format(`t`.`fecha`,'%d/%m/%y') AS `fecha`, date_format(`t`.`hora`,'%H:%i') AS `hora`, `t`.`cupo_maximo` AS `cupo_maximo`, `t`.`estado` AS `estado`, concat(`u`.`nombre`,' ',`u`.`paterno`,' ',`u`.`materno`) AS `tallerista`, `p`.`nombre` AS `periodo` FROM ((`talleres` `t` join `usuarios` `u` on(((`t`.`idtallerista` = `u`.`iduser`) and (`u`.`rol` = 'tallerista')))) join `periodos` `p` on((`t`.`idperiodo` = `p`.`idperiodo`))) ORDER BY `t`.`fecha` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `view_talleres_calendario`
--
DROP TABLE IF EXISTS `view_talleres_calendario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_talleres_calendario`  AS SELECT `t`.`idtaller` AS `id`, `t`.`nombre` AS `title`, `t`.`descripcion` AS `descripcion`, concat(`t`.`fecha`,'T',`t`.`hora`) AS `start`, date_format(`t`.`fecha`,'%d/%m/%y') AS `fecha`, date_format(`t`.`hora`,'%H:%i') AS `hora`, `p`.`nombre` AS `periodo`, concat(`u`.`nombre`,' ',`u`.`paterno`,' ',`u`.`materno`) AS `tallerista` FROM ((`talleres` `t` join `usuarios` `u` on(((`u`.`iduser` = `t`.`idtallerista`) and (`u`.`rol` = 'tallerista')))) join `periodos` `p` on((`p`.`idperiodo` = `t`.`idperiodo`))) WHERE (`t`.`estado` = 'active') ;

-- --------------------------------------------------------

--
-- Structure for view `view_talleristas_dropdown`
--
DROP TABLE IF EXISTS `view_talleristas_dropdown`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_talleristas_dropdown`  AS SELECT `usuarios`.`iduser` AS `idtallerista`, concat(`usuarios`.`nombre`,' ',`usuarios`.`paterno`,' ',`usuarios`.`materno`) AS `nombre_completo` FROM `usuarios` WHERE (`usuarios`.`rol` = 'tallerista') ORDER BY `usuarios`.`nombre` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `view_taller_by_id`
--
DROP TABLE IF EXISTS `view_taller_by_id`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `view_taller_by_id`  AS SELECT `t`.`idtaller` AS `idtaller`, `t`.`nombre` AS `nombre`, `t`.`descripcion` AS `descripcion`, date_format(`t`.`fecha`,'%d/%m/%y') AS `fecha`, date_format(`t`.`hora`,'%H:%i') AS `hora`, `t`.`cupo_maximo` AS `cupo_maximo`, `t`.`estado` AS `estado`, `t`.`idtallerista` AS `idtallerista`, `t`.`idperiodo` AS `idperiodo`, concat(`u`.`nombre`,' ',`u`.`paterno`,' ',`u`.`materno`) AS `tallerista`, `p`.`nombre` AS `periodo` FROM ((`talleres` `t` join `usuarios` `u` on(((`u`.`iduser` = `t`.`idtallerista`) and (`u`.`rol` = 'tallerista')))) join `periodos` `p` on((`p`.`idperiodo` = `t`.`idperiodo`))) ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`idalumno`) REFERENCES `usuarios` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `alumnos_ibfk_2` FOREIGN KEY (`idprofesor`) REFERENCES `usuarios` (`iduser`),
  ADD CONSTRAINT `fk_alumno_usuario` FOREIGN KEY (`idalumno`) REFERENCES `usuarios` (`iduser`) ON DELETE CASCADE;

--
-- Constraints for table `asistencias`
--
ALTER TABLE `asistencias`
  ADD CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`idinscripcion`) REFERENCES `inscripciones` (`idinscripcion`) ON DELETE CASCADE;

--
-- Constraints for table `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`idalumno`) REFERENCES `alumnos` (`idalumno`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`idtaller`) REFERENCES `talleres` (`idtaller`) ON DELETE CASCADE;

--
-- Constraints for table `materiales`
--
ALTER TABLE `materiales`
  ADD CONSTRAINT `materiales_ibfk_1` FOREIGN KEY (`idtaller`) REFERENCES `talleres` (`idtaller`) ON DELETE CASCADE;

--
-- Constraints for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`iduser`) REFERENCES `usuarios` (`iduser`) ON DELETE CASCADE,
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`idtaller`) REFERENCES `talleres` (`idtaller`) ON DELETE CASCADE;

--
-- Constraints for table `talleres`
--
ALTER TABLE `talleres`
  ADD CONSTRAINT `talleres_ibfk_1` FOREIGN KEY (`idtallerista`) REFERENCES `usuarios` (`iduser`),
  ADD CONSTRAINT `talleres_ibfk_2` FOREIGN KEY (`idperiodo`) REFERENCES `periodos` (`idperiodo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
------------------------------------------------------------------------------------------------------------
/*Procedimiento para crear talleres */
DELIMITER //

CREATE PROCEDURE sp_crear_taller_tallerista (
  IN p_nombre VARCHAR(100),
  IN p_descripcion TEXT,
  IN p_fecha DATE,
  IN p_hora TIME,
  IN p_cupo_maximo INT,
  IN p_idtallerista INT,
  IN p_idperiodo INT
)
BEGIN
  INSERT INTO talleres (
    nombre,
    descripcion,
    fecha,
    hora,
    cupo_maximo,
    idtallerista,
    idperiodo
  ) VALUES (
    p_nombre,
    p_descripcion,
    p_fecha,
    p_hora,
    p_cupo_maximo,
    p_idtallerista,
    p_idperiodo
  );
END //

DELIMITER ;

---------------------------------------------------
/*  procedimiento para registrar al alumno en un taller  */
DELIMITER //

CREATE PROCEDURE sp_inscribirse_taller (
  IN p_idalumno INT,
  IN p_idtaller INT
)
BEGIN
  DECLARE v_cupo_maximo INT;
  DECLARE v_inscritos INT;
  DECLARE v_ya_inscrito INT;
  DECLARE v_estado_taller VARCHAR(20);

  -- 1. Verificar si el alumno ya está inscrito
  SELECT COUNT(*) INTO v_ya_inscrito
  FROM inscripciones
  WHERE idalumno = p_idalumno AND idtaller = p_idtaller;

  IF v_ya_inscrito > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El alumno ya está inscrito en este taller';
  END IF;

  -- 2. Obtener el estado del taller y su cupo máximo
  SELECT estado, cupo_maximo INTO v_estado_taller, v_cupo_maximo
  FROM talleres
  WHERE idtaller = p_idtaller;

  IF v_estado_taller IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El taller no existe';
  END IF;

  IF v_estado_taller != 'active' THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El taller no está activo';
  END IF;

  -- 3. Contar los inscritos actuales
  SELECT COUNT(*) INTO v_inscritos
  FROM inscripciones
  WHERE idtaller = p_idtaller;

  IF v_inscritos >= v_cupo_maximo THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El taller ya alcanzó el cupo máximo';
  END IF;

  -- 4. Insertar inscripción
  INSERT INTO inscripciones (idalumno, idtaller)
  VALUES (p_idalumno, p_idtaller);
END //

DELIMITER ;
------------------------------------------------------------------------
/* */
CREATE OR REPLACE VIEW view_inscripciones_alumno AS
SELECT 
  i.idinscripcion,
  i.idalumno,
  i.idtaller,
  i.estatus,
  t.nombre AS nombre_taller,
  t.fecha,
  t.hora,
  p.nombre AS periodo,
  u.nombre AS tallerista_nombre,
  u.paterno AS tallerista_paterno,
  u.materno AS tallerista_materno
FROM inscripciones i
JOIN talleres t ON i.idtaller = t.idtaller
JOIN periodos p ON t.idperiodo = p.idperiodo
JOIN usuarios u ON t.idtallerista = u.iduser;


-- ==========================================
-- Procedimiento: sp_cancelar_inscripcion
-- Descripción : Cambia el estatus de una inscripción a 'cancelado'
-- Parámetros  :
--   p_idinscripcion - ID de la inscripción a cancelar
-- ==========================================
DELIMITER //
CREATE PROCEDURE sp_cancelar_inscripcion(IN p_idinscripcion INT)
BEGIN
  UPDATE inscripciones
  SET estatus = 'cancelado'
  WHERE idinscripcion = p_idinscripcion;
END //
DELIMITER ;

-- ==========================================
-- Procedimiento: sp_cambiar_estado_taller
-- Descripción : Actualiza el estado de un taller (por ejemplo: 'activo', 'cancelado')
-- Parámetros  :
--   p_idtaller     - ID del taller
--   nuevo_estado   - Nuevo estado que se le asignará al taller
-- ==========================================
DELIMITER //
CREATE PROCEDURE sp_cambiar_estado_taller(IN p_idtaller INT, IN nuevo_estado VARCHAR(50))
BEGIN
  UPDATE talleres
  SET estado = nuevo_estado
  WHERE idtaller = p_idtaller;
END //
DELIMITER ;

-- ==========================================
-- Procedimiento: sp_editar_taller_tallerista
-- Descripción : Permite a un tallerista editar nombre y descripción de su taller
-- Parámetros  :
--   p_idtaller    - ID del taller a editar
--   p_nombre      - Nuevo nombre del taller
--   p_descripcion - Nueva descripción del taller
-- ==========================================
DELIMITER //
CREATE PROCEDURE sp_editar_taller_tallerista(
  IN p_idtaller INT,
  IN p_nombre VARCHAR(100),
  IN p_descripcion TEXT
)
BEGIN
  UPDATE talleres
  SET nombre = p_nombre, descripcion = p_descripcion
  WHERE idtaller = p_idtaller;
END //
DELIMITER ;
