CREATE TABLE polaroids (
    id SERIAL PRIMARY KEY,
    alt TEXT NOT NULL,
    image TEXT NOT NULL,
    caption TEXT NOT NULL,
    scanned BOOLEAN NOT NULL DEFAULT FALSE,
    scanned_at TIMESTAMP
)

CREATE TABLE music {
    id SERIAL PRIMARY KEY,
    audio_src TEXT,
    thumbnail TEXT,
    music_title TEXT,
    music_artist TEXT
}