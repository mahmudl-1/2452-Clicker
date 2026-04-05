drop table BasicBuilding;
drop table AdvancedBuilding; 
drop table UpgradeADD;
drop table upgrademult;
drop table game;
drop table Player;

create table if not exists Player(
    username varchar(255) unique not null,
    password varchar(255) not null
);

create table if not exists Game(
    id serial unique not null,
    totalClicks integer not null,
    clickDamage integer not null,
    player_username varchar(255) not null,
    foreign key (player_username) references Player(username) on delete Cascade
);

create table if not exists UpgradeADD(
    name varchar(255) unique not null,
    description varchar(255),
    cost integer not null,
    effect integer not null,
    game_id integer not null,
    --when the game is deleted upgradeadd will be deleted too
    foreign key(game_id) references Game(id) on delete Cascade
);

create table if not exists UpgradeMULT(
    name varchar(255) unique not null,
    description varchar(255),
    cost integer not null,
    multFactor integer not null,
    game_id integer not null,
    --when the game is deleted upgrademult will be deleted too
    foreign key(game_id) references Game(id) on delete Cascade
);

create table if not exists BasicBuilding(
    name varchar(255) unique not null,
    description varchar(255),
    cost integer not null,
    clicksPerSecond integer not null,
    game_id integer not null,
    foreign key(game_id) references Game(id) on delete Cascade
);

create table if not exists AdvancedBuilding(
    name varchar(255) unique not null,
    description varchar(255),
    cost integer not null,
    clicksPerSecond integer not null,
    game_id integer not null,
    foreign key(game_id) references Game(id) on delete Cascade
);