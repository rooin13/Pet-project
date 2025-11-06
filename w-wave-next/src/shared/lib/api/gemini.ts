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
    // используем gemini-1.5-pro - стабильная модель
    const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Analyze user's music taste from liked tracks
    const genres = likedTracks.map(t => t.genre).filter(Boolean);
    const artists = likedTracks.map(t => t.artist);
    const hasFonk = likedTracks.some(t =>
        t.title?.toLowerCase().includes('phonk') ||
        t.genre?.toLowerCase().includes('phonk') ||
        t.artist?.toLowerCase().includes('shadowraze')
    );
    const hasDnB = likedTracks.some(t =>
        t.genre?.toLowerCase().includes('drum') ||
        t.genre?.toLowerCase().includes('dnb')
    );
    const hasAnime = likedTracks.some(t =>
        t.genre?.toLowerCase().includes('anime') ||
        t.genre?.toLowerCase().includes('j-pop') ||
        t.genre?.toLowerCase().includes('j-rock')
    );

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
2. ANALYZE USER'S TASTE! If NO drum&bass in likes → DON'T suggest dnb!
3. If explicit genre command ("ФОНК плейлист") → ONLY that genre
4. If "NO X" or "без Y" → ABSOLUTELY EXCLUDE IT
5. Understand slang, memes, pop culture, ANY language
6. Suggest ONLY real songs on Spotify

EXAMPLES (learn ALL the vibes!):

GYM / WORKOUT:
"плейлист для зала" (NO dnb/phonk in likes) → hip-hop, rock, NO random genres
"плейлист для зала" (HAS phonk) → phonk + aggressive rap
"качалка без eye of the tiger" → modern gym tracks, NO cliché
"кардио тренировка" → high BPM electronic, running music

GAMING:
"для игры в доту" (NO phonk) → dota rap, epic, NO phonk
"для игры в доту" (HAS phonk) → dota rap + phonk
"катать в кс" → aggressive rap, hard bass
"майнкрафт билдить" → chill lo-fi, calm vibes
"рейдить в wow" → epic orchestral, power metal

RUSSIAN CULTURE:
"face 2017" → Face (rapper) tracks from 2017 era (Юморист, Бургер)
"оксимирон батлы" → Russian battle rap, Oxxxymiron
"але это пакистан" → stoner/chill rap (АК-47, Триагрутрика, Джарахов)
"треш на вписку" → Russian trap (Pharaoh, Boulevard Depo, GONE.Fludd)
"грустить под слава кпсс" → депрессивный рэп (Слава КПСС, Хаски)
"едем в питер" → питерский рэп (Оксимирон, Гнойный)

MEMES / SLANG:
"бум бум бум бэм" → hard techno, hardstyle, HEAVY bass
"анимешники го в друзья" → j-pop, j-rock, anime openings (LiSA, Yoasobi)
"ГОВНО" → punk rock, underground, chaotic energy (but QUALITY)
"ахуенная музыка" → top-tier tracks from any genre
"кринж" → ironically bad music OR anti-mainstream

SPECIFIC ARTISTS / ERAS:
"face 2017" → Face 2016-2017 era (Юморист, Бургер, etc)
"the weeknd 2020" → The Weeknd After Hours era
"travis scott astroworld" → Travis Scott 2018 Astroworld tracks
"drake ничего личного" → Drake Nothing Was The Same era

VIBES / SITUATIONS:
"грустить в 3 ночи" → sad rap, emo, indie (Lil Peep, XXXTentacion)
"рейв до утра" → hard techno, psytrance, 140+ BPM
"в машину погонять" → bass-heavy phonk/hip-hop
"романтика с девушкой" → R&B, soul, romantic
"плейлист для программирования" → lo-fi, ambient, focus music
"утро, кофе, дождь" → indie, acoustic, calm
"пятница, бар, виски" → jazz, blues, smooth
"поездка на море" → summer hits, feel-good pop

MOOD-BASED:
"счастливый" → upbeat pop, feel-good
"злой" → aggressive rap, metal
"спокойный" → ambient, classical, lo-fi
"энергичный" → EDM, drum&bass, hardstyle

FAMOUS TRACKS (recognize & match vibe):
"summertime sadness" → Lana Del Rey vibe → dream pop, melancholic (Lorde, Sky Ferreira)
"magnolia" → Playboi Carti vibe → aggressive trap (Yeat, Ken Carson, Destroy Lonely)
"no church in the wild" → Jay-Z/Kanye Watch The Throne → experimental hip-hop, dark, epic
"take me back to november" → Tyler "November" lyric → melancholic R&B/hip-hop (Frank Ocean, Earl Sweatshirt)
"i seen the butcher" → Deftones "Knife Party" lyric → heavy alt-metal, shoegaze
"тик ток 2019" → viral 2019 (Old Town Road, Truth Hurts, Sucker, Roxanne)
"тик ток 2024" → viral 2024 (Whatever, Greedy, Paint The Town Red)

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

IMPORTANT: Match user's ACTUAL taste from liked tracks! Don't force genres they don't like!

Return ONLY valid JSON (no markdown, no code blocks, no backticks):
{
  "reasoning": "короткий живой ответ в стиле 'Вот тебе [жанр/вайб]! Ощути [эмоция/атмосфера]!' БЕЗ 'based on your request' - просто суть и энергия! 1-2 предложения макс.",
  "suggestedTracks": [
    { "title": "exact song name", "artist": "exact artist name" }
  ]
}

ПРИМЕРЫ REASONING:
"панк рока хочу" → "Вот тебе чистый панк-рок! Ощути бунтарскую энергию и драйв 90-х! 🎸"
"грустить в 3 ночи" → "Держи меланхоличный sad rap. Почувствуй эту боль и одиночество. 🌙"
"для зала качаться" → "Вот агрессивный рэп для зала! Рви железо под этот вайб! 💪"
"anime openings" → "Топовые аниме опенинги! Заряжайся эпичностью японской культуры! ⚡"
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
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
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

