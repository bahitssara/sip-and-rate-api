CREATE TABLE sip_rate_reviews (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    bev_type TEXT NOT NULL,
    bev_name TEXT NOT NULL,
    user_review TEXT NOT NULL,
    rating INTEGER,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    bev_id INTEGER
        REFERENCES sip_rate_beverages(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES sip_rate_users(id) ON DELETE CASCADE NOT NULL
)