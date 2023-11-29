create table task
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    description text not null
);
