create database if not exists skarbonka; 

use skarbonka;

create table transactions
(
  transaction_id int primary key auto_increment,
  transaction_date date,
  transaction_value decimal(65,2),
  transaction_type enum('income', 'expense'),
  category_id smallint
);

create table categories 
(
  category_id smallint primary key auto_increment, 
  category_name varchar(32)
);

alter table transactions add foreign key (category_id) references categories(category_id);

insert into categories (category_name) values 
('food'),
('clothes'),
('bills'),
('recreation'),
('gifts'),
('salary'),
('other');

insert into transactions (transaction_date, transaction_value, transaction_type, category_id) values 
('2024-10-26', 12.50, 'expense', 1),
('2024-10-26', 12.50, 'expense', 1),
('2024-10-27', 45.00, 'expense', 2),
('2024-10-28', 75.00, 'expense', 3),
('2024-10-29', 30.00, 'expense', 4),
('2024-10-30', 20.00, 'expense', 5),
('2024-10-31', 500.00, 'income', 6),
('2024-11-01', 15.00, 'expense', 7),
('2024-11-02', 25.00, 'expense', 1),
('2024-11-03', 60.00, 'expense', 2),
('2024-11-04', 80.00, 'expense', 3),
('2024-11-05', 50.00, 'expense', 4),
('2024-11-06', 30.00, 'expense', 5),
('2024-11-07', 1000.00, 'income', 6),
('2024-11-08', 10.00, 'expense', 7); 