module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://sara_mayberry@localhost/sip_and_rate',
    CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 3000,
}