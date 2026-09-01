// -----------------------------------------------------------------------------
// Configuración curada de las campañas.
//
// Las SESIONES se importan automáticamente del vault de Obsidian (ver
// scripts/import-obsidian.mjs). Lo de aquí es lo editorial: qué campañas
// existen, cómo se agrupan las sesiones en arcos, y las fichas de personajes y
// de mundo. Edita este archivo y vuelve a lanzar `npm run import`.
// -----------------------------------------------------------------------------

// Todas las campañas del selector. `vault` es la carpeta dentro de
// `Historias/`; si es null, la campaña sale como "sin notas todavía".
export const campaigns = [
  {
    id: 'oro-sobre-plata',
    name: 'Oro sobre Plata',
    subtitle: 'D&D 5e · Faerûn',
    party: 'La Compañía del Oso',
    hashtag: 'OroSobrePlata',
    vault: 'Oro sobre Plata',
    footer: { line1: 'Nivel ~10 · rumbo al Anauroch' },
    intro:
      'Una crónica de dragones, no muertos e intrigas del norte de Faerûn. Más de noventa sesiones de un grupo que carga con fragmentos del Orbe dracónico y una deuda con Orcus.',
    heroKicker: 'La Compañía del Oso',
  },
  {
    id: 'strahd',
    name: 'Curse of Strahd',
    subtitle: 'D&D 5e · Barovia',
    party: 'El grupo',
    hashtag: 'CurseOfStrahd',
    vault: 'Curse of Strahd',
    footer: { line1: 'Terror gótico en Barovia' },
    intro:
      'Atrapados tras las brumas de Barovia, un grupo se enfrenta al vampiro Strahd von Zarovich. Terror gótico, tarot y viejas maldiciones.',
    heroKicker: 'Crónica de Barovia',
  },
  {
    id: 'saltmarsh',
    name: 'Fantasmas sobre Saltmarsh',
    subtitle: 'D&D 5e · Saltmarsh',
    party: 'El grupo',
    hashtag: 'FantasmasSobreSaltmarsh',
    vault: 'Fantasmas sobre Saltmarsh',
    footer: { line1: 'Contrabando y cultos marinos' },
    intro:
      'Contrabando, cultos marinos y presagios en el pueblo costero de Saltmarsh. Un grupo tira del hilo de la Sal Roja y del Fantasma del Mar.',
    heroKicker: 'Crónica de Saltmarsh',
  },
  {
    id: 'brujaluz',
    name: 'Brujaluz',
    subtitle: 'D&D 5e · Reino Feérico',
    party: 'La Hermandad de los Ecos Perdidos',
    hashtag: 'LasTierrasMasAllaDeBrujaluz',
    vault: 'The Wild Beyond Witchlight',
    footer: { line1: 'Guerra de guerrillas contra Skabatha' },
    intro:
      'Una feria mágica abre la puerta a Allende, el Reino Feérico. La Hermandad de los Ecos Perdidos rescata a los niños perdidos y planta cara a las brujas del bosque.',
    heroKicker: 'La Hermandad de los Ecos Perdidos',
  },
  {
    id: 'guardalumbre',
    name: 'Misterios de Guardalumbre',
    subtitle: 'D&D 5e · Guardalumbre',
    party: 'Los ojos de la Gorgona',
    hashtag: 'MisteriosDeGuardalumbre',
    vault: 'Guardalumbre',
    intro:
      'El brazo armado de la ciudad-biblioteca de Guardalumbre. Mercenarios al servicio de Los Ilustrados, metidos en una extraña investigación interna.',
    heroKicker: 'Los ojos de la Gorgona',
  },
  {
    id: 'librorojo',
    name: 'La conspiración del libro rojo',
    subtitle: 'D&D 5e',
    party: 'El grupo',
    hashtag: 'LaConspiracionDelLibroRojo',
    vault: 'La conspiración del libro rojo',
    intro: 'Una conspiración se teje alrededor de un libro rojo.',
    heroKicker: 'Crónica de campaña',
  },

  // --- One-shots (partidas cortas que juega la autora) ---
  {
    id: 'verdia',
    name: 'Verdia',
    subtitle: 'D&D 5e · One-shot',
    hashtag: 'Verdia',
    vault: 'Oneshots/Verdia',
    group: 'oneshot',
    intro: 'One-shots de D&D 5e ambientados en Verdia.',
    heroKicker: 'One-shot',
  },
  {
    id: 'la-tumba-del-rey-traidor',
    name: 'La Tumba del Rey Traidor',
    subtitle: 'D&D 5e · One-shot',
    hashtag: 'LaTumbaDelReyTraidor',
    vault: 'Oneshots/La Tumba del Rey Traidor',
    group: 'oneshot',
    intro: 'One-shot de D&D 5e: la Tumba del Rey Traidor.',
    heroKicker: 'One-shot',
  },

  // --- Ambientaciones que masteriza ---
  {
    id: 'strixhaven',
    name: 'Strixhaven',
    kicker: 'Ambientación',
    subtitle: 'D&D 5e · Arcavios',
    hashtag: 'Strixhaven',
    vault: 'Master/Strixhaven',
    group: 'master',
    intro:
      'La gran universidad de magia de Strixhaven, en el mundo de Arcavios: cinco colegios enfrentados por su filosofía, unos dragones que la fundaron y un campus donde estudiar puede ser tan peligroso como emocionante. Una guía para mis jugadores, para que nadie se pierda buscando lo básico.',
    heroKicker: 'Ambientación',
  },
]

// Página "Sobre mí" (de sitio, accesible desde la barra en cualquier campaña).
// Texto de relleno: edítalo a tu gusto y vuelve a lanzar `npm run import`.
// Para el retrato, deja una imagen en public/about.jpg y pon img: 'about.jpg'.
export const about = {
  kicker: 'Sobre mí',
  heading: 'Quién escribe esto',
  img: 'about.jpg',
  paras: [
    'Me llamo Irene, soy desarrolladora y una apasionada del rol. Llevo tres años jugando cada semana, y por el camino le he cogido el gustillo (rozando la obsesión, he de admitir) a tener buenas notas: ordenadas, completas y fáciles de releer.',
    'Toda la crónica vive en mi Obsidian, pero quería poder leerla con un aspecto más estilizado. Observatorio Arcano es justo eso: una capa bonita sobre esas notas que las convierte en un archivo navegable sin dejar de ser las mismas notas de siempre.',
    'Es un proyecto personal, sin ánimo de lucro y de uso privado para nuestras partidas.',
  ],
  contactLead: '¿Quieres contactar conmigo? Escríbeme a',
  email: 'irenelucenaprieto@gmail.com',
  stackLabel: 'Hecha con',
  stack: ['React', 'Vite', 'JavaScript', 'CSS', 'Firebase'],
}

// Arcos de Oro sobre Plata. El último (`to` alto) recoge las sesiones nuevas.
export const arcs = {
  'oro-sobre-plata': [
    { id: 'a1', roman: 'I', name: 'Bajo la Montaña', sub: 'El tumulario, Lunargentea y los primeros no muertos.', from: 1, to: 10 },
    { id: 'a2', roman: 'II', name: 'En la Infraoscuridad', sub: 'Chamanes, micónidos y los caminos de la izquierda.', from: 11, to: 20 },
    { id: 'a3', roman: 'III', name: 'El Ikea de Carne', sub: 'Orlbar, los ilícidos y la dragona con piel humana.', from: 21, to: 30 },
    { id: 'a4', roman: 'IV', name: 'Secretos y Susurros', sub: 'Maldiciones entre borrachos, la dragona y misiones peligrosas.', from: 31, to: 40 },
    { id: 'a5', roman: 'V', name: 'Tumularios', sub: 'Antiguas tumbas, viejos juramentos y no muertos.', from: 41, to: 50 },
    { id: 'a6', roman: 'VI', name: 'El Fin de Uthgar', sub: 'Drakhan, elegido; el campamento orco y el norte.', from: 51, to: 60 },
    { id: 'a7', roman: 'VII', name: 'Sangre del Norte', sub: 'Las tribus bárbaras, sus dioses y sus guerras.', from: 61, to: 70 },
    { id: 'a8', roman: 'VIII', name: 'Pacto con el Demonio', sub: 'Deudas con Orcus y el precio del poder.', from: 71, to: 80 },
    { id: 'a9', roman: 'IX', name: 'Rumbo al Anauroch', sub: 'Ghouls en Lunargentea y el desierto del rey dragón.', from: 81, to: 9999 },
  ],
}

const ACCENT = 'var(--color-accent-400)'
const NEUTRAL = 'var(--color-neutral-400)'

// La Compañía del Oso. `dot` colorea el punto en el aside y las fichas.
export const party = {
  'oro-sobre-plata': [
    {
      id: 'venti', name: 'Venti Fortunati', short: 'Bardo', tagline: 'Bardo tabaxi · La jugadora',
      img: 'campaigns/oro-sobre-plata/portraits/venti.png',
      status: 'Portadora del Orbe', dot: ACCENT,
      blurb: [
        'Del clan Zarpa Negra, de Chondath; se rumorea que su linaje llegó a gobernar Amn. Camada de tres, busca por toda la campaña a su hermano Corvo. Devoto de Milil, bardo del Colegio del Glamour, toca el shamisen y el baglamá.',
        'Porta dos fragmentos del Orbe dracónico, cada uno un tercio del alma de Malystryx, y ha sellado un pacto con Orcus. Fue amante de una noche de la dragona Ondrur.',
      ],
      facts: [
        { label: 'Raza', value: 'Tabaxi (clan Zarpa Negra)' },
        { label: 'Devoción', value: 'Milil' },
        { label: 'Colegio', value: 'Glamour' },
        { label: 'Montura', value: 'Zephyr' },
      ],
    },
    {
      id: 'leia', name: 'Leia', short: 'Ranger', tagline: 'Ranger elfa · Altarraíz',
      img: 'campaigns/oro-sobre-plata/portraits/leia.png',
      status: 'Salvar las marcas argénteas', dot: ACCENT,
      blurb: [
        'Del sur; huyó de su tribu. Su compañero animal es el oso Ursus y su arco está hecho con escamas de dragón. Entiende dracónico y tiene buen ojo para detectar no muertos.',
        'Hizo un pacto con las brujas del pantano que la enemistó con la Tribu del Grifo. Mantiene un romance con Yorus Mantoazur, en Lunargentea.',
      ],
      facts: [
        { label: 'Compañero', value: 'Ursus (oso)' },
        { label: 'Arma', value: 'Arco de escamas de dragón' },
        { label: 'Romance', value: 'Yorus Mantoazur' },
        { label: 'Origen', value: 'Del sur' },
      ],
    },
    {
      id: 'drakhan', name: 'Drakhan', short: 'Monje', tagline: 'Monje semiorco',
      img: 'campaigns/oro-sobre-plata/portraits/drakhan.png',
      status: 'Elegido de Uthgar', dot: ACCENT,
      blurb: [
        'Hijo de Kadu la Silenciosa (orca) y de Saldren Ilestra. En EP056 desterró para siempre tanto la furia de Uthgar como la de su propia sangre orca. Lleva tres tatuajes tribales —Grifo, Lobo y Árbol— que tiran hacia el noroeste.',
        'Candidato a unir las tribus utgardianas. Cartógrafo del grupo, habla orco y dracónico, es inmune a los venenos y a la embriaguez, y el único que tiene el mapa del Anauroch.',
      ],
      facts: [
        { label: 'Padres', value: 'Kadu y Saldren Ilestra' },
        { label: 'Tatuajes', value: 'Grifo · Lobo · Árbol' },
        { label: 'Idiomas', value: 'Orco, dracónico' },
        { label: 'Inmune a', value: 'Venenos y alcohol' },
      ],
    },
    {
      id: 'agaricus', name: 'Agáricus', short: 'Druida', tagline: 'Druida micónido',
      img: 'campaigns/oro-sobre-plata/portraits/agaricus.png',
      status: 'Regresó en EP077', dot: ACCENT,
      blurb: [
        'Expulsado de su tribu por su maestra Amanita, que quería para él algo más que ser un simple contribuyente de la colonia. Usa el Enclave Esmeralda y el claro de Mielikki; es el único con el conjuro de revivir y su compañero es Rannicus.',
        'Su colonia micónida fue capturada por los ilícidos y quedó casi aniquilada. Tras salvar a los supervivientes en Orlbar, se marchó un tiempo (EP027) a cuidar de su tribu y regresó al grupo en EP077.',
      ],
      facts: [
        { label: 'Círculo', value: 'Enclave Esmeralda' },
        { label: 'Compañero', value: 'Rannicus' },
        { label: 'Se fue', value: 'EP027' },
        { label: 'Volvió', value: 'EP077' },
      ],
    },
    {
      id: 'janzu', name: 'Janzu', short: 'Pícaro', tagline: 'Pícaro mediano · Cofregrande',
      img: 'campaigns/oro-sobre-plata/portraits/janzu.png',
      status: 'Infectado de licantropía', dot: NEUTRAL,
      blurb: [
        'Su padre de verdad lo cambió por un burro cuando era pequeño. En la jerga de los ladrones llama "padre" a Glimpetor —su jefe, arpista y agente Zhentarim—, cuyo puesto acabó heredando. Fue infiltrado de los Zhentarim.',
        'Entiende enano y dracónico. Su compañero es Sombra. Tenía un perro-montura, Tostada, que murió peleando heroicamente contra los ilícidos en Orlbar. Está infectado de licantropía de lobo, mordido por un hombre lobo de la Tribu del Lobo Gris; aún no se ha transformado.',
      ],
      facts: [
        { label: 'Alias', value: 'Cofregrande' },
        { label: 'Familiar', value: 'Sombra' },
        { label: 'Facción', value: 'Zhentarim (infiltrado)' },
        { label: 'Idiomas', value: 'Enano, dracónico' },
      ],
    },
    {
      id: 'alfred', name: 'Alfred', short: 'Forjado', tagline: 'Forjado (autómata) guerrero',
      status: 'Se despidió (EP077)', dot: NEUTRAL,
      blurb: [
        'Autómata venido de Eberron, creado para la guerra y liberado al acabar esta; fue mercenario, soldado y finalmente profesor de esgrima. Los ilícidos lo raptaron y lo intercambiaron a la colonia de Orlbar.',
        'Escapó y acabó con Jarlaxle y los drow de Bregan D’aerthe. No respira ni duerme. Es serio, gentil y muy creativo a la hora de pelear.',
      ],
      facts: [
        { label: 'Origen', value: 'Eberron' },
        { label: 'Se unió', value: 'EP028 / 031' },
        { label: 'Se fue', value: 'EP077' },
        { label: 'Vocación', value: 'Profesor de esgrima' },
      ],
    },
  ],

  strahd: [
    {
      id: 'elara', name: 'Elara', short: 'Clérigo', tagline: 'Clérigo aasimar · La jugadora',
      status: 'La jugadora', dot: ACCENT,
      blurb: ['Clériga aasimar, el personaje de la jugadora. Un faro de luz frente a las tinieblas de Barovia.'],
      facts: [{ label: 'Clase', value: 'Clérigo' }, { label: 'Raza', value: 'Aasimar' }],
    },
    {
      id: 'syn', name: 'Syn', short: 'Barda', tagline: 'Barda tiefling',
      status: 'Intercambió clase en EP14', dot: ACCENT,
      blurb: ['Tiefling. Desde EP15 lleva la clase de barda (Vicious Mockery, Patrón Hipnótico), tras intercambiarla con Arkarian.'],
      facts: [{ label: 'Clase', value: 'Barda (desde EP15)' }, { label: 'Raza', value: 'Tiefling' }],
    },
    {
      id: 'arkarian', name: 'Arkarian', short: 'Guerrero', tagline: 'Guerrero tiefling',
      status: 'Enterró el hacha (EP17)', dot: ACCENT,
      blurb: ['Tiefling. Desde EP15 es el guerrero del grupo (Giant’s Might, Second Wind). Heredó el hacha y la Runa de Fuego, y la enterró en EP17.'],
      facts: [{ label: 'Clase', value: 'Guerrero (desde EP15)' }, { label: 'Raza', value: 'Tiefling' }],
    },
    {
      id: 'bhaziros', name: 'Bhaziros', short: 'Paladín', tagline: 'Paladín dracónico',
      status: 'Juramento en Barovia', dot: ACCENT,
      blurb: ['Paladín de linaje dracónico.'],
      facts: [{ label: 'Clase', value: 'Paladín' }, { label: 'Raza', value: 'Dracónico' }],
    },
    {
      id: 'naylin', name: 'Naylin', short: 'Druida', tagline: 'Druida eladrin',
      status: 'Magia de las estaciones', dot: ACCENT,
      blurb: ['Druida eladrin, ligada a las estaciones del Reino Feérico.'],
      facts: [{ label: 'Clase', value: 'Druida' }, { label: 'Raza', value: 'Eladrin' }],
    },
  ],

  saltmarsh: [
    {
      id: 'virellia', name: 'Virellia Arcanthis', short: 'Maga', tagline: 'Maga elfa',
      img: 'campaigns/saltmarsh/portraits/virellia.png',
      status: 'La jugadora', dot: ACCENT,
      blurb: ['Maga elfa, el personaje de la jugadora. Lleva en el bolso un coral marino mágico sin identificar.'],
      facts: [{ label: 'Clase', value: 'Maga' }, { label: 'Raza', value: 'Elfa' }],
    },
    {
      id: 'genya', name: 'Genya Gulyayev', short: 'Fighter', tagline: 'Fighter dragonborn',
      img: 'campaigns/saltmarsh/portraits/genya.png',
      status: 'Sargento de la guardia', dot: ACCENT,
      blurb: ['Guerrera dragonborn. Es sargento de la guardia de Saltmarsh.'],
      facts: [{ label: 'Clase', value: 'Fighter' }, { label: 'Raza', value: 'Dragonborn' }],
    },
    {
      id: 'arkos', name: 'Arkos Hightower', short: 'Bard', tagline: 'Bardo humano',
      img: 'campaigns/saltmarsh/portraits/arkos.jpg',
      status: 'Drogado con Sal Roja', dot: NEUTRAL,
      blurb: ['Bardo humano. Cassandra lo drogó con Sal Roja; despertó físicamente reforzado y sin recuerdos. Usa un código de emergencia: cielo, suelo, árbol.'],
      facts: [{ label: 'Clase', value: 'Bard' }, { label: 'Raza', value: 'Humano' }],
    },
    {
      id: 'dravok', name: 'Dravok Kurrid', short: 'Bárbaro', tagline: 'Bárbaro goliath',
      img: 'campaigns/saltmarsh/portraits/Dravok.jpeg',
      status: 'Hijo adoptivo de Lankus', dot: ACCENT,
      blurb: ['Bárbaro goliath, hijo adoptivo de Lankus, dueño de la taberna Cabra de Mimbre. Brak-Thar, el Ejecutor, lo llama "hermano".'],
      facts: [{ label: 'Clase', value: 'Bárbaro' }, { label: 'Raza', value: 'Goliath' }],
    },
    {
      id: 'lodd', name: "Loddrantelmo 'Lodd'", short: 'Druida', tagline: 'Druida gnomo · Siempremojado',
      img: 'campaigns/saltmarsh/portraits/Lodd.png',
      status: 'Recuerda huellas en el pantano', dot: ACCENT,
      blurb: ['Druida gnomo, apodado Siempremojado. Recuerda huellas de hombres lagarto en el pantano.'],
      facts: [{ label: 'Clase', value: 'Druida' }, { label: 'Raza', value: 'Gnomo' }],
    },
  ],

  brujaluz: [
    {
      id: 'triss', name: 'Triss', short: 'Rogue', tagline: 'Pícara · La jugadora',
      img: 'campaigns/brujaluz/portraits/triss.png',
      status: 'La jugadora', dot: ACCENT,
      blurb: ['Pícara, el personaje de la jugadora. Robó las cartas entre las brujas (sin leer) y perdió un punto de Fuerza permanente en un trato con Bavlorna.'],
      facts: [{ label: 'Clase', value: 'Rogue' }, { label: 'Trato', value: 'Bavlorna (−1 Fuerza)' }],
    },
    {
      id: 'tharad', name: 'Tharad', short: 'Guerrero', tagline: 'Guerrero Rune Knight',
      status: 'Caballero de las runas', dot: ACCENT,
      blurb: ['Guerrero Rune Knight.'],
      facts: [{ label: 'Clase', value: 'Guerrero (Rune Knight)' }],
    },
    {
      id: 'luli', name: 'Luli', short: 'Barda', tagline: 'Barda · Monarca de Brujaluz',
      status: 'Monarca de Brujaluz', dot: ACCENT,
      blurb: ['Bardesa. Ostenta el título de Monarca de Brujaluz.'],
      facts: [{ label: 'Clase', value: 'Barda' }, { label: 'Título', value: 'Monarca de Brujaluz' }],
    },
    {
      id: 'remy', name: 'Remy', short: 'Druida', tagline: 'Druida',
      status: 'Curó a Brotor', dot: ACCENT,
      blurb: ['Druida (pronombres masculinos). Curó a Brotor durante el rescate de los niños.'],
      facts: [{ label: 'Clase', value: 'Druida' }],
    },
    {
      id: 'lirael', name: 'Lirael', short: 'Sorcerer', tagline: 'Sorcerer harengon',
      status: 'Magia salvaje', dot: ACCENT,
      blurb: ['Hechicera harengon.'],
      facts: [{ label: 'Clase', value: 'Sorcerer' }, { label: 'Raza', value: 'Harengon' }],
    },
  ],
}
