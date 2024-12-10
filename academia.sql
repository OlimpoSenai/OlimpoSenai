create database academia; 
use academia;

create table usuario( 
id int primary key auto_increment not null, 
nome varchar(50) not null, email varchar(50) 
not null, cpf char(11) not null, 
senha varchar(255) not null 
);
 
create table funcionario(
 
id int primary key auto_increment not null, 
nome varchar(50) not null, 
email varchar(50) not null, 
cpf char(11) not null, 
senha varchar(255) not null ); 

create table adm(
id int primary key auto_increment not null,
nome varchar(50) not null,
email varchar(50) not null,
cpf char(11) not null,
senha varchar(255) not null 
);
 
 
 CREATE TABLE recuperacao_senha ( 
id INT AUTO_INCREMENT PRIMARY KEY,
usuario_id INT NOT NULL,
token VARCHAR(255) NOT NULL,
expiracao TIMESTAMP NOT NULL,
FOREIGN KEY (usuario_id) REFERENCES usuario(id) 
); 

CREATE TABLE treinos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  nome VARCHAR(255),
  descricao TEXT,
  data DATE,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) -- assuming you have a 'usuario' table
);

select * from usuario;
select * from funcionario;

/*altere usando isso se der erro de cpf ou outro */
ALTER TABLE usuario ADD COLUMN codigo_recuperacao VARCHAR(255);
ALTER TABLE funcionario MODIFY COLUMN cpf VARCHAR(14);
ALTER TABLE usuario MODIFY COLUMN cpf VARCHAR(14);

