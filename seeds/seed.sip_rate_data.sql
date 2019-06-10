TRUNCATE sip_rate_users, sip_rate_beverages, sip_rate_reviews RESTART IDENTITY CASCADE;

INSERT INTO sip_rate_users (first_name, last_name, email, password, date_created, user_name)
    VALUES 
    ('Unicorn','Lover','unicornsarecool@email.com','unicornlover','1/2/2018', 'Unicorn123'),
    ('Wombat','Lover','wombatssarecool@email.com','wombatlover','1/2/2018', 'Wombat123'),
    ('Koala','Lover','koalasarecool@email.com','koalalover','1/2/2018', 'Koala123'),
    ('Dragon','Lover','dragonssarecool@email.com','dragonlover','1/2/2018', 'Dragon123');

INSERT INTO sip_rate_beverages (bev_type, bev_name, description, overall_rating)
    VALUES
    ('wine','Pinot Grigio','A white wine', 5),
    ('beer','Coors Light','A light beer', 1),
    ('wine','Cabernet Sauvignon', 'A red wine', 4),
    ('beer', 'Milk Stout', 'A dark beer', 3);

INSERT INTO sip_rate_reviews (bev_type, bev_name, user_review, rating, bev_id, user_id)
    VALUES
    ('wine','Pinot Grigio','This wine was delicious! Would have it again','5','1','1'),
    ('beer','Coors Light','This beer was not good! Would not have it again','1','2','2'),
    ('wine','Cabernet Sauvignon','This wine was wonderful! Would have it again','4','3','3'),
    ('beer','Milk Stout','This beer was very good! Would have it again','3','4','4');



