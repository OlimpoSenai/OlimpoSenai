create database academia;
use academia;

create table usuario(
id int primary key auto_increment not null,
nome varchar(50) not null,
email varchar(50) not null,
cpf char(11) not null,
senha varchar(255) not null
);

create table funcionario(
id int primary key auto_increment not null,
nome varchar(50) not null,
email varchar(50) not null,
cpf char(11) not null,
senha varchar(255) not null
);

create table adm(
id int primary key auto_increment not null,
nome varchar(50) not null,
email varchar(50) not null,
cpf char(11) not null,
senha varchar(255) not null
);

select * from usuario;
ALTER TABLE usuario MODIFY COLUMN cpf VARCHAR(14);