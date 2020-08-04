
create database aconel;

--TABLA CATEGORIAS
CREATE TABLE categories(
	id serial,
	name varchar(100),
	slug varchar(100) UNIQUE,
	description text,
	primary key(id)
);

--TABLA PRODUCTOS
CREATE TABLE products(
	id serial,
	category_id int,
	name varchar(100),
	slug varchar(100) UNIQUE,
	description text,
	price decimal(10,2),
	featured_image_id  int,
	primary key(id),
	constraint product_category_category_id_fkey foreign key (category_id)
		references categories (id) match simple
		on update no action on delete no action
	constraint product_image_featured_image_fkey foreign key (featured_image_id)
		references images (id) match simple
		on update no action on delete no action
);

--TABLA SERVICIOS
CREATE TABLE services(
	id serial,
	name varchar(100),
	description text,
	position int,
	primary key(id)
);

CREATE TABLE images(
	id serial,
	filename varchar(100)
	title varchar(100),
	description text,
	alt varchar(50),
	src varchar(100),
	category varchar(100),
	mimetype varchar(20),
	size int
	primary key(id)
);

CREATE TABLE products_images(
	product_id int,
	image_id int,
	primary key(product_id,image_id),
	constraint products_images_product_id_fkey foreign key (product_id)
		references products (id) match simple
		on update CASCADE on delete CASCADE,
	constraint products_images_image_id_fkey foreign key (image_id)
		references images (id) match simple
		on update CASCADE on delete CASCADE 
);

CREATE TABLE services_images(
	service_id int,
	image_id int,
	primary key(service_id,image_id),
	constraint services_images_service_id_fkey foreign key (service_id)
		references services (id) match simple
		on update CASCADE on delete CASCADE,
	constraint services_images_image_id_fkey foreign key (image_id)
		references images (id) match simple
		on update CASCADE on delete CASCADE,
);

CREATE TABLE contacts(
	id serial,
	firstname varchar(100),
	lastname varchar(100),
	telnum varchar(10),
	email varchar(100),
	agree boolean,
	contact_type varchar(10),
	message text,
	primary key(id)
);

CREATE TABLE users(
	id serial,
	firstname varchar(100),
	lastname varchar(100),
	email varchar(100),
	username varchar(50),
	password varchar(500),
	primary key(id)
);


--Eliminar constraint
ALTER TABLE products_images DROP CONSTRAINT products_images_product_id_fkey;
ALTER TABLE products_images DROP CONSTRAINT products_images_image_id_fkey;

--Añadir constraint
ALTER TABLE products_images ADD CONSTRAINT products_images_product_id_fkey foreign key (product_id)
references products (id) match simple
on update CASCADE on delete CASCADE;

ALTER TABLE products_images ADD CONSTRAINT products_images_image_id_fkey foreign key (image_id)
references images (id) match simple
on update CASCADE on delete CASCADE

--Eliminar constraint services_images
ALTER TABLE services_images DROP CONSTRAINT services_images_service_id_fkey;
ALTER TABLE services_images DROP CONSTRAINT services_images_image_id_fkey;
--Añadir constraint
ALTER TABLE services_images ADD CONSTRAINT services_images_service_id_fkey foreign key (service_id)
references services (id) match simple
on update CASCADE on delete CASCADE;

ALTER TABLE services_images ADD CONSTRAINT services_images_image_id_fkey foreign key (image_id)
references images (id) match simple
on update CASCADE on delete CASCADE

--Añadir columna position a tabla services
 ALTER TABLE services ADD COLUMN position int

--Añadir columna de slug a la tabla products
ALTER TABLE products ADD COLUMN slug varchar(100)
 --Añadir constraint unique a tabla products
 alter table products add constraint unique_slug unique (slug)

 --Añadir columna de slug a la tabla categories
ALTER TABLE categories ADD COLUMN slug varchar(100)
 --Añadir constraint unique a tabla products
 alter table categories add constraint unique_slug unique (slug)

 --Añadir campo categoría a la tabla images
 ALTER TABLE images ADD COLUMN category varchar(100)
 ALTER TABLE images ADD COLUMN description text

 --Renombrar columna name de tabla images
 ALTER TABLE images  RENAME COLUMN name TO title;
 ALTER TABLE images ADD COLUMN filename varchar(100)
 ALTER TABLE images ADD COLUMN mimetype varchar(20)
 ALTER TABLE images ADD COLUMN size int

 --Eliminar columna main de tabla images
 ALTER TABLE images DROP COLUMN main
--Añadir columna de  imagen destacada en tabla productos
ALTER TABLE products ADD COLUMN featured_image_id int
 
ALTER TABLE products ADD CONSTRAINT product_image_featured_image_fkey foreign key (featured_image_id)
references images (id) match simple
on update no action on delete no action

 