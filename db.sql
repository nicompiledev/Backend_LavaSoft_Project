drop database lavasoft;
create database lavasoft;

use lavasoft;

create table usuarios (
id_usuario varchar(100) not null primary key,
nombre varchar(50) not null,
apellido varchar(50) not null,
correo_electronico varchar(255) not null unique,
contrasena varchar(255) not null,
telefono varchar(20) not null,
token varchar(100) null,
creado timestamp not null default current_timestamp,
confirmado boolean not null default false,
rol varchar(50) not null default 'cliente'
);

select * from usuarios;

create table lavaderos (
id_lavadero varchar(100) not null primary key,
nombre varchar(50) not null,
ciudad varchar(50) not null,
direccion varchar(100) not null,
telefono varchar(20) not null,
token varchar(100) null,
correo_electronico varchar(100) not null unique,
contrasena varchar(255) not null,
hora_apertura varchar(20) not null,
hora_cierre varchar(20) not null,
ultima_actualizacion timestamp not null default current_timestamp,
calificacion_promedio float null,
confirmado boolean not null default false,
estado boolean not null default false
-- imagen_lavadero varchar(255)
);
select * from lavaderos;

CREATE TABLE imagenes_lavaderos (
   id INT AUTO_INCREMENT PRIMARY KEY,
   id_lavadero varchar(100) not null,
   ruta_imagen VARCHAR(255) NOT NULL,
   foreign key (id_lavadero) references lavaderos(id_lavadero)
);

select * from imagenes_lavaderos;


create table quejas_reclamaciones (
id_queja_reclamacion int not null auto_increment primary key,
id_usuario varchar(100) not null,
id_lavadero varchar(100) not null,
descripcion_queja varchar(255) not null,
fecha_hora_queja datetime not null,
estado_queja enum('pendiente', 'resuelta') not null,
fecha_hora_resolucion datetime not null,
foreign key (id_usuario) references usuarios(id_usuario),
foreign key (id_lavadero) references lavaderos(id_lavadero)
);

create table horarios (
id_horario int not null auto_increment primary key,
id_lavadero varchar(100) not null,
dia_semana varchar(20) not null,
hora_apertura time not null,
hora_cierre time not null,
foreign key (id_lavadero) references lavaderos(id_lavadero)
);

create table tipos_vehiculos (
id_tipo_vehiculo int not null auto_increment primary key,
nombre_tipo_vehiculo varchar(50) not null
);

create table servicios (
id_servicio int not null auto_increment primary key,
nombre_servicio varchar(50) not null,
descripcion_servicio varchar(100) not null
);

create table precios (
id_precio int not null auto_increment primary key,
id_servicio int not null,
precio float not null,
foreign key (id_servicio) references servicios(id_servicio)
);

create table precios_servicios (
id_precio_servicio int not null auto_increment primary key,
id_servicio int not null,
id_precio int not null,
foreign key (id_servicio) references servicios(id_servicio),
foreign key (id_precio) references precios(id_precio)
);

create table reservas (
id_reserva int not null auto_increment primary key,
id_usuario varchar(100) not null,
id_lavadero varchar(100) not null,
id_servicio int not null,
fecha_hora_reserva datetime not null,
estado_reserva enum('pendiente', 'confirmada', 'cancelada') not null,
foreign key (id_usuario) references usuarios(id_usuario),
foreign key (id_lavadero) references lavaderos(id_lavadero),
foreign key (id_servicio) references servicios(id_servicio)
);

create table reservas_canceladas (
id_reserva_cancelada int not null auto_increment primary key,
id_reserva int not null,
motivo_cancelacion varchar(255) not null,
fecha_hora_cancelacion datetime not null,
foreign key (id_reserva) references reservas(id_reserva)
);

create table vehiculos (
id_vehiculo int not null auto_increment primary key,
id_tipo_vehiculo int not null,
id_usuario varchar(100) not null,
marca varchar(50) not null,
modelo varchar(50) not null,
anio int not null,
placa varchar(10) not null,
foreign key (id_usuario) references usuarios(id_usuario),
foreign key (id_tipo_vehiculo) references tipos_vehiculos(id_tipo_vehiculo)
);

create table notificaciones (
id_notificacion int not null auto_increment primary key,
id_usuario varchar(100) not null,
id_lavadero varchar(100) not null,
fecha_hora_notificacion datetime not null,
mensaje varchar(100) not null,
foreign key (id_usuario) references usuarios(id_usuario),
foreign key (id_lavadero) references lavaderos(id_lavadero)
);

create table valoracionesusuarios (
id_valoracion_usuario int not null auto_increment primary key,
id_lavadero varchar(100) not null,
id_usuario varchar(100) not null,
valoracion float not null,
fecha_valoracion datetime not null,
comentarios varchar(255) not null,
foreign key (id_lavadero) references lavaderos(id_lavadero),
foreign key (id_usuario) references usuarios(id_usuario)
);

create table promocionesdescuentos (
id_promocion_descuento int not null auto_increment primary key,
id_lavadero varchar(100) not null,
id_tipo_vehiculo int not null,
id_servicio int not null,
descuento float not null,
codigo_promocion varchar(50) not null,
fecha_inicio date not null,
fecha_fin date not null,
estado_promocion enum('activo', 'inactivo') not null,
cantidad_disponible int not null,
foreign key (id_lavadero) references lavaderos(id_lavadero),
foreign key (id_tipo_vehiculo) references tipos_vehiculos(id_tipo_vehiculo),
foreign key (id_servicio) references servicios(id_servicio)
);

create table estadisticas (
id_estadisticas int not null auto_increment primary key,
id_lavadero varchar(100) not null,
fecha_estadisticas date not null,
cantidad_vehiculos_lavados int not null,
cantidad_servicios_vendidos int not null,
total_ingresos float not null,
tiempo_promedio_lavado float not null,
tasa_ocupacion float not null,
foreign key (id_lavadero) references lavaderos(id_lavadero)
);

create table pagos (
id_pago int not null auto_increment primary key,
id_reserva int not null,
fecha_pago datetime not null,
monto_pago float not null,
estado_pago varchar(50) not null,
foreign key (id_reserva) references reservas(id_reserva)
);

create table transacciones (
id_transaccion int not null auto_increment primary key,
id_usuario varchar(100) not null,
id_lavadero varchar(100),
id_reserva int,
tipo_transaccion varchar(50) not null,
fecha_hora_transaccion datetime not null,
monto_transaccion float not null,
foreign key (id_usuario) references usuarios(id_usuario),
foreign key (id_lavadero) references lavaderos(id_lavadero),
foreign key (id_reserva) references reservas(id_reserva)
);

create table administradores (
	id_administrador int not null auto_increment primary key,
    correo_electronico varchar(255) not null unique,
	contrasena varchar(255) not null
);

insert into administradores (correo_electronico, contrasena) values ('slash2130kevin@gmail.com', '$2b$10$I/NGKQl96uVNUBE5lP95Ye5kz7Uqao1RYgCFX76QNAXtnPozKV8HO')
    -- lavasoftadmin123