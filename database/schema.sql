-- Database creation script


-- Drop foreign keys
alter table CustomerOrder drop constraint if exists "FK_CustomerOrder_customerId"
alter table CustomerOrder_Item drop constraint if exists "FK_CustomerOrder_Item_itemId"
alter table CustomerOrder_Item drop constraint if exists "FK_CustomerOrder_Item_orderId"
-- Drop primary keys
alter table Customer drop constraint if exists "PK_Customer_id"
alter table CustomerOrder drop constraint if exists "PK_CustomerOrder_id"
alter table Item drop constraint if exists "PK_Item_id"
alter table CustomerOrder_Item drop constraint if exists "PK_CustomerOrder_Item_itemId_orderId"


drop table if exists waterwall.dbo.Customer go
create table waterwall.dbo.Customer (
	id int identity(1,1) not null,
	firstName nvarchar(64) null,
  lastName nvarchar(64) null,
	createdAt datetimeoffset not null default SYSDATETIMEOFFSET(),
	updatedAt datetimeoffset not null default SYSDATETIMEOFFSET(),
	constraint PK_Customer_id primary key (id)
) go


drop table if exists waterwall.dbo.CustomerOrder go
create table waterwall.dbo.CustomerOrder (
	id int identity(1,1) not null,
  orderDate datetimeoffset not null,
  customerId int,
	createdAt datetimeoffset not null default SYSDATETIMEOFFSET(),
	constraint PK_CustomerOrder_id primary key (id),
  constraint FK_CustomerOrder_customerId foreign key (customerId) references waterwall.dbo.Customer(id) on delete set null
) go


drop table if exists waterwall.dbo.Item go
create table waterwall.dbo.Item (
  id int identity(1,1) not null,
  title nvarchar(128) not null,
  cost decimal(10,2) not null,
  constraint PK_Item_id primary key (id),
) go


drop table if exists waterwall.dbo.CustomerOrder_Item go
create table waterwall.dbo.CustomerOrder_Item (
  id int identity(1,1) not null,
  itemId int not null,
  orderId int not null,
	quantity int not null,
	extendedCost decimal(10,2) not null,
  constraint PK_CustomerOrder_Item_itemId_orderId primary key (itemId, orderId),
  constraint FK_CustomerOrder_Item_itemId foreign key (itemId) references waterwall.dbo.Item(id),
  constraint FK_CustomerOrder_Item_orderId foreign key (orderId) references waterwall.dbo.CustomerOrder(id)
) go


insert into Customer(firstName, lastName) values 
('Adam', 'VanWingerden'),
('Stephen', 'VanWingerden'),
('Kevin', 'Short'),
('Steve', 'Sloan'),
('Caelan', 'Daniel'),
('Scott', 'Slattery'),
('Cody', 'Weber'),
('Hayden', 'Nesbit');



insert into Item(title, cost) values
('Milk', 3.69),
('Bread', 2.29),
('Eggs', 1.89),
('Carrots', 2.09),
('Cinnamon', 1.49),
('Deli Ham', 3.45),
('Cheddar Cheese', 2.49),
('Ketchup', 1.99),
('Pasta', 1.29),
('Salt', 1.10),
('Popcorn', 1.69),
('Celery', 1.99),
('Tomato', 1.09),
('Vanilla', 3.49),
('Mayo', 1.89),
('Nutmeg', 2.29),
('Steak', 13.49),
('Peanut Butter', 3.69),
('Butter', 2.99),
('Rice', 1.49),
('Garlic', 1.79),
('Ice', 0.99),
('Paprika', 1.29),
('Lemons', 1.89),
('Apples', 2.49),
('Corn', 1.69),
('Quinoa', 1.99),
('Lettuce', 1.49),
('Crackers', 1.39),
('Cheerios', 2.69),
('Oreos', 2.49),
('Chicken', 5.49),
('Beef', 4.49),
('Sour Cream', 2.09),
('Yogurt', 2.49),
('Flour Tortillas', 1.99),
('Wine', 11.99),
('Beer', 8.99)
