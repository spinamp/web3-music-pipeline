update "processedTracks"
set "createdAtTime" = nv."createdAtTime"
from (values
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/It All Led Me Back To You', '2022-06-03T18:49:00.100Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Monday', '2022-06-03T18:49:00.099Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Gonna Make It', '2022-06-03T18:49:00.098Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Where Things Fall Apart', '2022-06-03T18:49:00.097Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Content', '2022-06-03T18:49:00.096Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Cocktail', '2022-06-03T18:49:00.095Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Lagrimas De Cielo', '2022-06-03T18:49:00.094Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Moviess', '2022-06-03T18:49:00.093Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Chaos', '2022-06-03T18:49:00.092Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Crash', '2022-06-03T18:49:00.091Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Struggle No More', '2022-06-03T18:49:00.090Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/In The Silence', '2022-06-03T18:49:00.089Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Six of Wands', '2022-06-03T18:49:00.088Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Mad Vision', '2022-06-03T18:49:00.087Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/PROViDE', '2022-06-03T18:49:00.086Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Walls', '2022-06-03T18:49:00.085Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Unravel Me', '2022-06-03T18:49:00.084Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Pull Me Under', '2022-06-03T18:49:00.083Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Everseen', '2022-06-03T18:49:00.082Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Immortalized', '2022-06-03T18:49:00.081Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Moonrise', '2022-06-03T18:49:00.080Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/.ETHY', '2022-06-03T18:49:00.079Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Walls to Fade', '2022-06-03T18:49:00.078Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Golden Apple', '2022-06-03T18:49:00.077Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Let It Fall', '2022-06-03T18:49:00.076Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Ruckus', '2022-06-03T18:49:00.075Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Honeybee', '2022-06-03T18:49:00.074Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/OuttaControl!', '2022-06-03T18:49:00.073Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/The Fire', '2022-06-03T18:49:00.072Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/iNVASiON ', '2022-06-03T18:49:00.071Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Enemies', '2022-06-03T18:49:00.070Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Bonsai', '2022-06-03T18:49:00.069Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Forget You', '2022-06-03T18:49:00.068Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/We''ve Been Here', '2022-06-03T18:49:00.067Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Here and Now', '2022-06-03T18:49:00.066Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Special', '2022-06-03T18:49:00.065Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Single Hater', '2022-06-03T18:49:00.064Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Part Time Internet Friends', '2022-06-03T18:49:00.063Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Falling', '2022-06-03T18:49:00.062Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Late Bloomer', '2022-06-03T18:49:00.061Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/I''m Alright', '2022-06-03T18:49:00.060Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/You', '2022-06-03T18:49:00.059Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/Oxytocin', '2022-06-03T18:49:00.058Z'::timestamp),
    ('ethereum/0x8427e46826a520b1264b55f31fcb5ddfdc31e349/FROLiC', '2022-06-03T18:49:00.057Z'::timestamp)) as nv (id, "createdAtTime")
where "processedTracks".id = nv.id;
