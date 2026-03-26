create table if not exists Game(
    id serial unique not null primary key,
    totalClicks integer not null check(totalClicks >= 0),
    clickDamage integer not null check(clickDamage > 0)
);

create table if not exists UpgradeADD(
    name varchar(255) unique not null primary key,
    cost integer not null check (cost > 0),
    effect integer not null check (effect > 0),
    game_id serial not null,
    --when the game is deleted upgradeadd will be deleted too
    foreign key(game_id) references Game(id) on delete Cascade
);

create table if not exists UpgradeMULT(
    name varchar(255) unique not null primary key,
    cost integer not null check (cost > 0),
    multFactor integer not null check (multFactor > 1),
    game_id serial not null,
    --when the game is deleted upgrademult will be deleted too
    foreign key(game_id) references Game(id) on delete Cascade
);

--insert into Game(id, totalClicks, clickDamage) values(0,0,1) on conflict (id) do nothing;

--insert into UpgradeADD(name,cost,effect,game_id) values('Rolling pin', 20, 10, 0) on conflict (name) do nothing;

--insert into UpgradeMULT(name,cost,multFactor,game_id) values('Candy worker', 100, 2, 0) on conflict (name) do nothing;