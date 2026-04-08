
--updated and added the salt for hashing
create table if not exists Player(
    username varchar(255) unique not null,
    password varchar(255) not null,
    salt varchar(255) not null unique
);

create table if not exists Game(
    id serial unique not null,
    totalClicks integer not null,
    clickDamage integer not null,
    player_username varchar(255) not null,
    foreign key (player_username) references Player(username) on delete Cascade
);

--name uniqueness removed for using as array for inventory for the PURCHASABLES
create table if not exists UpgradeADD(
    name varchar(255) not null,
    description varchar(255),
    cost integer not null,
    effect integer not null,
    game_id integer not null,
    foreign key(game_id) references Game(id) on delete Cascade
);

create table if not exists UpgradeMULT(
    name varchar(255) not null,
    description varchar(255),
    cost integer not null,
    multFactor integer not null,
    game_id integer not null,
    foreign key(game_id) references Game(id) on delete Cascade
);

create table if not exists BasicBuilding(
    name varchar(255) not null,
    description varchar(255),
    cost integer not null,
    clicksPerSecond integer not null,
    game_id integer not null,
    foreign key(game_id) references Game(id) on delete Cascade
);

create table if not exists AdvancedBuilding(
    name varchar(255) not null,
    description varchar(255),
    cost integer not null,
    clicksPerSecond integer not null,
    game_id integer not null,
    foreign key(game_id) references Game(id) on delete Cascade
);

--A predefined catalog that holds all the upgrades
create table if not exists catalog(
    name varchar(255) unique not null,
    item_type varchar(255),
    description varchar(255),
    cost integer not null,
    effect_value integer
);

insert into catalog (name, item_type, description, cost, effect_value) values
('Rolling pin', 'UpgradeADD', 'Ancient bakers swore by this. It might look simple, but its the secret to perfectly thin, crispy candies. +10 clicks', 50, 10),
('Candy worker', 'UpgradeMULT', 'Trained in the art of rapid confectionery, this worker doubles your manual effort with professional precision.', 100, 2),
('Candy store', 'BasicBuilding', 'The bells are chiming and the shelves are stocked! A constant stream of customers means a steady flow of clicks every second. +1 autoClick', 300, 1),
('Candy Factory', 'AdvanceBuilding', 'A massive industrial complex dedicated to high-speed confectionery production. Steam-powered vats and conveyor belts ensure the sugar never stops moving. +10 autoClicks', 500, 10) 
on conflict(name) do nothing;