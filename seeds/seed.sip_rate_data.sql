TRUNCATE sip_rate_users, sip_rate_beverages, sip_rate_reviews RESTART IDENTITY CASCADE;

INSERT INTO sip_rate_users (first_name, last_name, email, password, date_created, date_modified, user_name)
    VALUES 
    ('Unicorn','Lover','unicornsarecool@email.com','unicornlover','1/2/2018', 'Unicorn123'),
    ('Wombat','Lover','wombatssarecool@email.com','wombatlover','1/2/2018', 'Wombat123'),
    ('Koala','Lover','koalasarecool@email.com','koalalover','1/2/2018', 'Koala123'),
    ('Dragon','Lover','dragonssarecool@email.com','dragonlover','1/2/2018', 'Dragon123');

INSERT INTO sip_rate_beverages (bev_type, bev_name, description, overall_rating)
    VALUES
    ('wine','Pinot Grigio','A white wine',5),
    ('beer','Coors Light','A light beer',1)

