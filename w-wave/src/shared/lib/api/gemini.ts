import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

// initialize gemini client
export function getGeminiClient() {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in environment variables");
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

// generate ai playlist suggestions based on user's liked tracks
export async function generatePlaylistSuggestions(
    userPrompt: string,
    likedTracks: { title: string; artist: string; genre?: string }[]
) {
    const client = getGeminiClient();
    // используем gemini-2.0-flash-exp - последняя экспериментальная модель (бесплатная)
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Analyze user's music taste from liked tracks
    const genres = likedTracks.map((track) => track.genre).filter(Boolean);

    const likedTracksContext = likedTracks.length > 0
        ? `User's liked tracks (analyze their taste!):\n${likedTracks.map((t) => `- "${t.title}" by ${t.artist}${t.genre ? ` (${t.genre})` : ""}`).join("\n")}\n\nDetected preferences: ${genres.length > 0 ? genres.join(', ') : 'mixed'}`
        : "User has no liked tracks yet - suggest popular/trending tracks based on request.";

    const prompt = `
You are a music expert AI with DEEP knowledge of ALL music: genres, artists, eras, vibes, memes, slang, cultures.

${likedTracksContext}

User request: "${userPrompt}"

CRITICAL RULES:
1. FIRST: Is request a FAMOUS SONG TITLE or ICONIC LYRIC? 
   - "summertime sadness" → YES! Lana Del Rey track → dream pop vibe
   - "magnolia" → YES! Playboi Carti track → aggressive trap vibe
   - "no church in the wild" → YES! Jay-Z/Kanye → dark experimental hip-hop
   - "take me back to november" → YES! Tyler lyric → melancholic R&B vibe
   - "ur love" → NO, just generic words → interpret as theme
   - "u get me so high" → NO, not iconic → interpret as theme
   - "november" → NO, just a month → autumn vibes
   - "church" → NO, just a word → spiritual music
2. 🚨 PRIORITY: USER REQUEST > LIKED TRACKS! 
   - "хеви метал" (user has only old hip-hop) → Give HEAVY METAL! Maybe add 1-2 crossover (Linkin Park, Rage Against The Machine)
   - Liked tracks = REFERENCE, not LIMITATION
   - Can add transitional tracks that bridge user's taste + request
3. If explicit genre command ("ФОНК плейлист") → ONLY that genre (+ similar subgenres)
4. 🚨 CRITICAL: If "NO X" / "без Y" / "но без Z" → ABSOLUTELY EXCLUDE that artist/genre! 
   - "психодел но без tame impala" → NO Tame Impala at all! 0 tracks!
   - "рок без металики" → NO Metallica!
   - Check EVERY track before adding!
5. Understand slang, memes, pop culture, ANY language
6. Suggest ONLY real songs on Spotify

EXAMPLES (learn ALL the vibes!):

GYM / WORKOUT:
"плейлист для зала" (NO dnb/phonk in likes) → hip-hop, rock, NO random genres
"плейлист для зала" (HAS phonk) → phonk + aggressive rap
"качалка без eye of the tiger" → modern gym tracks, NO cliché
"кардио тренировка" → high BPM electronic, running music

PRIORITY EXAMPLES (REQUEST > LIKES):
"хеви метал" (has old hip-hop likes) → 16-18 heavy metal tracks + 2-4 nu-metal/rap-metal bridge (Linkin Park, Limp Bizkit)
"джаз" (has trap likes) → 18+ jazz tracks + maybe 1-2 jazz hop bridge (Nujabes, J Dilla)
"классика" (has rock likes) → 17+ classical + maybe 2-3 symphonic rock/metal bridge (Metallica S&M, Apocalyptica)
"опиум" (has indie likes) → 20 pure rage/opium style! Ignore indie completely - request is specific!
"техно" (has pop likes) → 19 techno + maybe 1 tech house bridge

GAMING:
"для игры в доту" (NO phonk) → dota rap, epic, NO phonk
"для игры в доту" (HAS phonk) → dota rap + phonk
"катать в кс" → aggressive rap, hard bass
"майнкрафт билдить" → chill lo-fi, calm vibes
"рейдить в wow" → epic orchestral, power metal

RUSSIAN HIP-HOP CULTURE:
"face 2017" → Face (rapper) tracks from 2017 era (Юморист, Бургер, Я Роняю Запад)
"оксимирон батлы" → Russian battle rap, Oxxxymiron (Кентервильское Привидение, Где нас нет)
"але это пакистан" → stoner/chill rap (АК-47, Триагрутрика, Джарахов, Miyagi & Andy Panda)
"треш на вписку" → Russian trap (Pharaoh, Boulevard Depo, GONE.Fludd, Scally Milano)
"грустить под слава кпсс" → депрессивный рэп (Слава КПСС, Хаски, Замай)
"едем в питер" → питерский рэп (Оксимирон, Гнойный, Замай)
"лоу фай русский" → Russian lo-fi/chill (Увула, PHARAOH chill tracks, Seemee)
"дрилл русский" / "рашн дрилл" → Russian drill (104, MiyaGi drill tracks, OG Buda drill)
"клауд рэп русский" → Russian cloud rap (OG Buda, White Punk, Платина, Скриптонит calm tracks)

MEMES / SLANG:
"бум бум бум бэм" → hard techno, hardstyle, HEAVY bass
"анимешники го в друзья" → j-pop, j-rock, anime openings (LiSA, Yoasobi, Eve, Kenshi Yonezu)
"ГОВНО" → punk rock, underground, chaotic energy (but QUALITY)
"ахуенная музыка" → top-tier tracks from any genre
"кринж" → ironically bad music OR anti-mainstream
"музыка для гениев" → complex/experimental (Tool, Radiohead, Death Grips, JPEGMAFIA)
"грув" / "качает" → groovy, head-nodding (funk, g-funk, boom bap, nu-disco)
"басс" / "бас качает" → heavy bass music (dubstep, drum&bass, phonk, 808-heavy trap)
"хардкор движ" → hardcore (punk, metal, hardcore techno, hard bass)
"меланхолия" → melancholic indie, sad indie rock (Radiohead, Arcade Fire, Bon Iver)

SPECIFIC ARTISTS / ERAS:
"face 2017" → Face 2016-2017 era (Юморист, Бургер, etc)
"the weeknd 2020" → The Weeknd After Hours era
"travis scott astroworld" → Travis Scott 2018 Astroworld tracks
"drake ничего личного" → Drake Nothing Was The Same era

METAL SUBGENRES:
"хеви метал" / "тяжеляк" → heavy metal (Metallica, Iron Maiden, Black Sabbath, Judas Priest)
"дэт метал" → death metal (Death, Cannibal Corpse, Morbid Angel, Obituary)
"блэк метал" → black metal (Mayhem, Darkthrone, Emperor, Burzum)
"дум метал" → doom metal (Black Sabbath, Candlemass, Electric Wizard, Sleep)
"пауэр метал" → power metal (DragonForce, Helloween, Blind Guardian, Sabaton)
"металкор" → metalcore (Killswitch Engage, As I Lay Dying, Parkway Drive, Architects)
"ню метал" → nu-metal (Linkin Park, Limp Bizkit, Korn, Slipknot, System of a Down)
"трэш метал" → thrash metal (Metallica, Slayer, Megadeth, Anthrax)

ELECTRONIC SUBGENRES:
"техно" → techno (Carl Cox, Amelie Lens, Charlotte de Witte, Richie Hawtin)
"хаус" → house (Disclosure, Duke Dumont, Calvin Harris, Fisher)
"дип хаус" → deep house (Lane 8, Yotto, Boris Brejcha, Artbat)
"дабстэп" → dubstep (Skrillex, Excision, Subtronics, Virtual Riot)
"драм энд бейс" / "днб" → drum&bass (Netsky, Pendulum, Sub Focus, Wilkinson)
"транс" → trance (Armin van Buuren, Above & Beyond, Paul van Dyk, Ferry Corsten)
"амбиент" → ambient (Brian Eno, Aphex Twin, Boards of Canada, Tycho)
"брейкс" / "брейкбит" → breakbeat (The Prodigy, Pendulum, The Chemical Brothers)

JAZZ STYLES:
"джаз" → classic jazz (Miles Davis, John Coltrane, Thelonious Monk, Charlie Parker)
"джаз хоп" / "джазовый хип-хоп" → jazz hop (Nujabes, J Dilla, MF DOOM, Guru)
"смус джаз" → smooth jazz (Kenny G, George Benson, Grover Washington Jr.)
"джаз фьюжн" → jazz fusion (Weather Report, Return to Forever, Mahavishnu Orchestra)

VIBES / SITUATIONS:
"грустить в 3 ночи" → sad rap, emo, indie (Lil Peep, XXXTentacion, Juice WRLD)
"рейв до утра" → hard techno, psytrance, 140+ BPM
"в машину погонять" → bass-heavy phonk/hip-hop
"романтика с девушкой" → R&B, soul, romantic (The Weeknd, Frank Ocean, SZA)
"плейлист для программирования" → lo-fi, ambient, focus music
"утро, кофе, дождь" → indie, acoustic, calm (Bon Iver, Iron & Wine, Daughter)
"пятница, бар, виски" → jazz, blues, smooth
"поездка на море" → summer hits, feel-good pop
"курить на балконе" → chill indie, alternative (Mac DeMarco, Cigarettes After Sex)
"читать книгу" → classical, instrumental, ambient
"убираться дома" → upbeat pop, dance, feel-good

ROCK SUBGENRES:
🚨 CRITICAL: "рок" = ROCK MUSIC! NOT rap, NOT trap, NOT hip-hop! ONLY guitars, drums, bass!
"рок" → classic rock (Led Zeppelin, The Rolling Stones, Queen, AC/DC)
"панк рок" → punk rock (Green Day, The Offspring, Blink-182, Sum 41, Ramones)
"альт рок" / "альтернатива" → alternative rock (Nirvana, Radiohead, Foo Fighters, RHCP, The Killers)
"инди рок" → indie rock 🚨 NO RAP AT ALL! ONLY ROCK WITH GUITARS!
  → Arctic Monkeys (Do I Wanna Know, R U Mine, 505, Fluorescent Adolescent)
  → The Strokes (Last Nite, Reptilia, Someday, The Adults Are Talking)
  → Twenty One Pilots (Stressed Out, Ride, Heathens, Chlorine, Car Radio)
  → Vampire Weekend (A-Punk, Oxford Comma, Harmony Hall, This Life)
  → Franz Ferdinand (Take Me Out, Do You Want To, The Dark of the Matinee)
  → Two Door Cinema Club (What You Know, Something Good Can Work, Undercover Martyn)
  → The 1975 (Chocolate, Sex, Somebody Else, Love It If We Made It)
  → Alt-J (Breezeblocks, Left Hand Free, Tessellate)
  → Foster the People (Pumped Up Kicks, Sit Next to Me, Helena Beat)
  → MGMT (Electric Feel, Kids, Time to Pretend)
  → Phoenix (1901, Lisztomania, Too Young)
  → Cage the Elephant (Ain't No Rest for the Wicked, Cigarette Daydreams)
  ❌ NEVER: Future, Ken Carson, ANY trap/rap artists! This is ROCK genre!
"гранж" → grunge (Nirvana, Pearl Jam, Soundgarden, Alice in Chains)
"эмо" → emo rock (My Chemical Romance, Fall Out Boy, Panic! At The Disco, Paramore)
"пост панк" → post-punk (Joy Division, Interpol, Editors, The National)
"шугейз" / "шугейзинг" → shoegaze (My Bloody Valentine, Slowdive, Ride, Cocteau Twins)
"прогрессив рок" → progressive rock (Pink Floyd, Yes, King Crimson, Tool)

HIP-HOP SUBGENRES:
"олд скул" / "старая школа" → old school hip-hop (Run-DMC, Public Enemy, A Tribe Called Quest, Wu-Tang)
"бум бап" → boom bap (Nas, The Notorious B.I.G., Mobb Deep, Gang Starr)
"ги фанк" / "вест коаст" → g-funk/west coast (Dr. Dre, Snoop Dogg, Ice Cube, Warren G)
"трэп" → trap (Future, Migos, Travis Scott, 21 Savage)
"клауд рэп" → cloud rap (Yung Lean, Bladee, Ecco2k, Bones)
"эмо рэп" → emo rap (Lil Peep, XXXTentacion, Juice WRLD, Trippie Redd)
"дрилл" → drill (Pop Smoke, Chief Keef, King Von, Fivio Foreign)
"андеграунд" → underground hip-hop (MF DOOM, Earl Sweatshirt, JPEGMAFIA, Denzel Curry)

MOOD-BASED:
"счастливый" → upbeat pop, feel-good
"злой" → aggressive rap, metal
"спокойный" → ambient, classical, lo-fi
"энергичный" → EDM, drum&bass, hardstyle
"ностальгия" → 80s synthwave, 90s hits, nostalgic indie
"мотивация" → motivational hip-hop, rock anthems

FAMOUS TRACKS (recognize & match vibe):
"summertime sadness" → Lana Del Rey vibe → dream pop, melancholic (Lorde, Sky Ferreira)
"magnolia" → Playboi Carti vibe → aggressive trap (Yeat, Ken Carson, Destroy Lonely)
"no church in the wild" → Jay-Z/Kanye Watch The Throne → experimental hip-hop, dark, epic
"take me back to november" → Tyler "November" lyric → melancholic R&B/hip-hop (Frank Ocean, Earl Sweatshirt)
"i seen the butcher" → Deftones "Knife Party" lyric → heavy alt-metal, shoegaze
"тик ток 2019" → viral 2019 (Old Town Road, Truth Hurts, Sucker, Roxanne)
"тик ток 2024" → viral 2024 (Whatever, Greedy, Paint The Town Red)

RAGE / OPIUM STYLE (Playboi Carti underground rage beats):
🚨 CRITICAL: "опиум" / "opium" = VERY SPECIFIC STYLE! Not just "trap"!
MUST HAVE: Distorted 808s, screaming/aggressive vocals, dark production, rage energy, experimental beats

📊 POPULARITY LEVELS:
→ MAINSTREAM/HYPE (Ken Carson, Destroy Lonely, Yeat) - famous, millions of plays
→ UNDERGROUND (Sid Shyne, Kai Angel, Rich Amiri, 1oneam, Autumn!, etc) - less known, real underground

MAINSTREAM OPIUM ARTISTS (for "опиум"):
→ Playboi Carti (Stop Breathing, New Tank, Sky, Rockstar Made, Teen X, Jumpoutthehouse, Vamp Anthem)
→ Ken Carson (Yale, Rockstar Lifestyle, Fighting My Demons, Jennifer's Body, Lose It, It's Over)
→ Destroy Lonely (NOSTYLIST, If Looks Could Kill, FLYINGV, Bane, Came In Wit)
→ Yeat (Sorry Bout That, Turban, Out Thë Way, Gët Busy, Money Twërk, Poppin)
→ Trippie Redd rage tracks (Miss The Rage, MP5, BETRAYAL, Holy Smokes)
→ SoFaygo (Knock Knock, Off The Map, Everyday)

UNDERGROUND OPIUM ARTISTS (for "андеграунд опиум" / "underground opium"):
→ Sid Shyne (лидер андера!)
→ Kai Angel (русский андер rage)
→ Rich Amiri (underground rage)
→ 1oneam (deep cuts)
→ Autumn! (underground plugg)
→ Summrs (Isolation, Swear to God - less popular tracks)
→ Kankan (Project X, Take 3 - deep cuts)
→ Homixide Gang (Lifestyle, Twinnem - less known tracks)
→ Lancey Foux (INDIA, Life in Hell, DON DADA - deep cuts)
→ 9lokknine (underground Florida rage)
→ SSGKobe (underground melodic rage)
→ Xanman (underground DMV rage)

🚨 WRONG EXAMPLES (NOT OPIUM/RAGE) - CHECK BEFORE ADDING:
❌ Kacey Musgraves - это КАНТРИ! Вообще не рэп!
❌ Michael Jackson - это ПОП 80-90х! НЕ опиум, НЕ даже рэп!
❌ 21 Savage - обычный trap, НЕ rage/opium style! Too mainstream, not aggressive/distorted enough
❌ Future - regular trap, NOT rage style
❌ Migos - regular trap, NOT rage style
❌ Travis Scott (old tracks) - NOT rage style
❌ Drake - NOT rage at all
❌ Lil Baby - regular trap, NOT rage
❌ Gunna - melodic trap, NOT rage
❌ Young Thug - NOT rage style
❌ Chill trap - NOT aggressive enough
❌ Melodic rap - NOT distorted/aggressive enough
❌ Любой POP артист (Michael Jackson, Madonna, etc) - это НЕ РЭП вообще!

SPECIAL REQUESTS:
"опиум но без карти" → All artists EXCEPT Playboi Carti! Ken Carson, Destroy Lonely, Yeat, etc. ZERO Carti tracks!
"жесткий опиум" / "hardcore opium" / "андеграунд опиум" / "underground opium" / "ебнутый опиум но не попсовый" → 
  → 🚨 CRITICAL: This is MOST UNDERGROUND request!
  → AVOID: Ken Carson, Destroy Lonely (too famous now), 21 Savage, Future, любой поп!
  → ONLY: Sid Shyne, Kai Angel, Rich Amiri, 1oneam, Autumn!, SSGKobe, 9lokknine, Xanman
  → Deep cuts, unknown tracks, raw/experimental sound
  → If you don't know underground artist → DON'T add random mainstream trap!
"опиум" (generic) = Mix of mainstream + underground, all rage style
Check EVERY track - must be aggressive, distorted, experimental!
❌ If adding Michael Jackson, 21 Savage, Drake to opium playlist → YOU FAILED!

PSYCHEDELIC ROCK (психоделик рок / психодел):
"психодел" / "психоделик" / "психоделик рок" / "ебнутый психодел" → Psychedelic rock, trippy, experimental
→ CLASSIC: Pink Floyd (Comfortably Numb, Shine On You Crazy Diamond, Time, Echoes, Brain Damage)
→ CLASSIC: The Doors (Riders on the Storm, The End, Light My Fire)
→ CLASSIC: Jefferson Airplane (White Rabbit, Somebody to Love)
→ CLASSIC: Jimi Hendrix (Purple Haze, Voodoo Child, All Along the Watchtower)
→ CLASSIC: Grateful Dead (Dark Star, Truckin')
→ MODERN: Tame Impala (Let It Happen, Elephant, The Less I Know The Better)
→ MODERN: MGMT (Time to Pretend, Kids, Electric Feel)
→ MODERN: Temples (Shelter Song, Mesmerise)
→ MODERN: Pond (Sweep Me Off My Feet, Man It Feels Like Space Again)
→ MODERN: King Gizzard & The Lizard Wizard (Crumbling Castle, The River)
→ MODERN: Unknown Mortal Orchestra (Multi-Love, Necessary Evil)
→ MODERN: The Flaming Lips (Do You Realize??, Yoshimi Battles the Pink Robots)
PRIORITY: Classic psychedelic rock (Pink Floyd, Doors, Hendrix) should be MAJORITY unless request says "modern"
"но без tame impala" → EXCLUDE all Tame Impala tracks! Give more Pink Floyd, Doors, Hendrix instead!

SITUATIONAL / VIBES:
"плейлист для секса" (has Weeknd/R&B) → sensual R&B (Frank Ocean, Miguel, SZA)
"плейлист для секса" (has rock/Deftones) → sensual rock (Deftones, Cigarettes After Sex, Mazzy Star)
"плейлист для секса" (has phonk) → wtf? give them chill trap/R&B instead

NOT FAMOUS (interpret as theme):
"ur love" → generic love theme, romantic tracks
"u get me so high" → NOT iconic → theme about feeling high/euphoria
"november" → just autumn vibes, fall indie
"church" → spiritual/gospel music

KEY RULE: Only treat as SONG if it's ICONIC/FAMOUS enough that people instantly recognize it!

🚨 FINAL REMINDER - PRIORITY LOGIC:
1. USER REQUEST is PRIMARY! If they ask "heavy metal" → give heavy metal!
2. Liked tracks = REFERENCE for style/era within that genre, NOT a genre constraint
3. Can add 1-4 "bridge" tracks that connect user's taste with requested genre
4. If request is SPECIFIC genre/artist → 95% match request, 5% bridge
5. If request is VIBE/MOOD → use liked tracks to inform style choices

EXAMPLE BREAKDOWN:
Request: "опиум" | Likes: indie, pop
→ Result: 18-20 rage/opium tracks (Carti, Ken Carson, Yeat) + maybe 0-2 experimental trap that could appeal to indie fans

Request: "грустить" | Likes: heavy metal  
→ Result: sad music in metal style (doom metal, gothic metal, ballads) - use likes to INFORM style, not restrict genre

Request: "для зала" | Likes: jazz
→ Result: 15 energetic gym music (rock, rap) + 3-5 high-energy jazz fusion bridge (Snarky Puppy, Kamasi Washington)

🚨 FINAL VALIDATION BEFORE RETURNING (CHECK EVERY TRACK!):
1. 🔴🔴🔴 NO DUPLICATES - MOST CRITICAL! 🔴🔴🔴
   - Check EVERY track title + artist combination
   - Same song appearing TWICE = FAILED! REJECTED! START OVER!
   - "Stressed Out" by Twenty One Pilots can appear ONLY ONCE!
   - Go through list: track 1, track 2, track 3... - each must be UNIQUE!
   - If you see duplicate → REMOVE IT and add different track!
   
2. Check request for exclusions ("но без", "без", "no") - REMOVE those artists/songs!

3. 🔴 GENRE VALIDATION - CRITICAL:
   - "инди рок" / "рок" → ONLY rock bands! NO rap (Future, Ken Carson)! Must have guitars!
   - "опиум" / "trap" → ONLY rap/trap! NO rock bands! NO pop (Michael Jackson)!
   - "джаз" → ONLY jazz! NO rock, NO rap!
   - If genre mismatch → REJECT and find correct tracks!
   
4. 🔴 ARTIST NAME VALIDATION:
   - "Kai Angel" ≠ "Kai The Angel" ≠ "Angel Kai" - use EXACT Spotify name!
   - "Underworld" (electronic duo) ≠ opium/rage! Verify genre match!
   - Check artist actually exists and makes this genre
   
5. For specific styles (опиум, психодел, инди рок) - verify EVERY track is authentic

6. Count: EXACTLY 20 UNIQUE tracks, no more, no less

7. Double-check: does this playlist match the request? If not → REDO!

Return ONLY valid JSON with EXACTLY 20 tracks (no markdown, no code blocks, no backticks):
{
  "reasoning": "короткий живой ответ в стиле 'Вот тебе [жанр/вайб]! Ощути [эмоция/атмосфера]!' БЕЗ 'based on your request' - просто суть и энергия! 1-2 предложения макс.",
  "suggestedTracks": [
    { "title": "exact song name", "artist": "exact artist name" }
    // ... EXACTLY 20 tracks total
  ]
}

ПРИМЕРЫ REASONING:
"панк рока хочу" → "Вот тебе чистый панк-рок! Ощути бунтарскую энергию и драйв 90-х! 🎸"
"грустить в 3 ночи" → "Держи меланхоличный sad rap. Почувствуй эту боль и одиночество. 🌙"
"для зала качаться" → "Вот агрессивный рэп для зала! Рви железо под этот вайб! 💪"
"anime openings" → "Топовые аниме опенинги! Заряжайся эпичностью японской культуры! ⚡"
"ебнутый психодел но без tame impala" → "Вот тебе классический психоделик рок! Pink Floyd, Doors, Hendrix - погружайся в трип! 🌀"
"опиум" → "Держи чистый rage/opium стиль! Playboi Carti, Ken Carson, Destroy Lonely - ощути агрессию и дисторшн! 🔥"
"ебнутый опиум но без карти" → "Держи rage стиль без Карти! Ken Carson, Destroy Lonely, Yeat - чистая агрессия! 🔥"
"инди рок" → "Вот тебе инди-рок! Arctic Monkeys, Twenty One Pilots, The Strokes - ощути драйв гитарного рока! 🎸"
"андеграунд опиум" → "Держи андеграунд rage! Sid Shyne, Kai Angel, Rich Amiri - настоящий андер! 🔥"
`.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // parse json response
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        const parsed = JSON.parse(jsonMatch[0]);

        // 🔴 CRITICAL: Remove duplicates (double protection)
        const seen = new Set<string>();
        const uniqueTracks = parsed.suggestedTracks.filter((track: { title: string; artist: string }) => {
            const key = `${track.title.toLowerCase()}::${track.artist.toLowerCase()}`;
            if (seen.has(key)) {
                console.warn(`⚠️ Duplicate track removed: "${track.title}" by ${track.artist}`);
                return false;
            }
            seen.add(key);
            return true;
        });

        console.log(`✅ Unique tracks: ${uniqueTracks.length}/${parsed.suggestedTracks.length}`);

        return {
            ...parsed,
            suggestedTracks: uniqueTracks
        };
    } catch {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Failed to parse AI response");
    }
}

export type GeminiPlaylistResponse = {
    reasoning: string;
    suggestedTracks: Array<{
        title: string;
        artist: string;
    }>;
};

